package walletapi

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

// This function sends a JSON-RPC request to the Grindery Wallet API.
func SendRequest(method string, params map[string]interface{}, actingUserID string) (map[string]interface{}, error) {
	postBody := map[string]interface{}{
		"jsonrpc": "2.0",
		"id":      1,
		"method":  method,
		"params":  params,
	}
	body, err := json.Marshal(postBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal post body: %w", err)
	}

	req, err := http.NewRequest("POST", "https://wallet-api.grindery.com/v3?actingUserId="+actingUserID, bytes.NewBuffer(body))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Authorization", "Bearer "+os.Getenv("WALLET_API_KEY"))
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch data, status code: %d", resp.StatusCode)
	}

	var responseData map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&responseData); err != nil {
		return nil, err
	}

	return responseData, nil
}
