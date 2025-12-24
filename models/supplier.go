package models

import (
	"time"

	"gorm.io/gorm"
)

type Supplier struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Name    string `json:"name"`
	Email   string `json:"email"`
	Address string `json:"address"`

	Purchasings []Purchasing `json:"-"`
}
