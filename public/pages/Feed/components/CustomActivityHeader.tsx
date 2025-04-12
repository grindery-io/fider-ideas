import { useUserSidebar } from "@fider/hooks/use-user-sidebar"
import { actions } from "@fider/services"
import React, { useEffect, useState } from "react"
import { ActivityHeader, ActivityProps } from "react-activity-feed"

const CustomActivityHeader = (props: ActivityProps) => {
  const [user, setUser] = useState<any>(null)
  const { setUserTelegramID } = useUserSidebar()

  const activity = {
    ...props.activity,
    actor: user || props.activity.actor,
  }

  useEffect(() => {
    if (!user && typeof props.activity?.actor === "string") {
      const actorId = props.activity?.actor.split(":")[1]
      actions
        .getUserProfile(actorId)
        .then((res) => {
          if (res.ok) {
            setUser({
              id: actorId,
              data: {
                ...res.data.result,
                name: res.data.result.userHandle,
                profileImage: res.data.result.avatarUrl,
              },
            })
          } else {
            console.error("Error fetching user profile:", res.error)
            setUser(null)
          }
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
          ? async () => {
              //window.open(`https://wallet.grindery.com/user/${user?.id}`, "_blank")
              setUserTelegramID(user?.id)
            }
          : undefined
      }
    />
  )
}

export default CustomActivityHeader
