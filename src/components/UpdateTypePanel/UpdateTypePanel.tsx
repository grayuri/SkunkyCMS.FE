import { useState } from "react"
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDatabaseContext from "../../hooks/useDatabaseContext";

import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import './UpdateTypePanel.scss';
import { Type } from "../../types/Type";

type Props = {
  setShowUpdateTypePanel: React.Dispatch<React.SetStateAction<boolean>>,
  setTypesLoading: (newState: boolean) => void,
  type: Type
}

function UpdateTypePanel(props: Props) {
  const { setShowUpdateTypePanel, setTypesLoading, type } = props
  const { setTypes } = useDatabaseContext()

  const [newTypeName, setNewTypeName] = useState(type.name)

  async function updateType (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (newTypeName === "") return notifyEmptyFields()

    const updatedType = {
      name: newTypeName
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_ADDRESS}/api/types/${type._id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedType),
        headers: { "Content-Type":"Application/json" }
      })
      const json = await response.json()

      if (!response.ok) throw new Error(json.error)

      setTypesLoading(true)

      insertTypesWithUpdatedType()
    }
    catch (error) {
      console.log(error)
    }

    setShowUpdateTypePanel(false)
  }

  async function insertTypesWithUpdatedType () {
    try {
      const response = await fetch(`${import.meta.env.VITE_ADDRESS}/api/types/`)
      const json = await response.json()

      if (!response.ok) throw new Error(json.error)

      setTypes(json)

      setTypesLoading(false)
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
      className="update-type-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.48, ease: [0.65, 0, 0.35, 1]} }}
      exit={{ opacity: 0, transition: { duration: 0.48, ease: [0.65, 0, 0.35, 1]} }}
    >
      <div className="dark-layer" onClick={() => setShowUpdateTypePanel(false)} />
      
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
        onSubmit={updateType}
      >
        <div className="icon-area">
          <CloseIcon 
            className="close-icon" 
            sx={{ width: "32px", height: "32px"}}
            onClick={() => setShowUpdateTypePanel(false)}
          />
        </div>

        <h1>Update Type Panel</h1>

        <div className="fields">
          <label htmlFor="type-name">
            <span>Name: </span>
            <input 
              type="text" 
              id="type-name" 
              name="type-name" 
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
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

export default UpdateTypePanel;