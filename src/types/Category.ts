export type Category = {
  _id: string,
  name: string,
  imageUrl: string,
  subcategoriesIds?: string[],
  productsIds?: string[],
  slug?: string
}