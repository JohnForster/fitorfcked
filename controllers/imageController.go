package controllers

import (
	"context"
	"io"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"time"

	"cloud.google.com/go/storage"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/johnforster/fitorfcked/initializers"
	"github.com/johnforster/fitorfcked/models"
	"google.golang.org/api/option"
	"google.golang.org/appengine"
)

var storageClient *storage.Client

func HandleFileUploadToBucket(c *gin.Context) {
	bucket := os.Getenv("STORAGE_BUCKET_NAME") //your bucket name

	var err error

	ctx := appengine.NewContext(c.Request)

	storageClient, err = storage.NewClient(ctx, option.WithCredentialsFile("keys.json"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"error":   true,
		})
		return
	}

	f, uploadedFile, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"error":   true,
		})
		return
	}

	defer f.Close()

	extension := filepath.Ext(uploadedFile.Filename)
	fileName := uuid.NewString() + extension
	sw := storageClient.Bucket(bucket).Object(fileName).NewWriter(ctx)

	if _, err := io.Copy(sw, f); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"error":   true,
		})
		return
	}

	if err := sw.Close(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"error":   true,
		})
		return
	}

	imageFileName := sw.Attrs().Name

	user, _ := c.Get("currentUser")
	activity := models.Activity{
		Title:   c.Request.FormValue("title"),
		ImageID: imageFileName,
		User:    user.(models.User),
		UserID:  user.(models.User).ID,
	}

	initializers.DB.Create(&activity)

	u, err := url.Parse("/" + bucket + "/" + imageFileName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"Error":   true,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "file uploaded successfully",
		"pathname": u.EscapedPath(),
		"activity": activity,
	})
}

func HandleGetImage(c *gin.Context) {
	bucket := os.Getenv("STORAGE_BUCKET_NAME")
	filepath := c.Param("path")

	var err error

	ctx := appengine.NewContext(c.Request)

	storageClient, err = storage.NewClient(ctx, option.WithCredentialsFile("keys.json"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"error":   true,
		})
		return
	}

	ctx, cancel := context.WithTimeout(ctx, time.Second*50)
	defer cancel()

	rc, err := storageClient.Bucket(bucket).Object(filepath).NewReader(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"error":   true,
		})
		return
	}
	defer rc.Close()

	data, err := io.ReadAll(rc)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": err.Error(),
			"error":   true,
		})
		return
	}

	c.Data(200, "image/png", data)
}
