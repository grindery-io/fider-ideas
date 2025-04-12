import React from "react"
import "./UserSidebar.scss"
import { Loader } from "./common"
import { useUserSidebar } from "@fider/hooks/use-user-sidebar"
import { Activity, ActivityFooter, ActivityHeader, FlatFeed } from "react-activity-feed"

type Props = {}

const UserSidebar = (props: Props) => {
  const { user, open, loading, setUserTelegramID } = useUserSidebar()

  return (
    <div className={`user-sidebar ${open ? "open" : ""}`}>
      {!loading && (
        <button className="user-sidebar__close" onClick={() => setUserTelegramID(null)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-circle-x-icon lucide-circle-x"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </button>
      )}
      {loading && (
        <div className="user-sidebar__loading">
          <Loader />
        </div>
      )}
      {user && (
        <>
          <div className="user-sidebar__header">
            <div className="user-sidebar__avatar">
              <img src={user.avatarUrl} alt="" />
            </div>
            <h2>{user.userHandle}</h2>
          </div>
          <div className="user-sidebar__content">
            <FlatFeed
              feedGroup="user"
              userId={user.userTelegramID}
              options={{
                withOwnReactions: true,
                withReactionCounts: true,
                withRecentReactions: true,
              }}
              Activity={(props) => (
                <Activity
                  {...props}
                  Footer={<ActivityFooter {...props} />}
                  Header={
                    <ActivityHeader
                      {...props}
                      activity={{
                        ...props.activity,
                        // @ts-ignore
                        actor: user
                          ? {
                              id: user.userTelegramID,
                              data: { ...user, name: user.userHandle ? `@${user.userHandle}` : user.userName || "Grindery User", profileImage: user.avatarUrl },
                            }
                          : props.activity.actor,
                      }}
                    />
                  }
                />
              )}
              notify
            />
          </div>
        </>
      )}
    </div>
  )
}

export default UserSidebar
