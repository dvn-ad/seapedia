package main

import(
	"github.com/dvn-ad/seapedia/backend/internal/config"
	"github.com/dvn-ad/seapedia/backend/internal/handlers"
	"github.com/dvn-ad/seapedia/backend/internal/middleware"
	"github.com/gin-gonic/gin"
	
	_ "github.com/dvn-ad/seapedia/backend/docs"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title SEAPEDIA API
// @version 1.0
// @description Interactive API documentation for the SEAPEDIA marketplace system.
// @host localhost:8080
// @BasePath /api
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main(){
	config.InitDB()
	
	r:=gin.Default()
	r.Use(middleware.CORSMiddleware())

	r.GET("/swagger/*any",ginSwagger.WrapHandler(swaggerFiles.Handler))
	r.GET("/health",func(c*gin.Context){
		c.JSON(200,gin.H{
			"status":"healthy",
		})
	})

	r.POST("/api/auth/register",handlers.Register)
	r.POST("/api/auth/login",handlers.Login)
	r.GET("/api/reviews",handlers.GetReview)
	r.POST("/api/reviews",handlers.SubmitReview)
	r.GET("/api/catalog",handlers.GetCatalog)
	r.GET("/api/catalog/:id",handlers.GetCatalogDetail)

	protected:=r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/auth/profile",handlers.GetProfile)
		protected.GET("/buyer/dashboard-data", middleware.RequireRole("Buyer"),func(c *gin.Context){
			c.JSON(200, gin.H{"message":"Welcome Buyer!"})
		})

		seller:=protected.Group("/seller")
		seller.Use(middleware.RequireRole("Seller"))
		{
			seller.POST("/store",handlers.CreateStore)
			seller.GET("/store",handlers.GetStore)
			seller.GET("/products",handlers.GetSellerProduct)
			seller.POST("/products",handlers.CreateProduct)
			seller.PUT("/products/:id",handlers.UpdateProduct)
			seller.DELETE("/products/:id",handlers.DeleteProduct)
		}

	}


	r.Run(":8080")
}