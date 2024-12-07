import GetDeviceType from '@utils/getDeviceType'
import autoBind from 'auto-bind'

type RootMarginOptions = {
  [keyof in 'lg' | 'sm']: string
}

type Props = {
  rootMargin?: RootMarginOptions
  isOnce?: boolean
  isProgress?: boolean
}
class InView {
  element: HTMLElement
  onInView: () => void
  onOutView: () => void
  onProgress?: ((progress: number) => void) | null
  options: IntersectionObserverInit
  isOnce: boolean
  isProgress: boolean

  constructor(
    targetElement: HTMLElement,
    onInView: () => void,
    onOutView: () => void,
    onProgress?: ((progress: number) => void) | null,
    {
      rootMargin = {
        lg: '0% 0px',
        sm: '0% 0px'
      },
      isOnce = false,
      isProgress = false
    }: Props = {}
  ) {
    autoBind(this)

    this.element = targetElement
    this.onInView = onInView
    this.onOutView = onOutView

    this.options = {
      root: null,
      rootMargin: this.getRootMargin(rootMargin),
      threshold: 0
    }

    if (onProgress) {
      this.onProgress = onProgress
      this.options.threshold = Array.from({ length: 101 }, (_, i) => i / 100)
    }

    this.isOnce = isOnce
    this.isProgress = isProgress

    this.init()
  }

  getRootMargin(rootMargin: RootMarginOptions): string {
    return GetDeviceType() === 'lg' ? rootMargin.lg : rootMargin.sm
  }

  init(): void {
    const y = window.scrollY

    // 個別のオプションを取得
    const dataRootMargin = this.element.dataset.animationRootMargin as string

    // rootMarginの値取得
    const rootMargin = dataRootMargin ? { rootMargin: this.getRootMargin(JSON.parse(dataRootMargin)) } : null

    // オプション
    const options = { ...this.options, ...rootMargin }

    // observer
    const observer = new IntersectionObserver(this.handleIntersection, options)

    // 1度だけ実行する場合
    if (this.isOnce) {
      const posTop: number = this.element.getBoundingClientRect().top
      const posY = posTop + y

      if (posY < y) {
        this.onInView()
      } else {
        observer.observe(this.element)
      }

      return
    }

    observer.observe(this.element)
  }

  handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.onInView()
      } else {
        if (this.isOnce) return
        this.onOutView()
      }
      if (this.isProgress) {
        this.progress(entry)
      }
    })
  }

  progress(entry: IntersectionObserverEntry): void {
    const progress = entry.intersectionRatio
    if (this.onProgress) this.onProgress(progress)
  }

  destroy(): void {
    const observer = new IntersectionObserver(this.handleIntersection, this.options)
    observer.unobserve(this.element)
  }
}

export default InView
