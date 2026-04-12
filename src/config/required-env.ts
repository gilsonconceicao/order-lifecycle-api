export function required(name: string): string {
  const value = process?.env[name]

  if (!value) {
    throw new Error(`Environment variable is required: ${name}`)
  }

  return value
}
