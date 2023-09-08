import type { SiteConfigType } from '@type/SiteConfigType'

export const siteConfig: SiteConfigType = {
  // Site Name
  siteName: 'Acty',

  // Site Domain
  siteDomain: 'example.com',

  // Site URL
  siteUrl: 'https://example.com',

  // Base Path
  // example: '/' or '/foo/bar/dist' or etc.
  basePath: '/',

  // author
  author: 'example',

  // theme color
  themeColor: '#fff',

  // twitter meta
  twitter: {
    card: 'summary_large_image',
    site: '@example',
    creator: '@example'
  }
} as const
