import { useStore } from '@nanostores/react'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { siteState } from '@/store/atoms/siteState'

import styles from './MenuButton.module.scss'

const MenuButton = (): ReactNode => {
  const $siteState = useStore(siteState)
  const { isOpenMenu } = $siteState

  // buttonのclickでsiteStateのisOpenMenuをtoggleする
  const handleClick = () => {
    siteState.set({
      ...$siteState,
      isOpenMenu: !$siteState.isOpenMenu
    })
  }

  useEffect(() => {
    // isOpenMenuの値に応じて、html要素のdata属性を変更する
    document.documentElement.dataset.openMenu = isOpenMenu.toString()

    return () => {
      document.documentElement.dataset.openMenu = 'false'
    }
  }, [isOpenMenu])

  return (
    <>
      <button
        aria-label="メニューを開く"
        className={clsx(styles.button, 'u-mqw-down')}
        onClick={handleClick}
        title="メニューを開く"
        type="button"
      >
        <span></span>
      </button>
      <button className={styles.bg} onClick={handleClick} tabIndex={-1} type="button">
        <span className="sr-only">メニューを閉じる</span>
      </button>
    </>
  )
}

export default MenuButton
