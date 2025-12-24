package models

import (
	"time"

	"gorm.io/gorm"
)

type Purchasing struct {
	gorm.Model

	Date       time.Time `gorm:"not null"`
	GrandTotal float64   `gorm:"not null"`

	UserID uint
	User   User

	SupplierID uint
	Supplier   Supplier

	PurchasingDetails []PurchasingDetail
}
