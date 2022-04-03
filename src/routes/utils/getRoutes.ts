import { MenuPermissionKey, RouteConfigType } from "../interface"

/**
 * @param {Record<MenuPermissionKey, boolean>} permissionsObj 后端传递的数据格式
 */
export function getAuthRoutes(
  routes: RouteConfigType[],
  permissionsObj: Record<MenuPermissionKey, boolean>
): RouteConfigType[] {
  const permissions = parsePermissions(permissionsObj)
  const matchedRoutes = getRoutesByPermissions(routes, permissions)
  return matchedRoutes
}

/** 将后端的permissionsObj转换成permissions */
export function parsePermissions(permissionsObj: Record<MenuPermissionKey, boolean>): MenuPermissionKey[] {
  const permissions: MenuPermissionKey[] = []
  for (const key in permissionsObj) {
    if (permissionsObj[key as MenuPermissionKey]) {
      permissions.push(key as MenuPermissionKey)
    }
  }
  return permissions
}

export function getRoutesByPermissions(
  _routes: RouteConfigType[],
  permissions: MenuPermissionKey[]
): RouteConfigType[] {
  const hasAuth = (route: RouteConfigType) => !!route.permissionKey && permissions.includes(route.permissionKey)
  const hasChildren = (route: RouteConfigType) => !!(route.children && route.children.length)
  const isPageRoute = (route: RouteConfigType) => !!(route.template || route.redirect)

  const routes = _routes
  _routes.forEach((_route, index) => {
    if (!hasAuth(_route) && isPageRoute(_route)) { // 没权限的页面组件的菜单: 删除
      delete routes[index]
    } else if (!isPageRoute(_route) && hasChildren(_route)) { // 非页面组件的菜单(目录): 递归删除
      getRoutesByPermissions(_route.children!, permissions)
    }
  })
  return routes
}
