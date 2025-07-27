import {
  getTfvarsPath,
  checkFileExists,
  readFileSync,
} from '../../utils/index.mjs'

export function extractProjectId(): string | null {
  const tfvarsPath = getTfvarsPath()

  if (!checkFileExists(tfvarsPath)) {
    return null
  }

  const tfvarsContent = readFileSync(tfvarsPath)
  const projectIdMatch = tfvarsContent.match(/project_id\s*=\s*"([^"]+)"/)

  return projectIdMatch ? projectIdMatch[1] : null
}
