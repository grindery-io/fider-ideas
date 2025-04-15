import "./UserName.scss"

import React from "react"
import { isCollaborator, UserRole } from "@fider/models"
import { classSet } from "@fider/services"
import { useUserSidebar } from "@fider/hooks/use-user-sidebar"

interface UserNameProps {
  user: {
    id: number
    name: string
    role?: UserRole
    email?: string
  }
  showEmail?: boolean
  preventClick?: boolean
}

export const UserName = (props: UserNameProps) => {
  const { setUserTelegramID } = useUserSidebar()
  const isStaff = props.user.role && isCollaborator(props.user.role)
  const className = classSet({
    "c-username": true,
    "c-username--staff": isStaff,
  })

  const onClick =
    !props.preventClick && props.user.email?.includes("mail.wallet.grindery.com")
      ? () => {
          if (props.user.email?.includes("mail.wallet.grindery.com")) {
            const emailSplit = props.user.email?.split("@")
            setUserTelegramID(emailSplit[0])
          }
        }
      : undefined

  return (
    <div className={className}>
      <span
        onClick={onClick}
        style={{
          cursor: onClick ? "pointer" : "default",
        }}
      >
        {props.user.name || "Anonymous"}
      </span>
      <>
        {props.showEmail && props.user.email && (
          <span
            className="c-username--email"
            onClick={onClick}
            style={{
              cursor: onClick ? "pointer" : "default",
            }}
          >
            ({props.user.email})
          </span>
        )}
      </>

      {isStaff && (
        <div data-tooltip={isStaff ? "Staff" : undefined}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
      )}
    </div>
  )
}
