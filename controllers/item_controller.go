package controllers

import (
	"gofiber-test/config"
	"gofiber-test/models"

	"github.com/gofiber/fiber/v2"
)

// CREATE
func CreateItem(c *fiber.Ctx) error {
	var item models.Item

	if err := c.BodyParser(&item); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid input",
		})
	}

	config.DB.Create(&item)
	return c.JSON(item)
}

// READ
func GetItems(c *fiber.Ctx) error {
	var items []models.Item
	config.DB.Find(&items)
	return c.JSON(items)
}

// UPDATE
func UpdateItem(c *fiber.Ctx) error {
	id := c.Params("id")
	var item models.Item

	if err := config.DB.First(&item, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
	}

	c.BodyParser(&item)
	config.DB.Save(&item)

	return c.JSON(item)
}

// DELETE
func DeleteItem(c *fiber.Ctx) error {
	id := c.Params("id")
	config.DB.Delete(&models.Item{}, id)
	return c.JSON(fiber.Map{"message": "Item deleted"})
}
