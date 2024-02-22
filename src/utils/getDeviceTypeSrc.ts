/**
 * deviceTypeに応じたソースを取得して返す
 */
const GetDeviceTypeSrc = (element: HTMLElement, deviceType: 'lg' | 'sm'): string => {
  const src = deviceType === 'lg' ? element.dataset.lgSrc : element.dataset.smSrc
  return src ?? ''
}

export default GetDeviceTypeSrc
