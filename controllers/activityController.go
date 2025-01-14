package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/johnforster/fitorfcked/initializers"
	"github.com/johnforster/fitorfcked/models"
)

type ResponseUser struct {
	Name       string             `json:"name"`
	Activities []ResponseActivity `json:"activities"`
}

type ResponseActivity struct {
	Title   string `json:"title"`
	ImageID string `json:"image_url"`
}

type UserActivitiesResponse struct {
	Users []ResponseUser `json:"users"`
}

func GetUserActivities(c *gin.Context) {
	var users []models.User
	initializers.DB.Preload("Activities").Find(&users)

	responseUsers := make([]ResponseUser, len(users))
	for i, user := range users {
		responseActivities := make([]ResponseActivity, len(user.Activities))
		for j, activity := range user.Activities {
			responseActivities[j] = ResponseActivity{
				Title:   activity.Title,
				ImageID: activity.ImageID,
			}
		}

		responseUsers[i] = ResponseUser{
			Name:       user.Name,
			Activities: responseActivities,
		}
	}

	response := UserActivitiesResponse{
		Users: responseUsers,
	}

	c.JSON(200, &response)
}
