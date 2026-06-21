package handlers

import (
	"github.com/dvn-ad/seapedia/backend/internal/config"
	"github.com/dvn-ad/seapedia/backend/internal/models"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type StoreInput struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
}

type ProductInput struct {
	Name        string  `json:"name" binding:"required"`
	Description string  `json:"description"`
	Price       float64 `json:"price" binding:"required,gt=0"`
	Stock       int     `json:"stock" binding:"required,gte=0"`
}

func CreateStore(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var input StoreInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	var existingStore models.Store
	if err := config.DB.Where("user_id = ?", userID).First(&existingStore).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "You already own a store"})
		return
	}

	store := models.Store{
		UserID:      userID.(uint),
		Name:        input.Name,
		Description: input.Description,
	}

	if err := config.DB.Create(&store).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Store name already exists"})
	}
	c.JSON(http.StatusCreated, store)
}

func CreateProduct(c *gin.Context) {
	userID, _ := c.Get("user_id")
	var store models.Store

	if err := config.DB.Where("user_id=?", userID).First(&store).Error; err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "You must create a store first"})
		return
	}

	var input ProductInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	product := models.Product{
		Name:        input.Name,
		Description: input.Description,
		Price:       input.Price,
		Stock:       input.Stock,
	}
	if err := config.DB.Create(&product); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}
	c.JSON(http.StatusOK, product)
}

func GetSellerProduct(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var store models.Store
	if err := config.DB.Where("user_id=?", userID).First(&store).Error; err != nil {
		c.JSON(http.StatusOK, []models.Product{})
		return
	}
	var products []models.Product
	config.DB.Where("store_id=?", store.ID).Find(&products)
	c.JSON(http.StatusOK, products)
}

func UpdateProduct (c *gin.Context){
	userID,_:=c.Get("user_id")
	productID,_:=c.Get("product_id")

	var product models.Product
	if err:=config.DB.First(&product,productID).Error;err!=nil{
		c.JSON(http.StatusNotFound,gin.H{"error":"Product not found"})
		return
	}

	var store models.Store
	if err:=config.DB.Where("id=? AND user_id=?",product.StoreID ,userID).First(&store).Error;err!=nil{
		c.JSON(http.StatusForbidden,gin.H{"error":"Unauthorized to update this product"})
		return
	}
	
	var input ProductInput
	if err:=c.ShouldBindJSON(&input);err!=nil{
		c.JSON(http.StatusBadRequest,gin.H{"error":err.Error()})
		return
	}

	product.Name=input.Name
	product.Description=input.Description
	product.Price=input.Price
	product.Stock=input.Stock

	config.DB.Save(&product)
	c.JSON(http.StatusOK,product)
}




