import React, { useState } from "react"
import RoutesContext from "./context"
import { RouteConfigType } from './interface'

export function RoutesContainer({children}: {children: React.ReactNode}) {
  const [routes, setRoutes] = useState<RouteConfigType[]>([]) // 默认没权限
  const [loading, setLoading] = useState(false)

  return (
    <RoutesContext.Provider value={{routes, setRoutes, loading, setLoading}}>
      {children}
    </RoutesContext.Provider>
  )
}
