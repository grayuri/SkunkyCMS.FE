import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useFetch from "../../hooks/useFetch";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDatabaseContext from "../../hooks/useDatabaseContext";
import useDatabasePayload from "../../hooks/useDatabasePayload";

import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import CloseIcon from '@mui/icons-material/Close';

import './Types.scss';
import ListedType from "../../components/ListedType/ListedType";
import { Type } from "../../types/Type";
import Loader from "../../components/Loader/Loader";

export default function Types() {
  const { types, setTypes } = useDatabaseContext()
  const { createTypePayload } = useDatabasePayload()

  const [showTypeRegister, setShowTypeRegister] = useState(false)
  const [newTypeName, setNewTypeName] = useState("")

  const {
    data: typesData,
    loading: typesLoading,
    setLoading: setTypesLoading,
    error: typesError
  } = useFetch<Type>("/api/types/")

  async function createType() {
    if (newTypeName === "") return notifyEmptyFields()

    try {
      const response = await fetch(`${import.meta.env.VITE_ADDRESS}/api/types/`, {
        method: "POST",
        body: JSON.stringify({name: newTypeName}),
        headers: { "Content-Type":"Application/json" }
      })
      const json = await response.json()

      if (!response.ok) throw new Error(json.error)
      else {
        createTypePayload(json)
      }
    }
    catch (error) {
      console.log(error)
    }

    setShowTypeRegister(false)
  }

  useEffect(() => {
    setTypes(typesData)
  },[typesData])

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
      className="types-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.24 } }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
    >
      <div className="top">
        <AccountTreeOutlinedIcon sx={{ width: "72px", height: "auto" }} />
        <h1>Types</h1>
      </div>

      <div className="middle">
        <button className="addType-button" onClick={() => setShowTypeRegister(true)}>
          <AddSharpIcon sx={{ width: '32px', height: '32px' }} />
          <span>Add Type</span>
        </button>

        <AnimatePresence mode="wait">
          {
            showTypeRegister && (
              <motion.div
                className="type-register"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
              >
                <CloseIcon
                  className="close-icon"
                  sx={{ width: "24px", height: "24px", cursor: "pointer" }}
                  onClick={() => setShowTypeRegister(false)}
                />

                <label htmlFor="type-name">
                  <span>Name:</span>
                  <input
                    type="text"
                    id="type-name"
                    name="type-name"
                    placeholder='Type name...'
                    onChange={(e) => setNewTypeName(e.target.value)}
                  />
                </label>

                <button className="create-button" onClick={createType}>
                  <AddSharpIcon sx={{ width: '24px', height: '24px' }} />
                  <span>Create</span>
                </button>
              </motion.div>
            )
          }
        </AnimatePresence>
      </div>

      <main className={`bottom ${typesLoading ? "loading" : ""}`}>
        {
          typesError
          ? "Error"
          : (
            typesLoading
            ? <Loader size={64} />
            : (
              types.filter(type => type.name !== "none").map((type) => (
                <ListedType 
                  type={type} 
                  key={type._id}
                  setTypesLoading={setTypesLoading}
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
