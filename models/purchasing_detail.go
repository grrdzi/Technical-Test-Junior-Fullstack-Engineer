package models

import "gorm.io/gorm"

type PurchasingDetail struct {
	gorm.Model

	ItemID uint
	Item   Item

	PurchasingID uint
	Purchasing   Purchasing

	Qty      int     `gorm:"not null"`
	SubTotal float64 `gorm:"not null"`
}
