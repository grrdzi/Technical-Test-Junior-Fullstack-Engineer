package controllers

import (
	"gofiber-test/config"
	"gofiber-test/models"

	"github.com/gofiber/fiber/v2"
)

func CreateSupplier(c *fiber.Ctx) error {
	var supplier models.Supplier

	if err := c.BodyParser(&supplier); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid input"})
	}

	config.DB.Create(&supplier)
	return c.JSON(supplier)
}

func GetSuppliers(c *fiber.Ctx) error {
	var suppliers []models.Supplier
	config.DB.Find(&suppliers)
	return c.JSON(suppliers)
}

func UpdateSupplier(c *fiber.Ctx) error {
	id := c.Params("id")
	var supplier models.Supplier

	if err := config.DB.First(&supplier, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Supplier not found"})
	}

	c.BodyParser(&supplier)
	config.DB.Save(&supplier)

	return c.JSON(supplier)
}

func DeleteSupplier(c *fiber.Ctx) error {
	id := c.Params("id")
	config.DB.Delete(&models.Supplier{}, id)
	return c.JSON(fiber.Map{"message": "Supplier deleted"})
}
