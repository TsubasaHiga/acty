/**
 * スクロール可能かどうかを判定します
 */
const IsScrollable = (element: HTMLElement): boolean => {
  // 横スクロールが可能かどうか
  const isScrollableX = element.scrollWidth > element.clientWidth

  // 縦スクロールが可能かどうか
  const isScrollableY = element.scrollHeight > element.clientHeight

  return isScrollableX || isScrollableY
}

export default IsScrollable
