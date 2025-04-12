package handlers

import (
	"errors"
	"net/http"
	"os"
	"strings"

	"github.com/GetStream/stream-go2/v8"
	"github.com/getfider/fider/app/pkg/web"
)

// Feed is the activity feed page
func Feed() web.HandlerFunc {
	return func(c *web.Context) error {

		apiKey := os.Getenv("GETSTREAM_API_KEY")
		apiSecret := os.Getenv("GETSTREAM_API_SECRET")

		if apiKey == "" || apiSecret == "" {
			return c.Failure(errors.New("missing GETSTREAM_API_KEY or GETSTREAM_API_SECRET environment variables"))
		}

		client, err := stream.New(apiKey, apiSecret)
		if err != nil {
			panic(err)
		}

		userEmail := c.User().Email
		parts := strings.Split(userEmail, "@")
		userId := parts[0]
		domain := parts[1]
		if domain != "mail.wallet.grindery.com" || userId == "" || len(parts) <= 0 {
			return c.Failure(errors.New("invalid user"))
		}

		feedToken, err := client.CreateUserToken(userId)
		if err != nil {
			return c.Failure(err)
		}

		return c.Page(http.StatusOK, web.Props{
			Page:        "Feed/Feed.page",
			Description: "Feed · Fider",
			Data: web.Map{
				"feedToken": feedToken, // Auth token for the user feed to be used on the client side,
				"userId":    userId,    // User ID for the feed
			},
		})
	}
}

func GetFeedToken() web.HandlerFunc {
	return func(c *web.Context) error {
		apiKey := os.Getenv("GETSTREAM_API_KEY")
		apiSecret := os.Getenv("GETSTREAM_API_SECRET")

		if apiKey == "" || apiSecret == "" {
			return c.Failure(errors.New("missing GETSTREAM_API_KEY or GETSTREAM_API_SECRET environment variables"))
		}

		client, err := stream.New(apiKey, apiSecret)
		if err != nil {
			panic(err)
		}

		userEmail := c.User().Email
		parts := strings.Split(userEmail, "@")
		userId := parts[0]
		domain := parts[1]
		if domain != "mail.wallet.grindery.com" || userId == "" || len(parts) <= 0 {
			return c.Failure(errors.New("invalid user"))
		}

		feedToken, err := client.CreateUserToken(userId)
		if err != nil {
			return c.Failure(err)
		}

		return c.Ok(web.Map{
			"feedToken":      feedToken,
			"userTelegramID": userId,
		})
	}
}
