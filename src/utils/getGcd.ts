/**
 * 2つの数字から最大公約数を計算し返します
 * @param a number
 * @param b number
 */
const GetGcd = (a: number, b: number): number => {
  if (b === 0) return a
  return GetGcd(b, a % b)
}

export default GetGcd
