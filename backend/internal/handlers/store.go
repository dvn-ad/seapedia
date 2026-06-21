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
// CreateStore handles registering a new Seller store profile
// @Summary Create a Store profile
// @Description Register a store with a unique name. Active role must be 'Seller'.
// @Tags Store
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param body body StoreInput true "Store Details"
// @Success 201 {object} models.Store
// @Failure 400 {object} map[string]interface{} "Bad request"
// @Failure 409 {object} map[string]interface{} "Store name already exists or user already owns a store" 
// @Router /seller/store [post]
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

// CreateProduct adds a new item to the seller's store
// @Summary Add a new product
// @Tags Store Products
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param body body ProductInput true "Product details"
// @Success 201 {object} models.Product
// @Router /seller/products [post]
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

// GetSellerProducts lists products owned by the active seller
// @Summary List seller products
// @Tags Store Products
// @Produce json
// @Security BearerAuth
// @Param        X-Active-Role  header  string  true  "Active user role should be Buyer"
// @Param        id             path    int     true  "Product ID"
// @Success 200 {array} models.Product
// @Router /seller/products [get]
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

// UpdateProduct updates product details
// @Summary Update product details
// @Tags Store Products
// @Security BearerAuth
// @Param id path int true "Product ID"
// @Param body body ProductInput true "Updated product payload"
// @Success 200 {object} models.Product
// @Router /seller/products/{id} [put]
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

// DeleteProduct deletes an inventory item
// @Summary Delete product
// @Tags Store Products
// @Security BearerAuth
// @Param id path int true "Product ID"
// @Success 200 {object} map[string]interface{}
// @Router /seller/products/{id} [delete]
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
// GetCatalog returns all store products (Public Catalog)
// @Summary View public catalog
// @Tags Public Catalog
// @Produce json
// @Success 200 {array} models.Product
// @Router /catalog [get]
func GetCatalog (c *gin.Context){
	var products []models.Product
	config.DB.Find(&products)
	c.JSON(http.StatusOK,products)
}

// GetCatalogDetail returns single product details
// @Summary View product details
// @Tags Public Catalog
// @Produce json
// @Param id path int true "Product ID"
// @Success 200 {object} models.Product
// @Router /catalog/{id} [get]
func GetCatalogDetail(c *gin.Context){
	productID,_:=strconv.Atoi(c.Param("id"))

	var product models.Product
	if err:=config.DB.First(&product,productID).Error;err!=nil{
		c.JSON(http.StatusNotFound,gin.H{"error":"Product not found"})
		return
	}
	c.JSON(http.StatusOK,product)
}