// 共通で使用する定数
export const values = {
  // ブレイクポイント
  BREAKPOINT: 767
} as const

// astro-imagetoolsで使用する定数
export const astroImageTools = {
  // formatOptions
  FORMAT_OPTIONS: {
    jpg: {
      quality: 80
    },
    png: {
      quality: 80
    },
    webp: {
      quality: 50
    },
    avif: {
      quality: 50
    }
  }
}
