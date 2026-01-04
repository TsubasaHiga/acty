import { pageDataList } from '@/pageDataList'
import type { PageNameType } from '@/types/PageDataListType'

export const getPageDataFromPageDataList = (pageName: PageNameType) => {
  return pageDataList.filter((page) => page.pageName === pageName)[0]
}
