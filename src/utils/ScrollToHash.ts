/**
 * 特定のハッシュ先にスクロール（Promise対応版）
 */
const ScrollToHash = async (hash: string, manualOffset?: number): Promise<boolean> => {
  const targetElement = document.querySelector(hash)
  if (!targetElement) return false

  const elementPosY = Math.floor(targetElement.getBoundingClientRect().top + window.pageYOffset)

  // manualOffsetがある場合はmanualOffsetを優先する
  const offset = manualOffset ? manualOffset : 0
  const posY = elementPosY - offset

  window.scrollTo({
    top: posY,
    behavior: 'smooth'
  })

  return new Promise((resolve) => {
    const rejectTimer = setTimeout(() => {
      window.removeEventListener('scroll', scrollHandler)
      resolve(false)
    }, 1000)

    const scrollHandler = () => {
      console.log(window.pageYOffset, posY)
      if (window.pageYOffset !== posY) return

      window.removeEventListener('scroll', scrollHandler)
      clearTimeout(rejectTimer)
      resolve(true)
    }

    if (window.pageYOffset === posY) {
      clearTimeout(rejectTimer)
      resolve(true)
    }

    if (window.pageYOffset !== posY) {
      window.addEventListener('scroll', scrollHandler, false)
    }
  })
}

export default ScrollToHash
