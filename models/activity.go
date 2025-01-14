package models

import (
	"gorm.io/gorm"
)

type Activity struct {
	gorm.Model
	Title string
	// ActivityTime time.Time
	ImageID string
	UserID  uint
	User    User `json:"-"`
}
