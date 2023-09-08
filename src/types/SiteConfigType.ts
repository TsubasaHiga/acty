type TwitterCardType = 'summary' | 'summary_large_image' | 'app' | 'player'

export type SiteConfigType = {
  // Site Name
  siteName: string

  // Site Domain
  siteDomain: string

  // Site URL
  siteUrl: string

  // Base Path
  basePath: string

  // author
  author: string

  // theme color
  themeColor: string

  // twitter meta
  twitter: {
    card: TwitterCardType
    site: string
    creator: string
  }
}
