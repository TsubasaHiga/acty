import path from 'node:path'

/**
 * Get path from local public folder
 */
export const getPathFromLocalPublic = (fileName: string): string => path.join(process.cwd(), 'public', fileName)
