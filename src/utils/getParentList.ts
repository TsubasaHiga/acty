/**
 * 特定の要素の親要素を再帰的に取得して配列にして返す
 */
const GetParentList = (element: HTMLElement): HTMLElement[] => {
  const parentElement = element.parentElement
  if (!parentElement) return [element]
  return [element].concat(GetParentList(parentElement))
}

export default GetParentList
