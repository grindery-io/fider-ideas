import { useContext } from "react"
import UserSidebarContext from "@fider/services/user-sidebar"

export const useUserSidebar = () => useContext(UserSidebarContext)
