import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import useDatabaseContext from "../../hooks/useDatabaseContext";

import Pagination from '@mui/material/Pagination';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SendIcon from '@mui/icons-material/Send';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import FilterAltSharpIcon from '@mui/icons-material/FilterAltSharp';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import './Home.scss';
import ListedProduct from "../../components/ListedProduct/ListedProduct";
import { Product } from "../../types/Product";
import { Category } from "../../types/Category";
import { Type } from "../../types/Type";

export default function Home() {
  const { products, setProducts } = useDatabaseContext()

  const {
    data: productsData,
    setData: setProductsData,
    loading: productsLoading,
    error: productsError
  } = useFetch<Product>("/api/products/")

  const { data: categories } = useFetch<Category>("/api/categories/")

  const { data: types } = useFetch<Type>("/api/types/")

  const [searchedProducts, setSearchedProducts] = useState<Product[]>([])
  const [showFiltersDiv, setShowFiltersDiv] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedType, setSelectedType] = useState("")

  const productsPerPage = 20
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = searchedProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  useEffect(() => {
    setProducts(productsData)
    setSearchedProducts(products)
  }, [productsData])

  const searchProduct = () => {
    if (query === "") setSearchedProducts(products)

    const productsSearched = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()))

    setSearchedProducts(productsSearched)
  }

  const settingQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") setSearchedProducts(products)

    setQuery(e.target.value)
  }

  const settingCategoryFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "") return setSearchedProducts(products)

    const categorieChoosed = e.target.value

    const filteredProductsCategorie = products.filter(product => product.categoryId === categorieChoosed)
    setSearchedProducts(filteredProductsCategorie)
    setSelectedCategory(categorieChoosed)
  }

  const settingTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "") return setSearchedProducts(products)

    const typeChoosed = e.target.value

    const filteredProductsType = products.filter(product => product.typeId === typeChoosed)
    setSearchedProducts(filteredProductsType)
    setSelectedType(typeChoosed)
  }

  const resetFilters = () => {
    setSearchedProducts(products)
    setSelectedType("")
    setSelectedCategory("")
  }

  const paginate = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const toggleFiltersDiv = () => {
    if (showFiltersDiv === true) {
      return setShowFiltersDiv(false)
    }
    else {
      return setShowFiltersDiv(true)
    }
  }

  return (
    <motion.div
      className="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.24 } }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
    >
      <header className="top">
        <HomeOutlinedIcon sx={{ width: "72px", height: "72px" }} />
        <h1>Home</h1>
      </header>

      <section className="middle">
        <div className="input-search">
          <input
            type="text"
            id="search"
            placeholder='Type the name of the product...'
            onChange={(e) => settingQuery(e)}
          />
          <button className="send-button" onClick={searchProduct}>
            <SendIcon sx={{ width: '24px', height: '24px' }} />
          </button>
        </div>

        <div className="filter">
          <button className="filter-button" onClick={toggleFiltersDiv}>
            <FilterAltSharpIcon sx={{ width: '32px', height: '32px' }} />
            <span>Filter</span>
          </button>

          <AnimatePresence mode="wait">
            {
              showFiltersDiv === true && (
                <motion.div
                  className="filters-div"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                >
                  <label htmlFor="categorie-filter">
                    <span>Category:</span>
                    <select
                      name="categorie-filter"
                      id="categorie-filter"
                      onChange={(e) => settingCategoryFilter(e)}
                      value={selectedCategory}
                    >
                      <option value="">All</option>
                      {
                        categories.map(type => (
                          <option value={type._id} key={type._id}> {type.name} </option>
                        ))
                      }
                    </select>
                  </label>

                  <label htmlFor="type-filter">
                    <span>Type:</span>
                    <select
                      name="type-filter"
                      id="type-filter"
                      onChange={(e) => settingTypeFilter(e)}
                      value={selectedType}
                    >
                      <option value="">All</option>
                      {
                        types.map(type => (
                          <option value={type._id} key={type._id}> {type.name} </option>
                        ))
                      }
                    </select>
                  </label>

                  <button className="reset-filters-button" onClick={resetFilters}>
                    <RestartAltIcon />
                    Reset Filters
                  </button>
                </motion.div>
              )
            }
          </AnimatePresence>
        </div>

        <Link className='link' to="/registering/">
          <button className="addProduct-button">
            <AddSharpIcon sx={{ width: '32px', height: '32px' }} />
            <span>Add Product</span>
          </button>
        </Link>
      </section>

      <main className="bottom">
        <table className="products-list">
          <thead>
            <tr className="header-list">
              <th className="title">Title</th>
              <th className="price">Price</th>
              <th className="category">Category</th>
              <th className="subcategory">Subcategory</th>
              <th className="type">Type</th>
              <th className="operations">Operations</th>
            </tr>
          </thead>
          <tbody>
            {
              productsError
                ? "Error"
                : (
                  productsLoading
                    ? <tr><td>...</td></tr>
                    : (
                      currentProducts.map(product => (
                        <ListedProduct key={product._id} product={product} setProductsData={setProductsData} />
                      ))
                    )
                )
            }
          </tbody>
        </table>

        <div className="pagination-section">
          <Pagination
            shape="rounded"
            defaultPage={1}
            count={Math.ceil(products.length / productsPerPage)}
            page={currentPage}
            onChange={paginate}
            size='large'
            color='secondary'
            onClick={() => window.scrollTo(0, 0)}
            style={{ zIndex: -1 }}
          />
        </div>
      </main>
    </motion.div>
  )
}
