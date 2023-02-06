import dayjs from 'dayjs'

/**
 * 日付文字列を特定のフォーマットに変換して返します
 */
const ChangeDateStringToSpecificFormat = (date: string, format = 'YYYY年MM月DD日'): string => dayjs(date).format(format)

export default ChangeDateStringToSpecificFormat
