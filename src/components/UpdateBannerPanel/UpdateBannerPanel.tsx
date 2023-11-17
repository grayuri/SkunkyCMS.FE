import { useState } from "react"
import { motion } from 'framer-motion';
import showIfImageExists from "../../utils/showIfImageExists";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useDatabaseContext from "../../hooks/useDatabaseContext";

import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import './UpdateBannerPanel.scss';
import { Banner } from "../../types/Banner";

type Props = {
  setShowUpdateBannerPanel: React.Dispatch<React.SetStateAction<boolean>>,
  setBannersLoading: (newState: boolean) => void,
  banner: Banner
}

function UpdateBannerPanel(props: Props) {
  const { setShowUpdateBannerPanel, setBannersLoading, banner } = props
  const { setBanners } = useDatabaseContext()

  const [newBannerImage, setNewBannerImage] = useState(banner.imageUrl)

  async function updateBanner (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (newBannerImage === "") return notifyEmptyFields()

    const updatedBanner = {
      imageUrl: newBannerImage,
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_ADDRESS}/api/banners/${banner._id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedBanner),
        headers: { "Content-Type":"Application/json" }
      })
      const json = await response.json()

      if (!response.ok) throw new Error(json.error)

      setBannersLoading(true)

      insetBannersWithUpdatedBanner()
    }
    catch (error) {
      console.log(error)
    }

    setShowUpdateBannerPanel(false)
  }

  async function insetBannersWithUpdatedBanner () {
    try {
      const response = await fetch(`${import.meta.env.VITE_ADDRESS}/api/banners/`)
      const json = await response.json()

      if (!response.ok) throw new Error(json.error)

      setBanners(json)
      setBannersLoading(false)
    } 
    catch (error) {
      console.log(error)
    }
  }

  function setImageIfExists (value: string) {
    const exists = showIfImageExists(value)
    if (!exists) {
      setNewBannerImage("")
    }
    else {
      setNewBannerImage(value)
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
      <div className="dark-layer" onClick={() => setShowUpdateBannerPanel(false)} />
      
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
        onSubmit={updateBanner}
      >
        <div className="icon-area">
          <CloseIcon 
            className="close-icon" 
            sx={{ width: "32px", height: "32px"}}
            onClick={() => setShowUpdateBannerPanel(false)}
          />
        </div>

        <h1>Update Banner Panel</h1>

        <div className="fields">
          <label htmlFor="banner-image">
            <span>Image: </span>
            <input 
              type="text" 
              id="banner-image" 
              name="banner-image" 
              value={newBannerImage}
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

export default UpdateBannerPanel;