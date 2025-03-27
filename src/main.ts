import 'focus-visible'

import AddUaData from '@modules/AddUaData'
import InView from '@modules/InView'
import SetOrientation from '@modules/SetOrientation'
import { debounce, getDocumentHeight, throttle } from 'umaki'

const onDOMContentLoaded = () => {
  // AddUaData
  new AddUaData()
}

const onLoad = () => {
  // SetOrientation
  new SetOrientation()

  // 'u-inview'クラスが付与された要素を監視して、画面内に入った時に'is-inview'クラスを付与する
  const inViewElement = document.querySelectorAll('.u-inview') as NodeListOf<HTMLElement>
  inViewElement.forEach((element) => {
    new InView(
      element,
      () => element.classList.add('is-inview'),
      () => element.classList.remove('is-inview')
    )
  })

  // 'u-animation'クラスが付与された要素を監視して、画面内に入った時に'is-animation'クラスを付与する
  const animationElement = document.querySelectorAll('.u-animation') as NodeListOf<HTMLElement>
  animationElement.forEach((element) => {
    new InView(
      element,
      () => element.classList.add('is-animation'),
      () => element.classList.remove('is-animation'),
      null,
      {
        isOnce: true
      }
    )
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

// addEventListeners
window.addEventListener('DOMContentLoaded', onDOMContentLoaded)
window.addEventListener('load', onLoad)
window.addEventListener('scroll', throttle(onScroll, 30), false)
window.addEventListener('scroll', debounce(onScroll, 100), false)
