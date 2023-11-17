import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useFetch from "../../hooks/useFetch";
import slugify from "slugify";
import showIfImageExists from "../../utils/showIfImageExists";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDatabaseContext from "../../hooks/useDatabaseContext";
import useDatabasePayload from "../../hooks/useDatabasePayload";

import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import CloseIcon from '@mui/icons-material/Close';

import './Categories.scss';
import ListedCategory from "../../components/ListedCategory/ListedCategory";
import Loader from "../../components/Loader/Loader";
import { Category } from "../../types/Category";
import { JsonError } from "../../types/JsonError";

export default function Categories() {
  const { categories, setCategories } = useDatabaseContext()
  const { createCategoryPayload } = useDatabasePayload()

  const [showCategoryRegister, setShowCategoryRegister] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryImage, setNewCategoryImage] = useState("")

  const {
    data: categoriesData, 
    setData: setCategoriesData,
    loading: categoriesLoading,
    setLoading: setCategoriesLoading,
    error: categoriesError
  } = useFetch<Category>("/api/categories/")

  useEffect(() => {
    setCategories(categoriesData)
  }, [categoriesData])

  async function createCategory(e: React.SyntheticEvent<EventTarget>) {
    e.preventDefault()

    if (newCategoryName === "" || newCategoryImage === "") return notifyEmptyFields()

    const newCategory = {
      name: newCategoryName,
      imageUrl: newCategoryImage,
      slug: slugify(newCategoryName)
    }

    try {
      const response = await fetch(import.meta.env.VITE_ADDRESS + "/api/categories/", {
        method: "POST",
        body: JSON.stringify(newCategory),
        headers: {
          "Content-Type":"Application/json"
        }
      })

      const json = await response.json()

      if (!response.ok) throw new Error(json.error)
      else {
        createCategoryPayload(json)
      }

      const newBanner = {
        name: newCategoryName,
        categoryId: json._id,
        imageUrl: ""
      }

      try {
        const bannerResponse = await fetch(import.meta.env.VITE_ADDRESS + "/api/banners/", {
          method: "POST",
          body: JSON.stringify(newBanner),
          headers: {
            "Content-Type":"Application/json"
          }
        })

        const json = await bannerResponse.json()

        if (!bannerResponse.ok) throw Error(json.error)
      }
      catch (error) {
        console.log(error)
      }
    }
    catch (error) {
      console.log(error)
    }

    setShowCategoryRegister(false)
  }

  function setIfImageExists (value: string) {
    const exists = showIfImageExists(value)
    if (!exists) {
      setNewCategoryImage("")
    }
    else {
      setNewCategoryImage(value)
    }
  }

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
      className="categories-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.24 } }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
    >
      <div className="top">
        <ClassOutlinedIcon sx={{ width: "72px", height: "auto" }} />
        <h1>Categories</h1>
      </div>

      <div className="middle">
        <button className="addCategory-button" onClick={() => setShowCategoryRegister(true)}>
          <AddSharpIcon sx={{ width: '32px', height: '32px' }} />
          <span>Add Category</span>
        </button>

        <AnimatePresence mode="wait">
          {
            showCategoryRegister && (
              <motion.form
                className="category-register"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                onSubmit={createCategory}
              >
                <CloseIcon
                  className="close-icon"
                  sx={{ width: "24px", height: "24px", cursor: "pointer" }}
                  onClick={() => setShowCategoryRegister(false)}
                />

                <label htmlFor="category-name">
                  <span>Name:</span>
                  <input
                    type="text"
                    id="category-name"
                    name="category-name"
                    placeholder='Category name...'
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    value={newCategoryName}
                  />
                </label>

                <label htmlFor="category-image">
                  <span>Image:</span>
                  <input
                    type="text"
                    id="category-image"
                    name="category-image"
                    placeholder='Link of the image...'
                    onChange={(e) => setIfImageExists(e.target.value)}
                    value={newCategoryImage}
                  />
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

      <main className={`bottom ${categoriesLoading ? "loading" : ""}`}>
        {
          categoriesError 
          ? "error!"
          : ( 
            categoriesLoading
            ? (
              <Loader size={64} />
            )
            : (
              categories.map(category => (
                <ListedCategory 
                  key={category._id} 
                  category={category} 
                  setCategoriesData={setCategoriesData} 
                  setCategoriesLoading={setCategoriesLoading}
                />
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
