package handlers

import(
	"net/http"
	"time"
	"github.com/dvn-ad/seapedia/backend/internal/config"
	"github.com/dvn-ad/seapedia/backend/internal/models"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey=[]byte("jwt_lah_pokoknya")

type Claims struct{
	UserID uint `json:"user_id"`
	Username string `json:"username"`
	Roles []string `json:"Roles"`
	jwt.RegisteredClaims
}

type RegisterInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	Roles []string `json:"roles" binding:"required,min=1"`
}

type LoginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// Register handler
    // @Summary Register a new user
    // @Description Creates a new user profile with selected roles (Admin, Seller, Buyer, Driver)
    // @Tags Auth
    // @Accept json
    // @Produce json
    // @Param body body RegisterInput true "Registration Payload"
    // @Success 201 {object} map[string]interface{} "User registered successfully"
    // @Failure 400 {object} map[string]interface{} "Invalid role or request data"
    // @Failure 499 {object} map[string]interface{} "Username already exists"
    // @Router /auth/register [post]
func Register(c *gin.Context){
	var input RegisterInput
	if err:=c.ShouldBindJSON(&input);err!=nil{
		c.JSON(http.StatusBadRequest,gin.H{"error" : err.Error()})
		return
	}

	allowedRoles:=map[string]bool{"Admin":true,"Seller":true,"Buyer":true,"Driver":true}
	var roles []models.UserRole
	for _,r:=range input.Roles{
		if !allowedRoles[r]{
			c.JSON(http.StatusBadRequest,gin.H{"error":"Invalid role "+r})
			return
		}
		roles=append(roles, models.UserRole{Role: r})
	}

	hashedPassword,err:=bcrypt.GenerateFromPassword([]byte(input.Password),bcrypt.DefaultCost)
	if err!=nil{
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Failed to hash password"})
		return
	}
	
	user:=models.User{
		Username: input.Username,
		PasswordHash: string(hashedPassword),
		Roles: roles,
	}

	if err:=config.DB.Create(&user).Error;err!=nil{
		c.JSON(http.StatusConflict,gin.H{"error":"Username already exists"})
		return
	}
	c.JSON(http.StatusCreated,gin.H{"message":"User registered successfully"})

	
}

// Login handler
    // @Summary Login user
    // @Description Log in user and return JWT token alongside registered roles
    // @Tags Auth
    // @Accept json
    // @Produce json
    // @Param body body LoginInput true "Login Payload"
    // @Success 200 {object} map[string]interface{} "Returns JWT Token & Role list"
    // @Failure 400 {object} map[string]interface{} "Invalid credentials schema"
    // @Failure 401 {object} map[string]interface{} "Invalid credentials"
    // @Router /auth/login [post]
func Login(c *gin.Context){
	var input LoginInput
	if err:=c.ShouldBindJSON(&input);err!=nil{
		c.JSON(http.StatusBadRequest,gin.H{"error":"Invalid credentials"})
	}

	var user models.User
	if err:=config.DB.Preload("Roles").Where("username = ?",input.Username).First(&user).Error; err!=nil{
		c.JSON(http.StatusUnauthorized,gin.H{"error":"Invalid credentials"})
		return
	}

	if err:=bcrypt.CompareHashAndPassword([]byte(user.PasswordHash),[]byte(input.Password));err!=nil{
		c.JSON(http.StatusUnauthorized,gin.H{"error":"Invalid credentials"})
		return
	}

	var roleStrings []string
	for _,r:=range user.Roles{
		roleStrings=append(roleStrings, r.Role)
	}

	expirationTime:=time.Now().Add(24*time.Hour)
	claims:=&Claims{
		UserID: user.ID,
		Username: user.Username,
		Roles: roleStrings,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	
	token:=jwt.NewWithClaims(jwt.SigningMethodHS256,claims)
	tokenString,err:=token.SignedString(jwtKey)
	if err!=nil{
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Could not generate token"})
		return
	}
	c.JSON(http.StatusOK,gin.H{
		"token":tokenString,
		"roles":roleStrings,
	})
}

// GetProfile returns current user information
    // @Summary Get logged-in user profile
    // @Description Fetches current credentials using authentication token
    // @Tags Auth
    // @Produce json
    // @Security BearerAuth
    // @Success 200 {object} map[string]interface{} "User profile details"
    // @Failure 401 {object} map[string]interface{} "Unauthorized"
    // @Router /auth/profile [get]
func GetProfile(c *gin.Context){
	userID, exists:=c.Get("user_id")
	if !exists{
		c.JSON(http.StatusUnauthorized,gin.H{"error":"Unauthorized"})
		return
	}

	var user models.User
	if err:=config.DB.Preload("Roles").First(&user,userID).Error;err!=nil{
		c.JSON(http.StatusNotFound,gin.H{"error":"User not found"})
		return
	}
	var roles []string
	for _,r:=range user.Roles{
		roles=append(roles, r.Role)
	}

	c.JSON(http.StatusOK,gin.H{
		"id":user.ID,
		"username":user.Username,
		"roles":roles,
	})
}