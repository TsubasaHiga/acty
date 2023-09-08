import AddUaData from '@modules/AddUaData'
import SetOrientation from '@modules/SetOrientation'
import GetDocumentH from '@utils/getDocumentHeight'
import Set100vh from '@utils/set100vh'
import { debounce, throttle } from 'throttle-debounce'

const onDOMContentLoaded = () => {
  // AddUaData
  new AddUaData()
}

const onLoad = () => {
  Set100vh()
  Set100vh('--vh-always')

  // SetOrientation
  new SetOrientation()

  // onScroll
  onScroll()

  document.documentElement.classList.add('is-loaded')
}

const onScroll = () => {
  const y = Math.round(window.scrollY)

  // add className is-scroll
  y > 0 ? document.documentElement.classList.add('is-scroll') : document.documentElement.classList.remove('is-scroll')

  // add className is-footer
  GetDocumentH() <= y
    ? document.documentElement.classList.add('is-footer')
    : document.documentElement.classList.remove('is-footer')
}

let oldInnerWidth = window.innerWidth
const onResize = () => {
  Set100vh('--vh-always')

  // window幅が変わった時
  if (oldInnerWidth !== window.innerWidth) {
    Set100vh()
    oldInnerWidth = window.innerWidth
  }
}

// addEventListeners
window.addEventListener('DOMContentLoaded', onDOMContentLoaded)
window.addEventListener('load', onLoad)
window.addEventListener('scroll', throttle(100, onScroll), false)
window.addEventListener('resize', debounce(100, onResize), false)
