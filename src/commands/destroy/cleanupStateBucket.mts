import { logWarning, deleteBucket } from '../../utils/index.mjs'
import { TERRAFORM_TFVARS_FILE } from '../../constants.mjs'
import { extractProjectId } from './extractProjectId.mjs'

export async function cleanupStateBucket(): Promise<void> {
  logWarning('Infrastructure destroyed. Now cleaning up state bucket...')

  try {
    const projectId = await extractProjectId()

    if (projectId) {
      await deleteBucket(projectId)
    } else {
      logWarning(
        `Could not find project_id in ${TERRAFORM_TFVARS_FILE}, skipping bucket deletion`
      )
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logWarning(`Failed to delete state bucket: ${errorMessage}`)
  }
}
