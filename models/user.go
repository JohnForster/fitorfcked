package models

import (
	"time"
)

type User struct {
	ID        uint   `json:"id" gorm:"primary_key"`
	Email     string `json:"email" gorm:"unique"`
	Password  string `json:"password"`
	Name      string `json:"name"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
