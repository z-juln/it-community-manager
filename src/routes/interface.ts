import type { MenuDataItem } from '@ant-design/pro-layout';

export interface RouteConfigType extends MenuDataItem {
  path: string;
  exact?: boolean;
  name?: string;
  redirect?: string;
  breadCrumb?: boolean;
  template?: React.FC | React.ComponentClass | (() => JSX.Element);
  children?: RouteConfigType[];
  /** 菜单标识符(权限相关) */
  permissionKey?: MenuPermissionKey;
  key?: string;
  hidden?: boolean;
}

export interface ProviderValue {
  routes: RouteConfigType[];
  setRoutes: React.Dispatch<React.SetStateAction<RouteConfigType[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export type MenuPermissionKey =
  | 'TIP_AUDIT'
  | 'TIP_REPORT_VIEW'
  | 'MODERATOR_MANAGE'
  | 'MODERATOR_EDIT_SCORE';
