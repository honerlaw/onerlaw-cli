import { getTfvarsPath, checkFileExists, readFile } from '../../utils/index.mjs'

export async function extractProjectId(): Promise<string | null> {
  const tfvarsPath = getTfvarsPath()

  if (!checkFileExists(tfvarsPath)) {
    return null
  }

  const tfvarsContent = await readFile(tfvarsPath)
  const projectIdMatch = tfvarsContent.match(/project_id\s*=\s*"([^"]+)"/)

  return projectIdMatch ? projectIdMatch[1] : null
}
