/**
 * 特定のハッシュ先にスクロール（Promise対応版）
 */
const ScrollToHash = async (hash: string, manualOffset?: number): Promise<boolean> => {
  // hashに#がついている場合は削除
  const hashWithoutSharp = hash.replace('#', '')
  const targetElement = document.getElementById(hashWithoutSharp)
  if (!targetElement) return false

  const elementPosY = Math.floor(targetElement.getBoundingClientRect().top + window.scrollY)

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
      console.log(window.scrollY, posY)
      if (window.scrollY !== posY) return

      window.removeEventListener('scroll', scrollHandler)
      clearTimeout(rejectTimer)
      resolve(true)
    }

    if (window.scrollY === posY) {
      clearTimeout(rejectTimer)
      resolve(true)
    }

    if (window.scrollY !== posY) {
      window.addEventListener('scroll', scrollHandler, false)
    }
  })
}

export default ScrollToHash
