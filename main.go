package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/johnforster/fitorfcked/controllers"
	"github.com/johnforster/fitorfcked/initializers"
	"github.com/johnforster/fitorfcked/middleware"
)

func init() {
	initializers.LoadEnvs()
	initializers.ConnectDB()
}

func main() {
	r := gin.Default()

	r.GET("/hello", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"data": "hello world"})
	})

	r.POST("/auth/signup", controllers.CreateUser)
	r.POST("/auth/login", controllers.Login)
	r.GET("/user/profile", middleware.CheckAuth, controllers.GetUserProfile)
	r.POST("/activity/new", middleware.CheckAuth, controllers.HandleFileUploadToBucket)
	r.GET("/activity/all", middleware.CheckAuth, controllers.GetUserActivities)
	r.GET("/get-fit-images/:path", middleware.CheckAuth, controllers.GetImage)
	r.GET("/images/:path", controllers.HandleGetImage)
	r.Run()
}
