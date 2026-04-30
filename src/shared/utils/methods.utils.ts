const removeSpecialCharacters = (value: string) => {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
};


const setRequiredEnv = (name: string): string => {
  const value = process?.env[name]

  if (!value) {
    throw new Error(`Environment variable is required: ${name}`)
  }

  return value
}


export {removeSpecialCharacters, setRequiredEnv};