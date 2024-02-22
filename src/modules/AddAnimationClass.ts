import GetDeviceType from '@utils/getDeviceType'
import autoBind from 'auto-bind'

type typeOptions = {
  root: null | HTMLElement
  rootMargin: string
  threshold: number
}
type rootMarginOptions = {
  [keyof in 'lg' | 'sm']: string
}

type Props = {
  rootMargin?: rootMarginOptions
  targetElements?: NodeListOf<HTMLElement>
  isDebug?: boolean
}
class AddAnimationClass {
  elements: NodeListOf<HTMLElement>
  options: typeOptions
  isDebug: boolean

  constructor({
    rootMargin = {
      lg: '0% 0px',
      sm: '0% 0px'
    },
    targetElements = document.querySelectorAll('.u-animation') as NodeListOf<HTMLElement>,
    isDebug = false
  }: Props) {
    autoBind(this)

    this.elements = targetElements

    this.options = {
      root: null,
      rootMargin: this.getRootMargin(rootMargin),
      threshold: 0
    }

    this.isDebug = isDebug

    if (this.elements.length <= 0) return

    this.init()
  }

  getRootMargin(rootMargin: rootMarginOptions): string {
    return GetDeviceType() === 'lg' ? rootMargin.lg : rootMargin.sm
  }

  init(): void {
    const y = window.scrollY || window.pageYOffset

    this.elements.forEach((element) => {
      // 個別のオプションを取得
      const dataRootMargin = element.dataset.animationRootMargin as string

      // rootMarginの値取得
      const rootMargin = dataRootMargin ? { rootMargin: this.getRootMargin(JSON.parse(dataRootMargin)) } : null

      // オプション
      const options = { ...this.options, ...rootMargin }

      // observer
      const observer = new IntersectionObserver(this.addClass, options)

      // デバッグモード
      if (this.isDebug) {
        observer.observe(element)
      }

      if (!this.isDebug) {
        const posTop: number = element.getBoundingClientRect().top
        const posY = posTop + y

        if (posY < y) {
          element.classList.add('is-animation')
        } else {
          observer.observe(element)
        }
      }
    })
  }

  addClass(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-animation')
      } else {
        entry.target.classList.remove('is-animation')
      }
    })
  }
}

export default AddAnimationClass
