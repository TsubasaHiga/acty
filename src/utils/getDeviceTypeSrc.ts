/**
 * deviceTypeに応じたソースを取得して返す
 */
export const getDeviceTypeSrc = (element: HTMLElement, deviceType: 'lg' | 'sm'): string => {
  const src = deviceType === 'lg' ? element.dataset.lgSrc : element.dataset.smSrc
  return src ?? ''
}
