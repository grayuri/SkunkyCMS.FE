import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import useFetch from "../../hooks/useFetch";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDatabaseContext from "../../hooks/useDatabaseContext";

import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import './UpdateSubcategoryPanel.scss';
import { Subcategory } from '../../types/Subcategory';

type Props = {
  setShowUpdateSubcategoryPanel: React.Dispatch<React.SetStateAction<boolean>>,
  setCategoriesLoading: React.Dispatch<React.SetStateAction<boolean>>,
  subcategory: Subcategory
}

function UpdateSubcategoryPanel(props: Props) {
  const { setShowUpdateSubcategoryPanel, setCategoriesLoading, subcategory } = props
  const { subcategories, setSubcategories } = useDatabaseContext()

  const [newSubcategoryName, setNewSubcategoryName] = useState(subcategory.name)

  async function updateSubcategory (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (newSubcategoryName === "") return notifyEmptyFields()

    try {
      const response = await fetch(`${import.meta.env.VITE_ADDRESS}/api/subcategories/${subcategory._id}`, {
        method: "PATCH",
        body: JSON.stringify({name: newSubcategoryName}),
        headers: { "Content-Type":"Application/json" }
      })
      const json = await response.json()

      if (!response.ok) throw new Error(json.error)
      
      setCategoriesLoading(true)

      insertSubcategoriesWithUpdatedSubcategory()
    }
    catch (error) {
      console.log(error)
    }

    setShowUpdateSubcategoryPanel(false)
  }

  async function insertSubcategoriesWithUpdatedSubcategory () {
    try {
      const response = await fetch(`${import.meta.env.VITE_ADDRESS}/api/subcategories/`)
      const json = await response.json()

      if (!response.ok) throw new Error(json.error)

      setSubcategories(json)
      setCategoriesLoading(false)
    } 
    catch (error) {
      console.log(error)
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
      <div className="dark-layer" onClick={() => setShowUpdateSubcategoryPanel(false)} />
      
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
        onSubmit={updateSubcategory}
      >
        <div className="icon-area">
          <CloseIcon 
            className="close-icon" 
            sx={{ width: "32px", height: "32px"}}
            onClick={() => setShowUpdateSubcategoryPanel(false)}
          />
        </div>

        <h1>Update Subcategory Panel</h1>

        <div className="fields">
          <label htmlFor="subcategory-name">
            <span>Name: </span>
            <input 
              type="text" 
              id="subcategory-name" 
              name="subcategory-name" 
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
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

export default UpdateSubcategoryPanel;