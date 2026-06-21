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
	Stock       *int     `json:"stock" binding:"required,gte=0"`
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
	stockVal:=input.Stock
	product := models.Product{
		StoreID: store.ID,
		Name:        input.Name,
		Description: input.Description,
		Price:       input.Price,
		Stock:       *stockVal,
	}
	if err := config.DB.Create(&product).Error; err != nil {
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
	// productID,_:=c.Get("product_id")
	productID,err:=strconv.Atoi(c.Param("id"));
	if err!=nil{
		c.JSON(http.StatusBadRequest,gin.H{"error":"Invalid product ID"})
		return
	}
	
	var product models.Product
	err=config.DB.First(&product,productID).Error;
	if err!=nil{
		c.JSON(http.StatusNotFound,gin.H{"error":"Product not found"})
		return
	}

	var store models.Store
	err=config.DB.Where("id=? AND user_id=?",product.StoreID ,userID).First(&store).Error;
	if err!=nil{
		c.JSON(http.StatusForbidden,gin.H{"error":"Unauthorized to update this product"})
		return
	}
	
	var input ProductInput
	err=c.ShouldBindJSON(&input);
	if err!=nil{
		c.JSON(http.StatusBadRequest,gin.H{"error":err.Error()})
		return
	}
	stockVal:=input.Stock
	product.Name=input.Name
	product.Description=input.Description
	product.Price=input.Price
	product.Stock=*stockVal

	config.DB.Save(&product)
	c.JSON(http.StatusOK,product)
}


func DeleteProduct (c *gin.Context){
	userID,_:=c.Get("user_id")
	// productID,_:=c.Get("product_id")
	productID,err:=strconv.Atoi(c.Param("id"));
	if err!=nil{
		c.JSON(http.StatusBadRequest,gin.H{"error":"Invalid product ID"})
		return
	}

	var product models.Product
	err=config.DB.Where("id=?",productID).First(&product).Error;
	if err!=nil{
		c.JSON(http.StatusNotFound,gin.H{"error":"Product not found"})
		return
	}

	var store models.Store
	err=config.DB.Where("id=? AND user_id=?",product.StoreID,userID).First(&store).Error;
	if err!=nil{
		c.JSON(http.StatusForbidden,gin.H{"error":"Unauthorized to delete this product"})
		return
	}
	config.DB.Delete(&product)
	c.JSON(http.StatusOK,gin.H{"message":"Product deleted successfully"})
}

func GetCatalog (c *gin.Context){
	var products []models.Product
	config.DB.Find(&products)
	c.JSON(http.StatusOK,products)
}

func GetCatalogDetail(c *gin.Context){
	productID,_:=strconv.Atoi(c.Param("id"))

	var product models.Product
	if err:=config.DB.First(&product,productID).Error;err!=nil{
		c.JSON(http.StatusNotFound,gin.H{"error":"Product not found"})
		return
	}
	c.JSON(http.StatusOK,product)
}