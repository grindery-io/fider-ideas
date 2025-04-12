import React from "react"
import { useFider } from "@fider/hooks"
import { Avatar, Dropdown } from "./common"
import { Trans } from "@lingui/react/macro"

export const UserMenu = () => {
  const fider = useFider()

  if (fider.session.isAuthenticated && location.hash.includes("tgWebAppData")) {
    sessionStorage.setItem("isInMiniApp", "1")
  }
  const isInMiniApp = !!sessionStorage.getItem("isInMiniApp")

  return (
    <div className="c-menu-user">
      <Dropdown position="left" renderHandle={<Avatar user={fider.session.user} preventClick />}>
        <div className="p-2 text-medium uppercase">{fider.session.user.name}</div>
        <Dropdown.ListItem href="/settings">
          <Trans id="menu.mysettings">My Settings</Trans>
        </Dropdown.ListItem>
        <Dropdown.Divider />

        {fider.session.user.isCollaborator && (
          <>
            <div className="p-2 text-medium uppercase">
              <Trans id="menu.administration">Administration</Trans>
            </div>
            <Dropdown.ListItem href="/admin">
              <Trans id="menu.sitesettings">Site Settings</Trans>
            </Dropdown.ListItem>
            <Dropdown.Divider />
          </>
        )}
        {!isInMiniApp && (
          <Dropdown.ListItem href="/signout">
            <Trans id="menu.signout">Sign out</Trans>
          </Dropdown.ListItem>
        )}
      </Dropdown>
    </div>
  )
}
