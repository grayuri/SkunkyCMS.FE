import { useEffect } from "react";
import { motion } from "framer-motion";
import useFetch from "../../hooks/useFetch";
import useDatabaseContext from "../../hooks/useDatabaseContext";

import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';

import './Banners.scss';
import ListedBanner from "../../components/ListedBanner/ListedBanner";
import { Banner } from "../../types/Banner";
import Loader from "../../components/Loader/Loader";

export default function Banners() {
  const { banners, setBanners } = useDatabaseContext()

  const {
    data: bannersData,
    loading: bannersLoading,
    setLoading: setBannersLoading,
    error: bannersError
  } = useFetch<Banner>("/api/banners/")

  useEffect(() => {
    setBanners(bannersData)
  },[bannersData])

  return (
    <motion.div
      className="banners-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.24 } }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
    >
      <div className="top">
        <PhotoOutlinedIcon sx={{ width: "72px", height: "auto" }} />
        <h1>Banners</h1>
      </div>

      <main className={`bottom ${bannersLoading ? "loading" : ""}`}>
        {
          bannersError
          ? "Error"
          : (
            bannersLoading
            ? <Loader size={64} />
            : (
              banners.map(banner => (
                <ListedBanner 
                  key={banner._id} 
                  banner={banner} 
                  setBannersLoading={setBannersLoading}
                />
              ))
            )
          )
        }
      </main>
    </motion.div>
  )
}
