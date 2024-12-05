const colorReset = '\x1b[0m'

// text colors
const textColorGreen = '\x1b[32m'
const textColorRed = '\x1b[31m'
const textColorBlue = '\x1b[34m'

// bg colors
const bgColorGreen = '\x1b[42m'
const bgColorRed = '\x1b[41m'
const bgColorBlue = '\x1b[44m'

type ColorType = 'green' | 'red' | 'blue'

/**
 * Returns the text and background colors for a given color type.
 *
 * @param color - The color type for which to get the colors. Can be 'green', 'red', or 'blue'.
 * @returns An object containing the textColor and bgColor properties corresponding to the given color type.
 */
const getColor = (color: ColorType) => {
  switch (color) {
    case 'green':
      return {
        textColor: textColorGreen,
        bgColor: bgColorGreen
      }
    case 'red':
      return {
        textColor: textColorRed,
        bgColor: bgColorRed
      }
    case 'blue':
      return {
        textColor: textColorBlue,
        bgColor: bgColorBlue
      }
  }
}

/**
 * Sets the color of the provided text based on the specified type and color.
 *
 * @param type - The type of color to apply. Can be either 'text' for text color or 'bg' for background color.
 * @param color - The color to apply. Must be of type `ColorType`.
 * @param text - The text to which the color will be applied.
 * @returns The text with the specified color applied.
 */
const setColor = (type: 'text' | 'bg', color: ColorType, text: string) => {
  const { textColor, bgColor } = getColor(color)

  if (type === 'bg') {
    return bgColor + text + colorReset
  }

  return textColor + text + colorReset
}

type GetContentType = {
  title?: string
  message: string
  color: ColorType
}
const getContent = ({ title, message, color }: GetContentType) => {
  const titleContent = title ? setColor('bg', color, ` ${title} `) + ' ' : ''
  const messageContent = setColor('text', color, message)
  const content = `${titleContent} ${messageContent}`
  return content
}

type LogFunction = {
  title?: string
  message: string
  color?: ColorType
}

/**
 * Logs a success message to the console with the specified title, message, and color.
 */
export const logSuccess = ({ title, message, color = 'green' }: LogFunction) => {
  return console.log(getContent({ title, message, color }))
}

/**
 * Logs an error message to the console with the specified title, message, and color.
 */
export const logError = ({ title, message, color = 'red' }: LogFunction) => {
  return console.error(getContent({ title, message, color }))
}

/**
 * Logs an informational message to the console with a specified title, message, and color.
 */
export const logInfo = ({ title, message, color = 'blue' }: LogFunction) => {
  return console.info(getContent({ title, message, color }))
}
