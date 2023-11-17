import { useState } from "react";
import { motion } from 'framer-motion';
import slugify from "slugify";
import showIfImageExists from "../../utils/showIfImageExists";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDatabaseContext from "../../hooks/useDatabaseContext";

import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import './UpdateCategoryPanel.scss';
import { Category } from '../../types/Category';

type Props = {
  setShowUpdateCategoryPanel: React.Dispatch<React.SetStateAction<boolean>>,
  setCategoriesLoading: (newState: boolean) => void,
  category: Category
}

function UpdateCategoryPanel(props: Props) {
  const { setShowUpdateCategoryPanel, setCategoriesLoading, category } = props
  const { setCategories } = useDatabaseContext()

  const [newCategoryName, setNewCategoryName] = useState(category.name)
  const [newCategoryImage, setNewCategoryImage] = useState(category.imageUrl)

  async function updateCategory (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (newCategoryName === "" || newCategoryImage === "") return notifyEmptyFields()

    const updatedCategory = {
      name: newCategoryName,
      imageUrl: newCategoryImage,
      slug: slugify(newCategoryName)
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_ADDRESS}/api/categories/${category._id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedCategory),
        headers: { "Content-Type":"Application/json" }
      })
      const json = await response.json()

      if (!response.ok) throw new Error(json.error)

      setCategoriesLoading(true)

      insertCategoriesWithUpdatedCategory()
    }
    catch (error) {
      console.log(error)
    }

    setShowUpdateCategoryPanel(false)
  }

  async function insertCategoriesWithUpdatedCategory () {
    try {
      const response = await fetch(`${import.meta.env.VITE_ADDRESS}/api/categories/`)
      const json = await response.json()

      if (!response.ok) throw new Error(json.error)

      setCategories(json)

      setCategoriesLoading(false)
    }
    catch(error) {
      console.log(error)
    }
  }

  function setImageIfExists (value: string) {
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
      className="update-category-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.48, ease: [0.65, 0, 0.35, 1]} }}
      exit={{ opacity: 0, transition: { duration: 0.48, ease: [0.65, 0, 0.35, 1]} }}
    >
      <div className="dark-layer" onClick={() => setShowUpdateCategoryPanel(false)} />
      
      <motion.form
        initial={{ opacity: 0, y: "-100vh" }}
        animate={{ 
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.24,
            duration: 0.48, 
            ease: [0.65, 0, 0.35, 1]
          }
        }}
        exit={{ 
          opacity: 0, 
          y: "-100vh",
          transition: {
            duration: 0.48, 
            ease: [0.65, 0, 0.35, 1]
          }
        }}
        onSubmit={updateCategory}
      >
        <div className="icon-area">
          <CloseIcon 
            className="close-icon" 
            sx={{ width: "32px", height: "32px"}}
            onClick={() => setShowUpdateCategoryPanel(false)}
          />
        </div>

        <h1>Update Category Panel</h1>

        <div className="fields">
          <label htmlFor="category-name">
            <span>Name: </span>
            <input 
              type="text" 
              id="category-name" 
              name="category-name" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </label>
          <label htmlFor="category-image">
            <span>Image: </span>
            <input 
              type="text" 
              id="category-image" 
              name="category-image" 
              value={newCategoryImage}
              onChange={(e) => setImageIfExists(e.target.value)}
            />
          </label>
        </div>

        <button type="submit" className="saveChanges-button">
          <CheckIcon sx={{ width: '32px', height: '32px' }} />
          <span>Save Changes</span>
        </button>
      </motion.form>

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
  );
}

export default UpdateCategoryPanel;