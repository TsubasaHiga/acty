import type SiteConfigType from './types/SiteConfigType'

export const siteConfig: SiteConfigType = {
  // Site Name
  siteName: 'Acty',

  // Site URL
  siteUrl: 'https://example.com',

  // Base Path
  // example: '/' or '/foo/bar/dist' or etc.
  basePath: '/',

  // theme color
  themeColor: '#fff'
} as const
