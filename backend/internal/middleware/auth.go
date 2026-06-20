package middleware

import (
	"net/http"
	"strings"

	"github.com/dvn-ad/seapedia/backend/internal/handlers"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var jwtKey=[]byte("jwt_lah_pokoknya")

func AuthMiddleware() gin.HandlerFunc{
	return func(c *gin.Context){
		authHeader:=c.GetHeader("Authorization")
		if authHeader==""{
			c.JSON(http.StatusUnauthorized,gin.H{"error":"Authorization header is required"})
			c.Abort()
			return 
		}

		parts:=strings.Split(authHeader," ")
		if len(parts)!=2 || parts[0]!="Bearer"{
			c.JSON(http.StatusUnauthorized,gin.H{"error":"Authorization header must be Bearer {token}"})
			c.Abort()
			return
		}

		tokenStr:=parts[1]
		claims:=&handlers.Claims{}

		token,err:=jwt.ParseWithClaims(tokenStr,claims,func(token *jwt.Token)(interface{},error){
			return jwtKey,nil
		})
		if err!=nil||!token.Valid{
			c.JSON(http.StatusUnauthorized,gin.H{"error":"Invalid token"})
			c.Abort()
			return
		}
		c.Set("user_id",claims.UserID)
		c.Set("username",claims.Username)
		c.Set("roles",claims.Roles)
		c.Next()
	}
}

func RequireRole(allowedRole string) gin.HandlerFunc {
	return func(c *gin.Context){
		activeRole:=c.GetHeader("X-Active-Role")
		if activeRole==""{
			c.JSON(http.StatusForbidden,gin.H{"error":"X-Acive-Role header is required for dashboard actions"})
			c.Abort()
			return 
		}

		if activeRole!=allowedRole{
			c.JSON(http.StatusForbidden,gin.H{"error":"Access denied for current active role"})
			c.Abort()
			return
		}

		userRolesInterface,exists:=c.Get("roles")
		if !exists{
			c.JSON(http.StatusUnauthorized,gin.H{"error":"Unauthorized"})
			c.Abort()
			return
		}

		userRoles:=userRolesInterface.([]string)
		hasRole:=false
		for _,r:=range userRoles{
			if r==activeRole{
				hasRole=true
				break
			}
		}

		if !hasRole{
			c.JSON(http.StatusForbidden,gin.H{"error":"User does not own the active role requested"})
			c.Abort()
			return
		}
		c.Next()
	}
}