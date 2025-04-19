import React, { useEffect } from "react"

export type ChatBotClientEventType = "connected" | "disconnected" | "message" | "toggled"
export type ChatBotClientEvent<T = any> = {
  type: ChatBotClientEventType
  data: T
}

export interface ChatbotClientApi {
  chat: any // WebChat;
  config: any // WebChatConfig;
  sendMessage: (
    text: string,
    attachment?: any //NormalizedAttachment,
  ) => Promise<void>
  updateSettings: (settings: any /*WebChatSettings*/) => void
  toggleWidget: () => void
  updateMetadata: (metadata: Record<string, any>) => void
  resetChat: () => void
  setChat: (chat: any /*WebChat*/) => void
  identifyUser: (user: any /*WebChatUser*/) => void
  on(event: ChatBotClientEventType, callback: any /*ChatBotClientEventCallback*/): void
  getState: () => {
    isOpen: boolean
    metadata: Record<string, any>
    chat: any /*WebChat*/
    settings?: any /*WebChatSettings*/
    mode: "popup" | "inline"
  }
}

const WebChat = ({ userTelegramID }: { userTelegramID: string }) => {
  useEffect(() => {
    if (userTelegramID) {
      const script = document.createElement("script")
      script.src = "https://cb.flowxo.com/chatbot.js"
      script.dataset.apikey =
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2ODAwNmFmNzA1YWQxNzAwMjk4NWJkODkiLCJpYXQiOjE3NDQ4NTc4NDh9.JoP-nKZWL5CqeRHC6yRiYzp71_hALoXPTBwWfbm3zrc"
      script.dataset.callback = "onChatbotLoaded"
      script.dataset.selector = "#chat-container"
      script.dataset.userId = userTelegramID
      script.async = true
      script.defer = true

      // @ts-ignore
      window.onChatbotLoaded = (chatbot: ChatbotClientApi) => {
        chatbot.updateSettings({})
        var chatContainer = document.getElementById("chat-container")
        var style = document.createElement("style")
        style.innerHTML = `
          .fxoc-h-full { max-height: 70vh; height: 70vh; min-height: 500px;}
		  .fxoc-shadow-2xl { box-shadow: 0 0 0 0; }
        `
        chatContainer?.shadowRoot?.appendChild(style)
      }

      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [userTelegramID])

  return (
    <div>
      <div id="chat-container" />
    </div>
  )
}

export default WebChat
