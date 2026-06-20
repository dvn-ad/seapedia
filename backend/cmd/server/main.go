package main

import(
	"github.com/dvn-ad/seapedia/backend/internal/config"
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
	r.Run(":8080")
}