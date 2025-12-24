package main

import (
	"github.com/gofiber/fiber/v2"

	"gofiber-test/config"
	"gofiber-test/models"
	"gofiber-test/routes"
)

func main() {
	app := fiber.New()

	app.Static("/", "./static")

	config.ConnectDB()
	config.DB.AutoMigrate(
		&models.User{},
		&models.Supplier{},
		&models.Item{},
		&models.Purchasing{},
		&models.PurchasingDetail{},
	)

	routes.Setup(app)

	app.Listen(":3000")

}
