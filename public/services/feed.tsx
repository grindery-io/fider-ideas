import "react-activity-feed/dist/index.css"

import React, { useEffect, useState } from "react"
import { actions } from "."
import { useFider } from "@fider/hooks"
import { StreamApp } from "react-activity-feed"

//const GETSTREAM_API_KEY = process.env.NODE_ENV === "production" ? "9xvwqtbzagsv" : "4qgse943tvvg"
//const GETSTREAM_APP_ID = process.env.NODE_ENV === "production" ? "1319182" : "1328657"
const GETSTREAM_API_KEY = "9xvwqtbzagsv"
const GETSTREAM_APP_ID = "1319182"

interface FeedContextType {
  token: string
}

const FeedContext = React.createContext<FeedContextType>({
  token: "",
})

const FeedProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>("")
  const fider = useFider()

  useEffect(() => {
    const getFeedToken = async () => {
      try {
        const res = await actions.getFeedToken()
        if (res.ok) {
          setToken(res.data.feedToken)
        } else {
          console.error("Error fetching feed token:", res.error)
          setToken("")
        }
      } catch (e) {
        console.error("Error fetching user profile:", e)
        setToken("")
      }
    }
    if (fider.session.isAuthenticated) {
      getFeedToken()
    }
  }, [fider.session.isAuthenticated])

  return (
    <FeedContext.Provider
      value={{
        token,
      }}
    >
      {fider.session.isAuthenticated && token ? (
        <StreamApp apiKey={GETSTREAM_API_KEY} appId={GETSTREAM_APP_ID} token={token}>
          {children}
        </StreamApp>
      ) : (
        <>{children}</>
      )}
    </FeedContext.Provider>
  )
}

export { GETSTREAM_API_KEY, GETSTREAM_APP_ID, FeedContext, FeedProvider }
export type { FeedContextType }
export default FeedContext
