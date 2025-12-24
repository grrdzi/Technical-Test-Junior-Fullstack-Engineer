package routes

import (
	"gofiber-test/controllers"
	"gofiber-test/middlewares"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	api := app.Group("/api")

	// ================= AUTH (PUBLIC) =================
	auth := api.Group("/auth")
	auth.Post("/register", controllers.Register)
	auth.Post("/login", controllers.Login)

	// ================= SEMUA AKSES (PROTECTED) =================
	// Menggunakan JWTProtected agar hanya user login yang bisa akses
	protected := api.Group("/", middlewares.JWTProtected)

	// Purchasing bisa diakses oleh Admin maupun Staff
	protected.Post("/purchase", controllers.CreatePurchase)

	// Get Data (Biasanya Staff butuh melihat item/supplier untuk membuat Purchase)
	protected.Get("/items", controllers.GetItems)
	protected.Get("/suppliers", controllers.GetSuppliers)

	// ================= KHUSUS ADMIN =================
	// Menambahkan middlewares.IsAdmin setelah JWTProtected
	admin := protected.Group("/", middlewares.IsAdmin)

	// Items (Hanya Admin yang bisa Tambah, Edit, Hapus)
	admin.Post("/items", controllers.CreateItem)
	admin.Put("/items/:id", controllers.UpdateItem)
	admin.Delete("/items/:id", controllers.DeleteItem)

	// Suppliers (Hanya Admin yang bisa Tambah, Edit, Hapus)
	admin.Post("/suppliers", controllers.CreateSupplier)
	admin.Put("/suppliers/:id", controllers.UpdateSupplier)
	admin.Delete("/suppliers/:id", controllers.DeleteSupplier)
}
