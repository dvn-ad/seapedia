package handlers

import(
	"net/http"

	"github.com/dvn-ad/seapedia/backend/internal/config"
	"github.com/dvn-ad/seapedia/backend/internal/models"
	"github.com/gin-gonic/gin"
)

type SubmitReviewInput struct{
	ReviewerName string `json:"reviewer_name" binding:"required"`
	Rating int `json:"rating" binding:"required,min=1,max=5"`
	Comment string `json:"comment" binding:"required"`
}

// SubmitReview handles saving a new application review
// @Summary Submit an application review
// @Description Submit feedback about the website or application experience. Rating must be between 1 and 5.
// @Tags Reviews
// @Accept json
// @Produce json
// @Param body body SubmitReviewInput true "Review Payload"
// @Success 201 {object} map[string]interface{} "Review submitted successfully"
// @Failure 400 {object} map[string]interface{} "Validation error"
// @Router /reviews [post]
func SubmitReview(c *gin.Context){
	var input SubmitReviewInput
	if err:=c.ShouldBindJSON(&input);err!=nil{
		c.JSON(http.StatusBadRequest,gin.H{"error":err.Error()})
		return
	}

	review:=models.AppReview{
		ReviewerName: input.ReviewerName,
		Rating: input.Rating,
		Comment: input.Comment,
	}
	if err:=config.DB.Create(&review).Error;err!=nil{
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Failed to submit review"})
		return
	}
	c.JSON(http.StatusCreated,gin.H{"message":"Review submitted succesfully"})
}

// GetReviews returns all application reviews
// @Summary List application reviews
// @Description Get a list of all public application and website feedback
// @Tags Reviews
// @Produce json
// @Success 200 {array} models.AppReview "List of reviews"
// @Router /reviews [get]
func GetReview(c *gin.Context){
	var reviews []models.AppReview
	if err:=config.DB.Order("created_at DESC").Find(&reviews).Error;err!=nil{
		c.JSON(http.StatusInternalServerError,gin.H{"error":"Failed to fetch reviews"})
		return
	}
	c.JSON(http.StatusOK,reviews)
}
