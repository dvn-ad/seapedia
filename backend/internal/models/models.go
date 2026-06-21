package models

import (
	"time"
)

type User struct {
	ID           uint       `gorm:"primaryKey" json:"id"`
	Username     string     `gorm:"uniqueIndex;not null; size:50" json:"username"`
	PasswordHash string     `gorm:"not null" json:"-"`
	Roles        []UserRole `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"roles"`
	CreatedAt    time.Time  `json:"created_at"`
	Store        *Store     `gorm:"foreignKey:userID" json:"user_id"`
}

type UserRole struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null;uniqueIndex:idx_user_role" json:"user_id"`
	Role      string    `gorm:"not null;size:20;uniqueIndex:idx_user_role" json:"role"` // admin, seller, buyer, driver
	CreatedAt time.Time `json:"created_at"`
}

type AppReview struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	ReviewerName string    `gorm:"not null;size:100" json:"reviewer_name"`
	Rating       int       `gorm:"not null" json:"rating"`
	Comment      string    `gorm:"type:text;not null" json:"comment"`
	CreatedAt    time.Time `json:"created_at"`
}

type Store struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"uniqueIndex;not null" json:"user_id"`
	Name        string    `gorm:"uniqueIndex;not null;size:100" json:"name"`
	Description string    `gorm:"type:text" json:"description"`
	Products    []Product `gorm:"foreignKey:StoreID;constraint:OnDelete:CASCADE" json:"products,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
}

type Product struct {
	ID          uint    `gorm:"primaryKey" json:"id"`
	ProductID   uint    `gorm:"uniqueIndex;not null" json:"product_id"`
	Name        string  `gorm:"uniqueIndex;not null;size:100" json:"name"`
	Description string  `gorm:"type:text" json:"description"`
	Price       float64 `gorm:"not null" json:"price"`
	Stock       int     `gorm:"not null;default:0" json:"stock"`
	CreatedAt   time.Time `json:"created_at"`
}
