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
	Wallet       *Wallet    `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"wallet,omitempty"`
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
	ID          uint      `gorm:"primaryKey" json:"id"`
	StoreID     uint      `gorm:"not null" json:"store_id"`
	Name        string    `gorm:"uniqueIndex;not null;size:100" json:"name"`
	Description string    `gorm:"type:text" json:"description"`
	Price       float64   `gorm:"not null" json:"price"`
	Stock       int       `gorm:"not null;default:0" json:"stock"`
	CreatedAt   time.Time `json:"created_at"`

}

type Wallet struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    User      `gorm:"uniqueIndex;not null" json:"user_id"`
	Balance   float64   `gorm:"not null;default:0" json:"balance"`
	UpdatedAt time.Time `json:"updated_at"`
}

type WalletTransaction struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	WalletID  uint      `gorm:"not null" json:"wallet_id"`
	Amount    float64   `gorm:"not null" json:"amount"`
	Type      string    `gorm:"size:20;not null" json:"type"` // topup, checkout, refund
	CreatedAt time.Time `json:"created_at"`
}

type Address struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    User      `gorm:"uniqueIndex;not null" json:"user_id"`
	Details   string    `gorm:"text;not null" json:"details"`
	CreatedAt time.Time `json:"created_at"`
}

type CartItem struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null;uniqueIndex:idx_user_product" json:"user_id"`
	ProductID uint      `gorm:"not null;uniqueIndex:idx_user_product" json:"product_id"`
	Product   Product   `gorm:"foreignKey:ProductID" json:"product,omitempty"`
	Quantity  int       `gorm:"not null;default:1" json:"quantity"`
	CreatedAt time.Time `json:"created_at"`
}

type Order struct {
	ID             uint                 `gorm:"primaryKey" json:"id"`
	BuyerID        uint                 `gorm:"not null" json:"buyer_id"`
	StoreID        uint                 `gorm:"not null" json:"store_id"`
	Subtotal       float64              `gorm:"not null" json:"subtotal"`
	DeliveryFee    float64              `gorm:"not null" json:"delivery_fee"`
	Tax            float64              `gorm:"not null" json:"tax"` // PPN 12%
	FinalTotal     float64              `gorm:"not null" json:"final_total"`
	DeliveryMethod string               `gorm:"size:20;not null" json:"delivery_method"` // instant , next day, regular
	Status         string               `gorm:"size:30;not null" json:"status"`          // sedang dikemas
	CreatedAt      time.Time            `json:"created_at"`
	Items          []OrderItem          `gorm:"foreignKey:OrderID" json:"items,omitempty"`
	History        []OrderStatusHistory `gorm:"foreignKey:OrderID" json:"history,omitempty"`
}

type OrderItem struct {
	ID        uint    `gorm:"primaryKey" json:"id"`
	OrderID   uint    `gorm:"not null" json:"order_id"`
	ProductID uint    `gorm:"not null" json:"product_id"`
	Name      string  `gorm:"size:100;not null" json:"name"`
	Price     float64 `gorm:"not null" json:"price"`
	Quantity  int     `gorm:"not null" json:"quantity"`
}

type OrderStatusHistory struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	OrderID   uint      `gorm:"not null" json:"order_id"`
	Status    string    `gorm:"size:30;not null" json:"status"`
	CreatedAt time.Time `json:"created_at"`
}
