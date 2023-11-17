import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion";

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LoyaltyOutlinedIcon from '@mui/icons-material/LoyaltyOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import ClassOutlinedIcon from '@mui/icons-material/ClassOutlined';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';

import './Sidebar.scss'

interface Props {
  expandSidebar: boolean,
  setExpandSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

const spanVariants = {
  initial: {
    opacity: 0,
    transition: {
      delay: 0.24
    }
  },

  animate: {
    opacity: 1,
    transition: {
      duration: 0.24,
      delay: 0.24
    }
  },

  exit: {
    opacity: 0,
    transition: {
      duration: 0.12
    }
  }
}

export default function Siderbar({ expandSidebar, setExpandSidebar }: Props) {
  const location = useLocation()
  const actualRoute = location.pathname.split("/")[1]

  function toggleExpandSidebar() {
    if (expandSidebar) setExpandSidebar(false)
    else setExpandSidebar(true)
  }

  return (
    <div className={`sidebar ${expandSidebar ? "expanded" : ""}`}>
      <h1 className="logo">
        SKUNKY
      </h1>

      <nav>
        <Link className="link" to="/">
          <div className={`nav-item ${actualRoute === "" ? "selected" : ""}`}>
            <HomeOutlinedIcon sx={{ width: "32px", height: "32px" }} />

            <AnimatePresence mode="wait">
              {
                expandSidebar && (
                  <motion.span
                    variants={spanVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    Home
                  </motion.span>
                )
              }
            </AnimatePresence>

          </div>
        </Link>

        <Link className="link" to="/categories">
          <div className={`nav-item ${actualRoute === "categories" ? "selected" : ""}`}>
            <ClassOutlinedIcon sx={{ width: "32px", height: "32px" }} />

            <AnimatePresence mode="wait">
              {
                expandSidebar && (
                  <motion.span
                    variants={spanVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    Categories
                  </motion.span>
                )
              }
            </AnimatePresence>

          </div>
        </Link>

        <Link className="link" to="/subcategories">
          <div className={`nav-item ${actualRoute === "subcategories" ? "selected" : ""}`}>
            <LoyaltyOutlinedIcon sx={{ width: "32px", height: "32px" }} />

            <AnimatePresence mode="wait">
              {
                expandSidebar && (
                  <motion.span
                    variants={spanVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    Subcategories
                  </motion.span>
                )
              }
            </AnimatePresence>

          </div>
        </Link>

        <Link className="link" to="/types">
          <div className={`nav-item ${actualRoute === "types" ? "selected" : ""}`}>
            <AccountTreeOutlinedIcon sx={{ width: "32px", height: "32px" }} />

            <AnimatePresence mode="wait">
              {
                expandSidebar && (
                  <motion.span
                    variants={spanVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    Types
                  </motion.span>
                )
              }
            </AnimatePresence>

          </div>
        </Link>

        <Link className="link" to="/banners">
          <div className={`nav-item ${actualRoute === "banners" ? "selected" : ""}`}>
            <PhotoOutlinedIcon sx={{ width: "32px", height: "32px" }} />

            <AnimatePresence mode="wait">
              {
                expandSidebar && (
                  <motion.span
                    variants={spanVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    Banners
                  </motion.span>
                )
              }
            </AnimatePresence>

          </div>
        </Link>
      </nav>

      <button onClick={toggleExpandSidebar}>
        {
          expandSidebar
            ? <ChevronLeftOutlinedIcon sx={{ width: "32px", height: "32px" }} />
            : <ChevronRightOutlinedIcon sx={{ width: "32px", height: "32px" }} />
        }
      </button>
    </div>
  )
}
