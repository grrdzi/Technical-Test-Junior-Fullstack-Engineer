package controllers

import (
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"

	"gofiber-test/config"
	"gofiber-test/models"
	"gofiber-test/utils"
)

func Register(c *fiber.Ctx) error {
	var input models.User
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Format input tidak valid"})
	}

	// --- VALIDASI MANUAL SEBELUM CREATE ---
	var existingUser models.User
	// Cek apakah username sudah ada
	err := config.DB.Where("username = ?", input.Username).First(&existingUser).Error
	if err == nil {
		// Jika tidak error, berarti user DITEMUKAN (Duplikat)
		return c.Status(400).JSON(fiber.Map{"message": "Username sudah digunakan"})
	}
	// --------------------------------------

	// Hash Password
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.Password), 10)
	input.Password = string(hashedPassword)

	// Simpan ke DB (Sekarang kemungkinan gagal karena duplikat jauh lebih kecil)
	if err := config.DB.Create(&input).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "Gagal menyimpan ke database"})
	}

	return c.Status(201).JSON(fiber.Map{"message": "Register success"})
}

func Login(c *fiber.Ctx) error {
	var input models.User
	var user models.User

	// 1. Parsing Body (Mengambil username, password, dan role dari Frontend)
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Format input tidak valid",
		})
	}

	// 2. Cari User berdasarkan Username
	if err := config.DB.Where("username = ?", input.Username).First(&user).Error; err != nil {
		return c.Status(401).JSON(fiber.Map{
			"error": "Username tidak terdaftar",
		})
	}

	// 3. CEK ROLE (Validasi apakah role yang dipilih sesuai dengan di DB)
	// Jika user memilih 'staff' tapi di DB dia adalah 'admin', maka login ditolak.
	if input.Role != user.Role {
		return c.Status(403).JSON(fiber.Map{
			"error": "Role yang dipilih salah. Anda terdaftar sebagai " + user.Role,
		})
	}

	// 4. Bandingkan Password
	err := bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(input.Password),
	)

	if err != nil {
		return c.Status(401).JSON(fiber.Map{
			"error": "Password salah",
		})
	}

	// 5. Generate Token
	token, err := utils.GenerateToken(user.ID, user.Role)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Gagal membuat token akses",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Login berhasil",
		"token":   token,
	})
}
