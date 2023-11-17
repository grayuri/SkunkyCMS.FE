import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useFetch from "../../hooks/useFetch";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDatabaseContext from "../../hooks/useDatabaseContext";
import useDatabasePayload from "../../hooks/useDatabasePayload";

import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import CloseIcon from '@mui/icons-material/Close';

import './Subcategories.scss';
import ListedSubcategory from "../../components/ListedSubcategory/ListedSubcategory";
import { Category } from "../../types/Category";
import { Subcategory } from "../../types/Subcategory";
import Loader from "../../components/Loader/Loader";

export default function Subcategories() {
  const { subcategories, setSubcategories } = useDatabaseContext()
  const { createSubcategoryPayload } = useDatabasePayload()

  const [showSubcategoryRegister, setShowSubcategoryRegister] = useState(false)
  const [newSubcategoryName, setNewSubcategoryName] = useState("")
  const [categorySelected, setCategorySelected] = useState("")

  const {
    data: categories, 
    loading: categoriesLoading, 
    setLoading: setCategoriesLoading,
    error: categoriesError
  } = useFetch<Category>("/api/categories/")

  const {
    data: subcategoriesData,
    setData: setSubcategoriesData,
    loading: subcategoriesLoading,
    error: subcategoriesError
  } = useFetch<Subcategory>("/api/subcategories/")

  async function createSubcategory(e: React.SyntheticEvent<EventTarget>) {
    e.preventDefault()

    if (newSubcategoryName === "" || categorySelected === "") return notifyEmptyFields()

    const newSubcategory = {
      name: newSubcategoryName,
      categoryId: categorySelected
    }
    
    try {
      const response = await fetch(import.meta.env.VITE_ADDRESS + "/api/subcategories/", {
        method: "POST",
        body: JSON.stringify(newSubcategory),
        headers: { "Content-Type":"Application/json" }
      })
  
      const json = await response.json()

      if (!response.ok) throw new Error(json.error)
      else {
        createSubcategoryPayload(json)
      }
    }
    catch (error) {
      console.log(error)
    }

    setShowSubcategoryRegister(false)
  }

  useEffect(() => {
    setSubcategories(subcategoriesData)
  },[subcategoriesData])

  console.log("oi")

  function notifyEmptyFields() {
    toast.error(`Please, fill all the fields.`, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }


  return (
    <motion.div
      className="subcategories-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.24 } }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
    >
      <div className="top">
        <LoyaltyOutlinedIcon sx={{ width: "72px", height: "auto" }} />
        <h1>Subcategories</h1>
      </div>

      <div className="middle">
        <button className="addSubcategory-button" onClick={() => setShowSubcategoryRegister(true)}>
          <AddSharpIcon sx={{ width: '32px', height: '32px' }} />
          <span>Add Subcategory</span>
        </button>

        <AnimatePresence mode="wait">
          {
            showSubcategoryRegister && (
              <motion.form
                className="subcategory-register"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                onSubmit={createSubcategory}
              >
                <CloseIcon
                  className="close-icon"
                  sx={{ width: "24px", height: "24px", cursor: "pointer" }}
                  onClick={() => setShowSubcategoryRegister(false)}
                />

                <label htmlFor="subcategory-name">
                  <span>Name:</span>
                  <input
                    type="text"
                    id="subcategory-name"
                    name="subcategory-name"
                    placeholder='Subcategory name...'
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                  />
                </label>

                <label htmlFor="subcategory-category">
                  <span>Category:</span>
                  <select 
                    name="subcategory-category" 
                    id="subcategory-category"
                    onChange={(e) => setCategorySelected(e.target.value)}
                  >
                    <option value="">Select a Category</option>
                    {
                      categories.map(category => (
                        <option value={category._id} key={category._id}>
                          {category.name}
                        </option>
                      ))
                    }
                  </select>
                </label>

                <button className="create-button" type="submit">
                  <AddSharpIcon sx={{ width: '24px', height: '24px' }} />
                  <span>Create</span>
                </button>
              </motion.form>
            )
          }
        </AnimatePresence>
      </div>

      <main className="bottom">
        {
          categoriesError
          ? "Error"
          : (
            categoriesLoading
            ? <Loader size={64} />
            : (
              categories.map(category => (
                <div className="single-category" key={category._id}>
                  <h1 className="category-name"><span>{category.name}</span></h1>
                  <div className="subcategories-related">
                    {
                      subcategories
                      .filter(subcategory => subcategory.categoryId === category._id)
                      .map(subcategory => (
                        <ListedSubcategory 
                          key={subcategory._id} 
                          subcategory={subcategory} 
                          setCategoriesLoading={setCategoriesLoading}
                        />
                      ))
                    }
                  </div>
                </div>
              ))
            )
          )
        }
      </main>

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </motion.div>
  )
}
