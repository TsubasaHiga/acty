import { pageDataList } from '@/pageDataList'
import type { PageNameType } from '@/type/PageDataListType'

const GetPageDataFromPageDataList = (pageName: PageNameType) => {
  return pageDataList.filter((page) => page.pageName === pageName)[0]
}

export default GetPageDataFromPageDataList
