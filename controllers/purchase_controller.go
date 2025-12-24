package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"gofiber-test/config"
	"gofiber-test/dto"
	"gofiber-test/models"
)

func CreatePurchase(c *fiber.Ctx) error {
	db := config.DB
	var req dto.CreatePurchaseRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "Invalid request"})
	}

	user := c.Locals("user").(*models.User)

	if req.SupplierID == 0 {
		return c.Status(400).JSON(fiber.Map{"message": "Supplier wajib dipilih"})
	}
	if len(req.Items) == 0 {
		return c.Status(400).JSON(fiber.Map{"message": "Items kosong"})
	}

	var grandTotal float64
	var details []models.PurchasingDetail
	var purchase models.Purchasing // Dideklarasikan di sini agar bisa diakses untuk webhook

	err := db.Transaction(func(tx *gorm.DB) error {
		var supplier models.Supplier
		if err := tx.First(&supplier, req.SupplierID).Error; err != nil {
			return fiber.NewError(400, "Supplier tidak ditemukan")
		}

		for _, itemReq := range req.Items {
			var item models.Item
			if err := tx.First(&item, itemReq.ItemID).Error; err != nil {
				return fiber.NewError(400, fmt.Sprintf("Item tidak ditemukan (ID: %d)", itemReq.ItemID))
			}

			if item.Stock < itemReq.Qty {
				return fiber.NewError(400, fmt.Sprintf("Stock tidak cukup untuk %s", item.Name))
			}

			subTotal := float64(itemReq.Qty) * item.Price
			grandTotal += subTotal

			details = append(details, models.PurchasingDetail{
				ItemID:   item.ID,
				Qty:      itemReq.Qty,
				SubTotal: subTotal,
			})

			item.Stock -= itemReq.Qty
			if err := tx.Save(&item).Error; err != nil {
				return err
			}
		}

		purchase = models.Purchasing{
			Date:       time.Now(),
			UserID:     user.ID,
			SupplierID: supplier.ID,
			GrandTotal: grandTotal,
		}

		if err := tx.Create(&purchase).Error; err != nil {
			return err
		}

		for i := range details {
			details[i].PurchasingID = purchase.ID
			if err := tx.Create(&details[i]).Error; err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"message": err.Error()})
	}

	// --- PROSES WEBHOOK ---
	// Gunakan ID dari purchase yang baru saja disimpan
	var fullPurchase models.Purchasing
	db.Preload("Supplier").
		Preload("PurchasingDetails.Item").
		First(&fullPurchase, purchase.ID)

	// 2. JALANKAN WEBHOOK (GOROUTINE)
	go func(p models.Purchasing, u string) {
		webhookURL := "https://webhook.site/0c9a98fc-9bee-435d-8ac0-15ab726519a1"

		// Susun list barang yang dibeli
		var itemsDetail []map[string]interface{}
		for _, d := range p.PurchasingDetails {
			itemsDetail = append(itemsDetail, map[string]interface{}{
				"item_id":   d.ItemID,
				"item_name": d.Item.Name, // Bisa diakses karena sudah di-Preload
				"quantity":  d.Qty,
				"price":     d.SubTotal / float64(d.Qty), // Harga satuan
				"subtotal":  d.SubTotal,
			})
		}

		// Susun Payload Lengkap
		payload := map[string]interface{}{
			"status":      "SUCCESS",
			"purchase_id": p.ID,
			"operator":    u,
			"supplier":    p.Supplier.Name,
			"amount":      p.GrandTotal,
			"created_at":  p.Date,
			"items":       itemsDetail, // DATA BARANG MASUK DI SINI
		}

		jsonData, _ := json.Marshal(payload)
		resp, err := http.Post(webhookURL, "application/json", bytes.NewBuffer(jsonData))

		if err != nil {
			fmt.Printf("Error sending webhook: %v\n", err)
			return
		}
		defer resp.Body.Close()

		fmt.Printf("Webhook sent! ID: %d, Items: %d, Status: %s\n",
			p.ID, len(itemsDetail), resp.Status)
	}(fullPurchase, user.Username)

	return c.JSON(fiber.Map{
		"id":          purchase.ID,
		"message":     "Purchase berhasil dibuat",
		"grand_total": grandTotal,
	})
}
