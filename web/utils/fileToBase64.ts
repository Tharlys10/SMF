export const fileToBase64 = (f: File) => {
  const reader = new FileReader()

  return new Promise<string>((resolve, reject) => {
    reader.onerror = () => {
      reader.abort()
      reject(new Error('Não foi possível ler o arquivo'))
    }

    reader.onload = () => {
      resolve(reader.result as string)
    }

    reader.readAsDataURL(f)
  })
}
