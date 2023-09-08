type HierarchyType = {
  title: string
  path: string
}

export type PageNameType = 'top' | 'about'

export type PageDataListType = {
  pageName: PageNameType
  title: string
  description: string
  ogType?: 'website' | 'article'
  hierarchy?: HierarchyType[]
}
