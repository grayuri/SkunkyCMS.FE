import useDatabaseContext from "./useDatabaseContext";

import { Product } from "../types/Product";
import { Category } from "../types/Category";
import { Subcategory } from "../types/Subcategory";
import { Type } from "../types/Type";

function useDatabasePayload() {
  const {
    products,
    setProducts,
    categories,
    setCategories,
    subcategories,
    setSubcategories,
    types,
    setTypes
  } = useDatabaseContext()

  function createProductPayload(payload: Product) {
    setProducts((previousProducts: Product[]) => [...previousProducts, payload])
  }

  function deleteProductPayload(payload: Product) {
    const productsExceptPayload = products.filter(product => product._id !== payload._id)
    setProducts(productsExceptPayload)
  }

  function createCategoryPayload(payload: Category) {
    setCategories((previousCategories: Category[]) => [...previousCategories, payload ])
  }

  function deleteCategoryPayload(payload: Product) {
    const categoriesExceptPayload = categories.filter(category => category._id !== payload._id)
    setCategories(categoriesExceptPayload)
  }

  function createSubcategoryPayload(payload: Subcategory) {
    setSubcategories((previousSubcategories: Subcategory[]) => [...previousSubcategories, payload])
  }

  function deleteSubcategoryPayload(payload: Subcategory) {
    const subcategoriesExceptPayload = subcategories.filter(subcategory => subcategory._id !== payload._id)
    setSubcategories(subcategoriesExceptPayload)
  }

  function createTypePayload(payload: Type) {
    setTypes((previousTypes: Type[]) => [...previousTypes, payload])
  }

  function deleteTypePayload(payload: Type) {
    const typesExceptPayload = types.filter(types => types._id !== payload._id)
    setTypes(typesExceptPayload)
  }

  return {
    createProductPayload,
    deleteProductPayload,
    createCategoryPayload,
    deleteCategoryPayload,
    createSubcategoryPayload,
    deleteSubcategoryPayload,
    createTypePayload,
    deleteTypePayload
  }
}

export default useDatabasePayload;