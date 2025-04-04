import React, { useLayoutEffect } from "react"
import { Button, OAuthProviderLogo } from "@fider/components"
import { useFider } from "@fider/hooks"

interface SocialSignInButtonProps {
  option: {
    displayName: string
    provider?: string
    url?: string
    logoBlobKey?: string
    logoURL?: string
  }
  enableMiniAppFastSignIn?: boolean
  className?: string
  redirectTo?: string
}

export const SocialSignInButton = (props: SocialSignInButtonProps) => {
  const fider = useFider()
  const redirectTo = props.redirectTo || window.location.href.replace(/\?rp=.*$/, '')
  const href = props.option.url ? `${props.option.url}?redirect=${encodeURIComponent(redirectTo)}` : undefined

  useLayoutEffect(() => {
    if (!fider.session.isAuthenticated && props.enableMiniAppFastSignIn && href && props.option.displayName?.trim().toLowerCase() === "grindery") {
      const url = new URL(href, location.href)
      if (location.hash.includes("tgWebAppData")) {
        const params = new URLSearchParams(location.hash.slice(1))
        const initData = params.get("tgWebAppData")
        if (initData) {
          url.searchParams.set("initData", initData)
        }
      }
      location.href = url.toString()
      return;
    }
    if (location.hash) {
      location.hash = ""
    }
  }, [fider, props.enableMiniAppFastSignIn, props.option.url, props.option.displayName]);

  return (
    <Button href={href} rel="nofollow" className={props.className}>
      {props.option.logoURL ? <img alt={props.option.displayName} src={props.option.logoURL} /> : <OAuthProviderLogo option={props.option} />}
      <span>{props.option.displayName}</span>
    </Button>
  )
}
