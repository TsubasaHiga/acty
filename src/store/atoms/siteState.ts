import { logger } from '@nanostores/logger'
import isProduction from '@utils/isProduction'
import { atom } from 'nanostores'

export type SiteStateType = {
  isOpenMenu: boolean
}
export const siteState = atom<SiteStateType>({
  // メニューが開かれているかどうか
  isOpenMenu: false
})

// ロガーを設定
if (!isProduction()) {
  logger({ siteState: siteState })
}
