import type { PageNameType } from '@type/PageDataListType'

import { pageDataList } from '@/pageDataList'

const GetPageDataFromPageDataList = (pageName: PageNameType) => {
  return pageDataList.filter((page) => page.pageName === pageName)[0]
}

export default GetPageDataFromPageDataList
