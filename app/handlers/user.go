package handlers

import (
	"log"
	"strings"

	"github.com/getfider/fider/app/models/cmd"
	"github.com/getfider/fider/app/pkg/bus"
	"github.com/getfider/fider/app/pkg/web"
	"github.com/getfider/fider/app/services/walletapi"
)

// BlockUser is used to block an existing user from using Fider
func BlockUser() web.HandlerFunc {
	return func(c *web.Context) error {
		userID, err := c.ParamAsInt("userID")
		if err != nil {
			return c.NotFound()
		}

		err = bus.Dispatch(c, &cmd.BlockUser{UserID: userID})
		if err != nil {
			return c.Failure(err)
		}

		return c.Ok(web.Map{})
	}
}

// UnblockUser is used to unblock an existing user so they can use Fider again
func UnblockUser() web.HandlerFunc {
	return func(c *web.Context) error {
		userID, err := c.ParamAsInt("userID")
		if err != nil {
			return c.NotFound()
		}

		err = bus.Dispatch(c, &cmd.UnblockUser{UserID: userID})
		if err != nil {
			return c.Failure(err)
		}

		return c.Ok(web.Map{})
	}
}

// GetUser gets user profile
func GetUser() web.HandlerFunc {
	return func(c *web.Context) error {
		userEmail := c.User().Email
		parts := strings.Split(userEmail, "@")
		userTelegramID := parts[0]
		userId := c.Param("id")

		withStats := c.QueryParam("withStats")

		params := map[string]interface{}{
			"userTelegramID": userId,
		}

		userData, err := walletapi.SendRequest("gw_getUser", params, userTelegramID)
		if err != nil {
			return c.Failure(err)
		}

		if withStats == "true" || withStats == "1" {

			statParams := map[string]interface{}{
				"userTelegramID": userId,
			}

			userStats, err := walletapi.SendRequest("gw_getUserStats", statParams, userTelegramID)
			if err != nil {
				log.Println("Error fetching user stats:", err)
			} else {
				if userData["result"] != nil {
					if resultMap, ok := userData["result"].(map[string]interface{}); ok {
						resultMap["userStats"] = userStats["result"]
					}
				}
			}

			isFollowing, err := walletapi.SendRequest("gw_isFollowingUser", statParams, userTelegramID)

			if err != nil {
				log.Println("Error fetching user following:", err)
			} else {
				if userData["result"] != nil {
					if resultMap, ok := userData["result"].(map[string]interface{}); ok {
						if isFollowing["result"] != nil {
							if isFollowingMap, ok := isFollowing["result"].(map[string]interface{}); ok {
								if isFollowingMap["isFollowing"] != nil {
									resultMap["isFollowing"] = isFollowingMap["isFollowing"]
								} else {
									resultMap["isFollowing"] = false
								}
							}
						} else {
							resultMap["isFollowing"] = false
						}
					}
				}
			}
		}

		return c.Ok(userData)
	}
}
