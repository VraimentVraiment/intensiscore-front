export const readFile = (file: File, callback: (content: string) => void) => {
  if (!file) {
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    callback(content)
  }
  reader.readAsText(file)
}

export async function downloadFile({
  filename,
  url,
}: {
  filename: string
  url: string
}) {
  if (import.meta.server) {
    return
  }
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a?.click()
  URL.revokeObjectURL(url)
  a.remove()
}
