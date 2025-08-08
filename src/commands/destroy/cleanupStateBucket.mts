import { logWarning, deleteBucket } from '../../utils/index.mjs'
import { TERRAFORM_TFVARS_FILE } from '../../constants.mjs'
import { LoadedConfig } from '@/config/index.mjs'

export async function cleanupStateBucket(config: LoadedConfig): Promise<void> {
  logWarning('Infrastructure destroyed. Now cleaning up state bucket...')

  try {
    const projectId = config.selection.project

    // only delete the bucket if there is only one project entry for this id
    if (config.configs.filter(cfg => cfg.project === projectId).length === 1) {
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
