import "@fider/assets/styles/index.scss"

import React, { Suspense } from "react"
import { createRoot } from "react-dom/client"
import { ErrorBoundary, Loader, ReadOnlyNotice, DevBanner } from "@fider/components"
import { classSet, Fider, FiderContext, actions, activateI18N } from "@fider/services"

import { I18n } from "@lingui/core"
import { I18nProvider } from "@lingui/react"
import { AsyncPage } from "./AsyncPages"
import { UserSidebarProvider } from "./services/user-sidebar"
import UserSidebar from "./components/UserSidebar"
import { FeedProvider } from "./services/feed"

const Loading = () => (
  <div className="page">
    <Loader />
  </div>
)

const logProductionError = (err: Error) => {
  if (Fider.isProduction()) {
    console.error(err)
    actions.logError(`react.ErrorBoundary: ${err.message}`, err)
  }
}

window.addEventListener("unhandledrejection", (evt: PromiseRejectionEvent) => {
  if (evt.reason instanceof Error) {
    actions.logError(`window.unhandledrejection: ${evt.reason.message}`, evt.reason)
  } else if (evt.reason) {
    actions.logError(`window.unhandledrejection: ${evt.reason.toString()}`)
  }
})

window.addEventListener("error", (evt: ErrorEvent) => {
  if (evt.error && evt.colno > 0 && evt.lineno > 0) {
    actions.logError(`window.error: ${evt.message}`, evt.error)
  }
})

const bootstrapApp = (i18n: I18n) => {
  const component = AsyncPage(fider.session.page)
  document.body.className = classSet({
    "is-authenticated": fider.session.isAuthenticated,
    "is-staff": fider.session.isAuthenticated && fider.session.user.isCollaborator,
  })

  const rootElement = document.getElementById("root")
  if (rootElement) {
    const root = createRoot(rootElement)
    root.render(
      <React.StrictMode>
        <ErrorBoundary onError={logProductionError}>
          <I18nProvider i18n={i18n}>
            <FiderContext.Provider value={fider}>
              <DevBanner />
              <ReadOnlyNotice />
              <FeedProvider>
                <UserSidebarProvider>
                  <UserSidebar />
                  <Suspense fallback={<Loading />}>{React.createElement(component, fider.session.props)}</Suspense>
                </UserSidebarProvider>
              </FeedProvider>
            </FiderContext.Provider>
          </I18nProvider>
        </ErrorBoundary>
      </React.StrictMode>
    )
  }
}
const fider = Fider.initialize()
__webpack_nonce__ = fider.session.contextID
__webpack_public_path__ = `${fider.settings.assetsURL}/assets/`
activateI18N(fider.currentLocale).then(bootstrapApp).catch(bootstrapApp)
