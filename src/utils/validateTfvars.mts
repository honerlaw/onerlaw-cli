import { checkTfvarsExists } from './paths.mjs'
import { TERRAFORM_TFVARS_FILE } from '../constants.mjs'

export async function validateTfvars(): Promise<void> {
  if (!checkTfvarsExists()) {
    throw new Error(
      `${TERRAFORM_TFVARS_FILE} not found. Please create it from terraform.tfvars.example`
    )
  }
}
