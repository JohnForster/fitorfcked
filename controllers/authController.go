package controllers

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/johnforster/fitorfcked/initializers"
	"github.com/johnforster/fitorfcked/models"
	"golang.org/x/crypto/bcrypt"
)

type AuthCreateInput struct {
	Email    string `json:"email" binding:"required"`
	Name     string `json:"name" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type AuthCreateResponse struct {
	ID    uint   `json:"id"`
	Email string `json:"email"`
}

type AuthInput struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func CreateUser(c *gin.Context) {
	var authInput AuthCreateInput
	if err := c.ShouldBindJSON(&authInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var userFound models.User
	initializers.DB.Where("email=?", authInput.Email).Find(&userFound)

	if userFound.ID != 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already registered"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(authInput.Password), bcrypt.DefaultCost)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := models.User{
		Email:    authInput.Email,
		Name:     authInput.Name,
		Password: string(hashedPassword),
	}

	initializers.DB.Create(&user)

	response := AuthCreateResponse{
		ID:    user.ID,
		Email: user.Email,
	}

	c.JSON(http.StatusOK, gin.H{"data": response})
}

func Login(c *gin.Context) {
	var authInput AuthInput

	if err := c.ShouldBindJSON(&authInput); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var userFound models.User
	initializers.DB.Where("email=?", authInput.Email).Find(&userFound)

	if userFound.ID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(userFound.Password), []byte(authInput.Password)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid password"})
		return
	}

	one_day := time.Hour * 24
	generateToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  userFound.ID,
		"exp": time.Now().Add(one_day).Unix(),
	})

	token, err := generateToken.SignedString([]byte(os.Getenv("SECRET")))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to generate token"})
	}

	c.JSON(200, gin.H{
		"token": token,
	})
}

func GetUserProfile(c *gin.Context) {

	user, _ := c.Get("currentUser")

	c.JSON(200, gin.H{
		"user": user,
	})
}
