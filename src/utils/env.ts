type IENV = 'dev' | 'sit' | 'stg' | 'prod'

export const isDev = import.meta.env.DEV

export const env: IENV = (function getEnv() {
  if (isDev) return 'dev'
  switch (window.location.hostname) {
    case 'banzhu-sit.hupu.com':
    default:
      return 'sit'
    case 'banzhu-stg.hupu.com':
      return 'stg'
    case 'banzhu.hupu.com':
      return 'prod'
  }
})()
