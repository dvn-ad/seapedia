package config

import (
	"fmt"
	"log"
	"os"

	"github.com/dvn-ad/seapedia/backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func getEnv(key,fallback string)string{
	if value,exists:=os.LookupEnv(key);exists{
		return value
	}
	return fallback
}

func InitDB(){
	host:=getEnv("DB_HOST","localhost")
	port:=getEnv("DB_PORT","5432")
	user:=getEnv("DB_USER","postgres")
	pass:=getEnv("DB_PASSWORD","postgres")
	dbname:=getEnv("DB_NAME","seapedia")
	
	dsn:=fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta", host,user,pass,dbname,port)

	var err error
	DB,err=gorm.Open(postgres.Open(dsn),&gorm.Config{})
	if err!=nil{
		log.Fatalf("Failed to connnect to database: %v", err)
	}
	log.Println("Database connection established")

	err=DB.AutoMigrate(&models.User{},&models.UserRole{},&models.AppReview{})
	if err!=nil{
		log.Fatalf("Database migration failed: %v",err)
	}
	log.Println("Database migration completed")
}