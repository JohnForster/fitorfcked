package controllers

import (
	"bufio"
	"fmt"
	"log"
	"net/http"
	"net/url"

	"github.com/gin-gonic/gin"
)

const BASE_URL = "https://storage.googleapis.com/get-fit-images/"

func GetImage(ctx *gin.Context) {
	// step 1: resolve proxy address, change scheme and host in requets
	req := ctx.Request
	proxy, err := url.Parse(BASE_URL)
	if err != nil {
		log.Printf("error in parse addr: %v", err)
		ctx.String(500, "error")
		return
	}
	req.URL.Scheme = proxy.Scheme
	req.URL.Host = proxy.Host

	// filename := strings.TrimPrefix(req.URL.Path, "/images/")

	// // Construct new path
	// newPath = fmt.Sprintf("/get-fit-images/%s", filename)

	fmt.Printf("%v", req)

	// step 2: use http.Transport to do request to real server.
	transport := http.DefaultTransport
	resp, err := transport.RoundTrip(req)
	if err != nil {
		log.Printf("error in roundtrip: %v", err)
		ctx.String(500, "error")
		return
	}

	// step 3: return real server response to upstream.
	for k, vv := range resp.Header {
		for _, v := range vv {
			ctx.Header(k, v)
		}
	}
	defer resp.Body.Close()
	bufio.NewReader(resp.Body).WriteTo(ctx.Writer)
	return
}
