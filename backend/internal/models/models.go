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
