export type Product = {
  _id: string,
  name: string,
  description: string,
  imagesUrls: string[],
  currentPrice: number,
  oldPrice: number,
  typeId: string,
  categoryId: string,
  subcategoryId: string,
  slug: string
}