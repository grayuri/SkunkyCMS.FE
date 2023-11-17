import { createContext, useState } from "react";

import { Product } from "../types/Product"
import { Category } from "../types/Category"
import { Subcategory } from "../types/Subcategory"
import { Type } from "../types/Type"
import { Banner } from "../types/Banner";

type DatabaseContextTypes = {
  products: Product[],
  setProducts: (value: React.SetStateAction<Product[]>) => void,
  categories: Category[],
  setCategories: (value: React.SetStateAction<Category[]>) => void,
  subcategories: Subcategory[],
  setSubcategories: (value: React.SetStateAction<Subcategory[]>) => void,
  types: Type[],
  setTypes: (value: React.SetStateAction<Type[]>) => void,
  banners: Banner[],
  setBanners: (value: React.SetStateAction<Banner[]>) => void
}

const initialValue: DatabaseContextTypes = {
  products: [],
  setProducts: () => {},
  categories: [],
  setCategories: () => {},
  subcategories: [],
  setSubcategories: () => {},
  types: [],
  setTypes: () => {},
  banners: [],
  setBanners: () => {}
}

export const DatabaseContext = createContext<DatabaseContextTypes>(initialValue)

type Props = {
  children: React.ReactNode;
}

export default function DatabaseContextProvider({ children }: Props) {
  const [products, setProducts] = useState<Product[]>(initialValue.products)
  const [categories, setCategories] = useState<Category[]>(initialValue.categories)
  const [subcategories, setSubcategories] = useState<Subcategory[]>(initialValue.subcategories)
  const [types, setTypes] = useState<Type[]>(initialValue.types)
  const [banners, setBanners] = useState<Banner[]>(initialValue.banners)

  return (
    <DatabaseContext.Provider value={{
      products,
      setProducts,
      categories,
      setCategories,
      subcategories,
      setSubcategories,
      types,
      setTypes,
      banners,
      setBanners
    }}>
      {children}
    </DatabaseContext.Provider>
  )
}
