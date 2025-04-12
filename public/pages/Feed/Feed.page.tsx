import "./Feed.page.scss"

import React from "react"
import { Header } from "@fider/components"
import { Activity, ActivityFooter, FlatFeed } from "react-activity-feed"
import CustomActivityHeader from "./components/CustomActivityHeader"

export interface FeedPageProps {}

export interface FeedPageState {
  title: string
}

const FeedPage = (props: FeedPageProps) => {
  return (
    <>
      <Header />
      <div id="p-feed" className="page container">
        <div className="p-feed__content p-4">
          <p>
            <strong>Activity Feed</strong>
          </p>
          <FlatFeed
            userId="ideas"
            feedGroup="user"
            options={{
              withOwnReactions: true,
              withReactionCounts: true,
              withRecentReactions: true,
            }}
            Activity={(props) => <Activity {...props} Footer={<ActivityFooter {...props} />} Header={<CustomActivityHeader {...props} />} />}
            notify
          />
        </div>
      </div>
    </>
  )
}

export default FeedPage
