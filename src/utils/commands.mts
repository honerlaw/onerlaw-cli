import { execa, type Options } from 'execa'

export async function setGcloudProject(project: string): Promise<void> {
  await runCommand('gcloud', ['config', 'set', 'project', project], {}, true)
}

export async function runCommand(
  command: string,
  args: string[] = [],
  options: Record<string, unknown> = {},
  captureOutput = false
): Promise<string | void> {
  const execaOptions: Options = {
    stdio: captureOutput ? 'pipe' : 'inherit',
    shell: false,
    ...options,
  }

  if (captureOutput) {
    const result = await execa(command, args, execaOptions)
    const stdout = String(result.stdout || '')
    const stderr = String(result.stderr || '')
    return stdout + stderr
  } else {
    await execa(command, args, execaOptions)
    return
  }
}
