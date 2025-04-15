import React from "react"
import "./UserSidebar.scss"
import { Loader } from "./common"
import { useUserSidebar } from "@fider/hooks/use-user-sidebar"
import { Activity, ActivityFooter, ActivityHeader, FlatFeed, useStreamContext } from "react-activity-feed"

const UserSidebar = () => {
  const { user, open, loading, setUserTelegramID, setUser } = useUserSidebar()
  const streamContext = useStreamContext()

  return (
    <div className={`user-sidebar ${open ? "open" : ""}`}>
      {!loading && (
        <button className="user-sidebar__close" onClick={() => setUserTelegramID(null)}>
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17.4498 12.5H7.55029M7.55029 12.5L12.5 7.55026M7.55029 12.5L12.5 17.4498"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <div className="user-sidebar__header">
        {loading ? (
          <div className="user-sidebar__loading">
            <Loader />
          </div>
        ) : user ? (
          <>
            <div className="user-sidebar__header-avatar">
              <img src={user.avatarUrl} alt="" />
            </div>
            <div className="user-sidebar__header-names">
              {user.userName && <h2>{user.userName.replace("undefined", "")}</h2>}
              {user.userHandle && <h3>@{user.userHandle}</h3>}
            </div>

            <div className="user-sidebar__header-buttons">
              {!user.isFollowing && (
                <button
                  onClick={async () => {
                    try {
                      await streamContext.client?.feed("timeline", streamContext.user?.id || "").follow("user", user.userTelegramID)
                      setUser({ ...user, isFollowing: true })
                    } catch (err) {
                      console.error("Error following user:", err)
                    }
                  }}
                >
                  Follow
                </button>
              )}
              <button
                onClick={() => {
                  window.open(`https://wallet.grindery.com/contacts/${user.userTelegramID}`, "_blank")
                }}
              >
                Send tokens
              </button>
            </div>
            {user.userStats && (
              <div className="user-sidebar__header-stats">
                <div>
                  <p>{user.userStats.follows || 0} Folllowing</p>
                </div>
                <div>
                  <p>{user.userStats.followers || 0} Folllowers</p>
                </div>
                <div>
                  <p>{user.isFollowing ? <span style={{ color: "#BAF1C0" }}>Following</span> : <span style={{ color: "#F4C470" }}>Not following</span>}</p>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
      <div className="user-sidebar__content">
        {!loading && user && (
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
        )}
      </div>
    </div>
  )
}

export default UserSidebar
