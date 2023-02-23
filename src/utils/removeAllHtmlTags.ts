import DOMPurify from 'isomorphic-dompurify'

/**
 * HTMLタグを全て削除する
 */
const RemoveAllHtmlTags = (string: string): string => DOMPurify.sanitize(string, { USE_PROFILES: { html: false } })

export default RemoveAllHtmlTags
