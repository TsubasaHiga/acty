import { pageDataList } from '@/pageDataList'
import type { PageNameType } from '@/types/PageDataListType'

const GetPageDataFromPageDataList = (pageName: PageNameType) => {
  return pageDataList.filter((page) => page.pageName === pageName)[0]
}

export default GetPageDataFromPageDataList
