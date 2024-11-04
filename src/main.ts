import 'focus-visible'

import AddAnimationClass from '@modules/AddAnimationClass'
import AddUaData from '@modules/AddUaData'
import SetOrientation from '@modules/SetOrientation'
import { debounce, throttle } from 'throttle-debounce'
import { getDocumentHeight } from 'umaki'

const onDOMContentLoaded = () => {
  // AddUaData
  new AddUaData()
}

const onLoad = () => {
  // SetOrientation
  new SetOrientation()

  // addAnimationClass
  new AddAnimationClass({
    isDebug: true
  })

  // onScroll
  onScroll()

  document.documentElement.classList.add('is-loaded')
}

const onScroll = () => {
  const y = Math.round(window.scrollY)

  // add className is-scroll
  y > 0 ? document.documentElement.classList.add('is-scroll') : document.documentElement.classList.remove('is-scroll')

  // add className is-footer
  getDocumentHeight() <= y
    ? document.documentElement.classList.add('is-footer')
    : document.documentElement.classList.remove('is-footer')
}

let oldInnerWidth = window.innerWidth
const onResize = () => {
  // window幅が変わった時
  if (oldInnerWidth !== window.innerWidth) {
    oldInnerWidth = window.innerWidth
  }
}

// addEventListeners
window.addEventListener('DOMContentLoaded', onDOMContentLoaded)
window.addEventListener('load', () => {
  onLoad()
  window.addEventListener('scroll', throttle(100, onScroll), false)
  window.addEventListener('resize', debounce(100, onResize), false)
})
