import React, { useEffect, useState } from "react"
import { actions } from "."

type SidebarUser = Record<string, any> | null

interface UserSidebarContextType {
  user: SidebarUser
  loading: boolean
  open: boolean
  setUserTelegramID: (userTelegramID: string | null) => void
  setUser: (user: SidebarUser) => void
  close: () => void
}

const UserSidebarContext = React.createContext<UserSidebarContextType>({
  user: null,
  loading: false,
  open: false,
  setUserTelegramID: () => {},
  setUser: () => {},
  close: () => {},
})

const UserSidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [userTelegramID, setUserTelegramID] = useState<string | null>(null)
  const [user, setUser] = useState<SidebarUser>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const open = Boolean(userTelegramID)

  const close = () => {
    setUserTelegramID(null)
  }

  useEffect(() => {
    const getUser = async (id: string) => {
      setLoading(true)
      try {
        const res = await actions.getUserProfile(id, true)
        if (res.ok) {
          setUser(res.data.result)
        } else {
          console.error("Error fetching user profile:", res.error)
          setUser(null)
        }
      } catch (e) {
        console.error("Error fetching user profile:", e)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    if (userTelegramID) {
      getUser(userTelegramID)
    } else {
      setLoading(false)
      setUser(null)
    }
  }, [userTelegramID])

  return (
    <UserSidebarContext.Provider
      value={{
        user,
        loading,
        open,
        setUserTelegramID,
        setUser,
        close,
      }}
    >
      {children}
    </UserSidebarContext.Provider>
  )
}

export { UserSidebarContext, UserSidebarProvider }
export default UserSidebarContext
export type { SidebarUser, UserSidebarContextType }
