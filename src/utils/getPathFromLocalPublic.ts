import path from 'path'

/**
 * Get path from local public folder
 */
const GetPathFromLocalPublic = (fileName: string): string => path.join(process.cwd(), 'public', fileName)

export default GetPathFromLocalPublic
