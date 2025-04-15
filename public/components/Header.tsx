import React, { useState, useEffect } from "react"
import "./Header.scss"
import { SignInModal, TenantLogo, NotificationIndicator, UserMenu } from "@fider/components"
import { useFider } from "@fider/hooks"
import { HStack } from "./layout"
import { Trans } from "@lingui/react/macro"

export const Header = () => {
  const fider = useFider()
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)

  const showModal = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSignInModalOpen(true)
  }

  const hideModal = () => setIsSignInModalOpen(false)

  useEffect(() => {
    if (!fider.session.isAuthenticated && location.hash.includes("tgWebAppData")) {
      setIsSignInModalOpen(true)
    }
  }, [])

  return (
    <div id="fixed-header">
      <div id="c-header" className="bg-white">
        <SignInModal isOpen={isSignInModalOpen} onClose={hideModal} />
        <HStack className="c-menu shadow p-4 w-full">
          <div className="container">
            <HStack justify="between">
              <a href="/" className="flex flex-x flex-items-center flex--spacing-2 h-8">
                <TenantLogo size={100} />
                <h1 className="text-header">{fider.session.tenant.name}</h1>
              </a>
              {fider.session.isAuthenticated && (
                <a href="/feed" style={{ marginRight: "auto", marginLeft: "16px", fontWeight: "500", marginTop: "4px", outline: "none", border: "none" }}>
                  Feed
                </a>
              )}
              {fider.session.isAuthenticated && (
                <HStack spacing={2}>
                  <NotificationIndicator />
                  <UserMenu />
                </HStack>
              )}
              {!fider.session.isAuthenticated && (
                <a href="#" className="uppercase text-sm" onClick={showModal}>
                  <Trans id="action.signin">Sign in</Trans>
                </a>
              )}
            </HStack>
          </div>
        </HStack>
      </div>
    </div>
  )
}
