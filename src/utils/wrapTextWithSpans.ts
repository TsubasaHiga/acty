const WrapTextWithSpans = (element: HTMLElement): void => {
  if (!element) return

  if (element.nodeType === Node.TEXT_NODE) {
    const textContent = (element.textContent || '').trim()
    const fragment = document.createDocumentFragment()
    for (const char of textContent) {
      const span = document.createElement('span')
      span.textContent = char
      fragment.appendChild(span)
    }
    element.replaceWith(fragment)
  } else if (element.nodeType === Node.ELEMENT_NODE) {
    Array.from(element.childNodes).forEach((child) => {
      WrapTextWithSpans(child as HTMLElement)
    })
  }
}

// id="text"の要素を取得して処理を実行
const textElement = document.getElementById('text')
if (textElement) {
  WrapTextWithSpans(textElement)
}

export default WrapTextWithSpans
