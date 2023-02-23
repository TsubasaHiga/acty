import GetGcd from '@utils/getGcd'

/**
 * アスペクト比を返します
 * @param w number
 * @param h number
 */
const GetAspectRatio = (w: number, h: number): { w: number; h: number } => {
  const gcd = GetGcd(w, h)
  return { w: w / gcd, h: h / gcd }
}

export default GetAspectRatio
