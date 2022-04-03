declare module '*.less';

declare module '*.scss';

declare module '*.svg';

declare module '*.png';

declare module '*.jpg';

declare module '*.jpeg';

declare module '*.gif';

declare module 'echarts-for-react';

declare module '*.md' {
  const content: string;
  export default content;
}

type AnyObj = Record<string, any>;

type SelectOption<T = React.Key> = {
  label: React.ReactNode;
  value: T;
  key?: React.Key;
  children?: SelectOption<T>[];
} & AnyObj;

type InnerResponse<Data = unknown> = {
  status: number;
  result: Data;
  msg: string;
  pageable?: {
    pageNo: number;
    pageSize: number;
    totalRowsCount: number;
  };
  success: boolean;
  errorCode?: string;
  errorMsg?: string;
};
