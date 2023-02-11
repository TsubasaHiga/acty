import { atom } from 'nanostores'

type SiteStateType = {
  isOpenMenu: boolean
}
export const siteState = atom<SiteStateType>({
  // メニューが開かれているかどうか
  isOpenMenu: false
})
