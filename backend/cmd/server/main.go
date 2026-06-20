package main

import(
	"github.com/dvn-ad/seapedia/backend/internal/config"
	"github.com/dvn-ad/seapedia/backend/internal/handlers"
	"github.com/dvn-ad/seapedia/backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func main(){
	config.InitDB()
	
	r:=gin.Default()

	r.GET("/health",func(c*gin.Context){
		c.JSON(200,gin.H{
			"status":"healthy",
		})
	})

	r.POST("/api/auth/register",handlers.Register)
	r.POST("/api/auth/login",handlers.Login)


	protected:=r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		protected.GET("/auth/profile",handlers.GetProfile)

		protected.GET("/buyer/dashboard-data", middleware.RequireRole("Buyer"),func(c *gin.Context){
			c.JSON(200, gin.H{"message":"Welcome Buyer!"})
		})
	}

	r.Run(":8080")
}