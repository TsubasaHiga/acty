import { atom } from 'nanostores'

export type SiteStateType = {
  isOpenMenu: boolean
}
export const siteState = atom<SiteStateType>({
  // メニューが開かれているかどうか
  isOpenMenu: false
})
