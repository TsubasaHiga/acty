import { values } from '@/const/values'

/**
 * breakpointとウインドウサイズを比較してlg、md、smのいずれかを取得します
 * @return string 'lg' or 'md' or 'sm'
 */
export const getDeviceType = (): 'lg' | 'md' | 'sm' => {
  if (window.innerWidth > values.BREAKPOINT_XMD_DOWN) {
    return 'lg'
  } else if (window.innerWidth > values.BREAKPOINT) {
    return 'md'
  } else {
    return 'sm'
  }
}
