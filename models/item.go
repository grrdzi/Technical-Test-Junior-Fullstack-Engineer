package models

import (
	"time"

	"gorm.io/gorm"
)

type Item struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Name  string  `json:"name"`
	Stock int     `json:"stock"`
	Price float64 `json:"price"`

	PurchasingDetails []PurchasingDetail `json:"-"`
}
