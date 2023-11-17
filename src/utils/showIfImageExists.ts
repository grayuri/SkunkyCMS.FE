export default function showIfImageExists (url: string) {
  const image: HTMLImageElement = new Image()
  image.src = url

  if (!image.complete) return false
  if (image.height === 0) return false
  
  return true
}