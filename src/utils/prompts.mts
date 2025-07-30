import { consola } from 'consola'

/**
 * Prompt user for confirmation using consola
 */
export async function confirm(message: string): Promise<boolean> {
  try {
    const answer = await consola.prompt(message, {
      type: 'confirm',
    })

    return answer as boolean
  } catch {
    return false
  }
}

/**
 * Prompt user for input using consola
 */
export async function input(
  message: string,
  defaultValue?: string
): Promise<string> {
  const promptMessage = defaultValue ? `${message} (${defaultValue})` : message

  try {
    const answer = await consola.prompt(promptMessage, {
      type: 'text',
      default: defaultValue,
    })

    return answer as string
  } catch {
    // Fallback to default if user cancels
    return defaultValue || ''
  }
}

/**
 * Prompt user to select from a list of options
 */
export async function select<T>(
  message: string,
  choices: Array<{ name: string; value: T; description?: string }>,
  defaultIndex = 0
): Promise<T> {
  const options = choices.map((choice, index) => ({
    label: choice.name,
    value: index.toString(),
    hint: choice.description,
  }))

  try {
    const answer = await consola.prompt(message, {
      type: 'select',
      options: options,
      default: defaultIndex.toString(),
    })

    const selectedIndex = parseInt(answer as string)
    return choices[selectedIndex].value
  } catch {
    if (defaultIndex === -1) {
      throw new Error('Must select an option.')
    }

    // Fallback to default if user cancels
    return choices[defaultIndex]?.value
  }
}
