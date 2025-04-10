import "react-activity-feed/dist/index.css"
import "./Feed.page.scss"

import React, { useEffect } from "react"
import { Header } from "@fider/components"
import { Activity, ActivityFooter, ActivityHeader, ActivityProps, FlatFeed, StreamApp, useStreamContext } from "react-activity-feed"
import { StreamUser } from "getstream"
import { GETSTREAM_API_KEY, GETSTREAM_APP_ID } from "@fider/services/feed"

export interface FeedPageProps {
  feedToken: string
  userId: string
}

export interface FeedPageState {
  title: string
}

const FeedPage = (props: FeedPageProps) => {
  return (
    <StreamApp apiKey={GETSTREAM_API_KEY} appId={GETSTREAM_APP_ID} token={props.feedToken}>
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
    </StreamApp>
  )
}

const CustomActivityHeader = (props: ActivityProps) => {
  const [user, setUser] = React.useState<StreamUser | null>(null)
  const streamContext = useStreamContext()

  const activity = {
    ...props.activity,
    actor: user || props.activity.actor,
  }

  useEffect(() => {
    if (!user && typeof props.activity?.actor === "string") {
      const actorId = props.activity?.actor.split(":")[1]
      streamContext.client
        ?.user?.(actorId)
        ?.get()
        .then((response) => {
          // @ts-ignore
          setUser({ ...response, data: { ...response.data, name: response.data.username || response.data.name || "Grindery User" } })
        })
        .catch((error) => {
          console.error("Error fetching user:", error)
          setUser(null)
        })
    }
  }, [user])

  return (
    <ActivityHeader
      {...props}
      // @ts-ignore
      activity={activity}
      onClickUser={
        user?.id
          ? () => {
              window.open(`https://wallet.grindery.com/user/${user?.id}`, "_blank")
            }
          : undefined
      }
    />
  )
}

export default FeedPage
