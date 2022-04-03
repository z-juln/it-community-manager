import { isDev } from '@/utils/env';
import type { RequestOptionsInit } from 'umi-request'
import { extend } from 'umi-request'
import { message } from 'antd'
import { logout } from './common';

type RequestMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
type RequestParamsType = [url: string, values?: any, options?: Omit<RequestOptionsInit, 'data'>]

message.config({
  maxCount: 1
})

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  // credentials: 'include', // 默认请求是否带上cookie
})

request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('token')
  const selfOptions = {
    headers: {
      Authorization: `${token ?? ''}`,
    },
    interceptors: true,
  }
  return {
    url,
    options: { ...options, ...selfOptions },
  }
})

request.interceptors.response.use(async (response) => {
  if (response.status === 401) {
    message.warning('您的Token已失效，请重新登录')
    setTimeout(() => {
      logout()
    }, 1000)
  } else if (response.status > 200) {
    const res = await response.clone().json()
    message.error(`请求错误，： ${res.message}`)
  }
  return response
})

export const REQUEST = async (method: RequestMethod, url: string, values?: any, options?: Omit<RequestOptionsInit, 'data'>) => {
  const requestParams = {
    method: method.toLowerCase(),
    params: method === 'GET' ? values : undefined,
    data: method === 'GET' ? undefined : values,
    ...options
  }
  return request(url, requestParams)
    .then(res => {
      if (res.code === 1) {
        return Promise.resolve(res)
      } else {
        message.error(res.errorMsg || '网络错误')
        throw new Error(`请求错误，： ${res?.message || res?.msg || ''}`)
      }
    })
    .catch(() => {
      return Promise.reject()
    })
}

export const GET = (...args: RequestParamsType) => REQUEST('GET', ...args)
export const POST = (...args: RequestParamsType) => REQUEST('POST', ...args)
export const PUT = (...args: RequestParamsType) => REQUEST('PUT', ...args)
export const DELETE = (...args: RequestParamsType) => REQUEST('DELETE', ...args)
