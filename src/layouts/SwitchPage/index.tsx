import React, { memo } from 'react'
import type { ReactNode } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import type { RouteConfigType } from '@/routes/interface';

export interface SwitchPageProps {
  routes: RouteConfigType[]
}

const SwitchPage: React.FC<SwitchPageProps> = (props: SwitchPageProps) => {
  const { routes } = props
  // TODO 路径拼接尚未完成
  // 渲染路由
  const renderRoute = (list: RouteConfigType[] = []) => {
    let result: ReactNode[] = []
    list.map(item => {
      if(item.redirect) {
        result.push(
          <Redirect key={item.path}
            path={item.path} exact={item.exact}
            to={item.redirect}
           />
        )
      } else if(item.children) {
        result = result.concat(renderRoute(item.children))
      } else {
        result.push(<Route
          key={item.path}
          path={item.path}
          exact={item.exact}
          component={item.template}
        />)
      }
    })
    // console.log('routes: ', routes)
    return result
  }

  return (
    <Switch>
      {renderRoute(routes)}
    </Switch>
  )
}

export default memo(SwitchPage)
