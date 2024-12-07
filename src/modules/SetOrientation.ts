import autoBind from 'auto-bind'
import { debounce } from 'umaki'

class SetOrientation {
  constructor() {
    autoBind(this)

    this.check()

    window.addEventListener('resize', debounce(this.check, 100), false)
  }

  check() {
    const isLandscape = window.matchMedia('(orientation: landscape)').matches
    document.documentElement.dataset.orientation = isLandscape ? 'landscape' : 'portrait'
  }
}

export default SetOrientation
