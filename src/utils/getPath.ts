/**
 * 指定したPATHに`import.meta.env.BASE_URL`を加えた形でPATHを取得します
 */
const GetPath = (pathName: string): string => import.meta.env.BASE_URL + pathName

export default GetPath
