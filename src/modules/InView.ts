import GetDeviceType from '@utils/getDeviceType'
import autoBind from 'auto-bind'

type RootMarginOptions = {
  [keyof in 'lg' | 'sm']: string
}

type Props = {
  rootMargin?: RootMarginOptions
  isOnce?: boolean
  isProgress?: boolean
  animationDuration?: number
  debounceDelay?: number
}
class InView {
  element: HTMLElement
  onInView: () => void
  onOutView: () => void
  onProgress?: ((progress: number) => void) | null
  options: IntersectionObserverInit
  isOnce: boolean
  isProgress: boolean
  observer: IntersectionObserver | null = null
  isVisible: boolean = false
  animationLock: boolean = false
  animationLockDuration: number = 0
  debounceTimer: NodeJS.Timeout | null = null
  debounceDelay: number = 100

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
      isProgress = false,
      animationDuration = 0,
      debounceDelay = 100
    }: Props = {}
  ) {
    autoBind(this)

    this.element = targetElement
    this.onInView = onInView
    this.onOutView = onOutView
    this.debounceDelay = debounceDelay
    this.animationLockDuration = animationDuration || this.getAnimationDuration()

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

  getAnimationDuration(): number {
    // CSSからアニメーション時間を自動取得
    const styles = window.getComputedStyle(this.element)
    const duration = styles.transitionDuration || styles.animationDuration || '0s'
    const delays = styles.transitionDelay || styles.animationDelay || '0s'

    const parseDuration = (str: string) => {
      const values = str.split(',').map((v) => parseFloat(v.trim()))
      return Math.max(...values) || 0
    }

    return (parseDuration(duration) + parseDuration(delays)) * 1000
  }

  getRootMargin(rootMargin: RootMarginOptions): string {
    return GetDeviceType() === 'lg' ? rootMargin.lg : rootMargin.sm
  }

  init(): void {
    const y = window.scrollY

    // 個別のオプションを取得
    const dataRootMargin = this.element.dataset.animationRootMargin as string
    const dataAnimationDuration = this.element.dataset.animationDuration as string
    const dataDebounceDelay = this.element.dataset.debounceDelay as string

    // rootMarginの値取得
    const rootMargin = dataRootMargin ? { rootMargin: this.getRootMargin(JSON.parse(dataRootMargin)) } : null

    // アニメーション時間の設定（data属性があれば優先）
    if (dataAnimationDuration) {
      this.animationLockDuration = parseFloat(dataAnimationDuration)
    }

    // デバウンス遅延の設定
    if (dataDebounceDelay) {
      this.debounceDelay = parseFloat(dataDebounceDelay)
    }

    // オプション
    const options = { ...this.options, ...rootMargin }

    // observer
    this.observer = new IntersectionObserver(this.handleIntersection, options)

    // 1度だけ実行する場合
    if (this.isOnce) {
      const posTop: number = this.element.getBoundingClientRect().top
      const posY = posTop + y

      if (posY < y) {
        this.onInView()
      } else {
        this.observer.observe(this.element)
      }

      return
    }

    this.observer.observe(this.element)
  }

  handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      // アニメーションロック中かつ同じ状態なら早期リターン
      if (this.animationLock) {
        const currentDesiredState = entry.isIntersecting
        if (currentDesiredState === this.isVisible) {
          return
        }
      }

      // デバウンスタイマーをクリア
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer)
        this.debounceTimer = null
      }

      if (entry.isIntersecting) {
        if (!this.isVisible) {
          // 即座にIN状態にする（連続する要素のため）
          this.triggerInView()
        }
      } else {
        if (this.isVisible && !this.isOnce) {
          // OUT状態への移行はデバウンスする
          this.debounceTimer = setTimeout(() => {
            // アニメーションロック中でなければOUT状態に
            if (!this.animationLock) {
              this.triggerOutView()
            }
            this.debounceTimer = null
          }, this.debounceDelay)
        }
      }

      if (this.isProgress) {
        this.progress(entry)
      }
    })
  }

  triggerInView(): void {
    this.isVisible = true
    this.onInView()

    // アニメーション期間中はロック
    if (this.animationLockDuration > 0) {
      this.animationLock = true
      setTimeout(() => {
        this.animationLock = false

        // ロック解除時に現在の状態を再確認
        if (this.observer) {
          const rect = this.element.getBoundingClientRect()
          const isCurrentlyVisible = rect.top < window.innerHeight && rect.bottom > 0

          // 実際の表示状態と内部状態が異なる場合は修正
          if (!isCurrentlyVisible && this.isVisible && !this.isOnce) {
            this.triggerOutView()
          }
        }
      }, this.animationLockDuration)
    }
  }

  triggerOutView(): void {
    this.isVisible = false
    this.onOutView()

    // OUT時も短いロックをかける（オプション）
    if (this.animationLockDuration > 0) {
      this.animationLock = true
      setTimeout(
        () => {
          this.animationLock = false
        },
        Math.min(this.animationLockDuration / 2, 200)
      )
    }
  }

  progress(entry: IntersectionObserverEntry): void {
    const progress = entry.intersectionRatio
    if (this.onProgress) this.onProgress(progress)
  }

  destroy(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = null
    }

    if (this.observer) {
      this.observer.unobserve(this.element)
      this.observer.disconnect()
      this.observer = null
    }
  }
}

export default InView
