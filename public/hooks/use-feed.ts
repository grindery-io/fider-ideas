import { useContext } from "react"
import FeedContext from "@fider/services/feed"

export const useFeed = () => useContext(FeedContext)
