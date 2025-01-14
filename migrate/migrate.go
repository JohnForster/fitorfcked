package main

import (
	"github.com/johnforster/fitorfcked/initializers"
	"github.com/johnforster/fitorfcked/models"
)

func init() {
	initializers.LoadEnvs()
	initializers.ConnectDB()
}

func main() {
	initializers.DB.AutoMigrate(&models.User{})
	initializers.DB.AutoMigrate(&models.Activity{})
}
