package middlewares

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"

	"gofiber-test/config"
	"gofiber-test/models"
	"gofiber-test/utils"
)

func JWTProtected(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")

	if authHeader == "" {
		return c.Status(401).JSON(fiber.Map{
			"error": "Missing token",
		})
	}

	// Ambil token tanpa "Bearer "
	tokenString := strings.Replace(authHeader, "Bearer ", "", 1)

	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		// Validasi signing method
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.NewError(401, "Invalid signing method")
		}
		return utils.JWT_SECRET, nil
	})

	if err != nil || !token.Valid {
		return c.Status(401).JSON(fiber.Map{
			"error": "Invalid token",
		})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(401).JSON(fiber.Map{
			"error": "Invalid claims",
		})
	}

	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		return c.Status(401).JSON(fiber.Map{
			"error": "Invalid user id",
		})
	}

	userID := uint(userIDFloat)

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return c.Status(401).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Simpan user ke context
	c.Locals("user", &user)

	return c.Next()
}

func IsAdmin(c *fiber.Ctx) error {
	// Ambil data user yang disimpan oleh JWTProtected di c.Locals
	user, ok := c.Locals("user").(*models.User)

	if !ok || user.Role != "admin" {
		return c.Status(403).JSON(fiber.Map{
			"error": "Akses ditolak: Anda bukan Admin",
		})
	}

	return c.Next()
}
