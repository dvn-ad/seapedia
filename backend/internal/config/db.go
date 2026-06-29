package config

import (
	"fmt"
	"log"
	"os"

	"github.com/dvn-ad/seapedia/backend/internal/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"github.com/joho/godotenv"
)

var DB *gorm.DB

func getEnv(key string)string{
	value,_:=os.LookupEnv(key)
	return value
}

func InitDB(){
	if err:=godotenv.Load();err!=nil{
		log.Fatalf("Couldnt find .env file")
	}
	host,_:=os.LookupEnv("DB_HOST")
	port,_:=os.LookupEnv("DB_PORT")
	user,_:=os.LookupEnv("DB_USER")
	pass,_:=os.LookupEnv("DB_PASSWORD")
	dbname,_:=os.LookupEnv("DB_NAME")
	
	dsn:=fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta", host,user,pass,dbname,port)

	var err error
	DB,err=gorm.Open(postgres.Open(dsn),&gorm.Config{})
	if err!=nil{
		log.Fatalf("Failed to connnect to database: %v", err)
	}
	log.Println("Database connection established")

	err=DB.AutoMigrate(&models.User{},&models.UserRole{},&models.AppReview{},&models.Product{},&models.Store{})
	if err!=nil{
		log.Fatalf("Database migration failed: %v",err)
	}
	log.Println("Database migration completed")
}