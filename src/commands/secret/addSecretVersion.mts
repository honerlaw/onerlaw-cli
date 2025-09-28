import { execa } from 'execa'

export async function addSecretVersion(
  fullSecretName: string,
  secretValue: string
): Promise<void> {
  execa`echo -n ${secretValue}`.pipe(
    `gcloud secrets versions add ${fullSecretName} --data-file=-`
  )

  // await runCommand('sh', [
  //   '-c',
  //   'echo',
  //   '-n',
  //   secretValue,
  //   '|',
  //   'gcloud',
  //   'secrets',
  //   'versions',
  //   'add',
  //   fullSecretName,
  //   '--data-file=-',
  // ])
}
