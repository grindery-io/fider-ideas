import "./Avatar.scss"

import React from "react"
import { UserRole } from "@fider/models"
import { useUserSidebar } from "@fider/hooks/use-user-sidebar"

interface AvatarProps {
  user: {
    role?: UserRole
    avatarURL: string
    name: string
  }
  size?: "small" | "normal"
  preventClick?: boolean
}

export const Avatar = (props: AvatarProps) => {
  const { setUserTelegramID } = useUserSidebar()
  const size = props.size === "small" ? "h-6 w-6" : "h-8 w-8"

  const onClick =
    !props.preventClick && props.user.avatarURL.includes("https://wallet-api.grindery.com")
      ? () => {
          if (props.user.avatarURL.includes("https://wallet-api.grindery.com")) {
            const avatarSplit = props.user.avatarURL.split("/")
            setUserTelegramID(avatarSplit[avatarSplit.length - 2])
          }
        }
      : undefined

  return (
    <img
      className={`c-avatar ${size}`}
      alt={props.user.name}
      src={`${props.user.avatarURL}?size=50`}
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
      }}
    />
  )
}
