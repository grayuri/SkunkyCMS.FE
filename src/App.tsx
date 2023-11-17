import { useState } from "react"
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

import './App.scss';
import Sidebar from './components/Sidebar/Sidebar';
import Banners from "./pages/Banners/Banners";
import Categories from "./pages/Categories/Categories";
import Editing from "./pages/Editing/Editing";
import Home from "./pages/Home/Home";
import Registering from "./pages/Registering/Registering";
import Subcategories from "./pages/Subcategories/Subcategories";
import Types from "./pages/TypesPage/Types";
import PageNotFound from "./pages/PageNotFound/PageNotFound";

export default function App() {
  const [expandSidebar, setExpandSidebar] = useState<boolean>(true)
  const location = useLocation()

  return (
    <div className='app'>
      <Sidebar expandSidebar={expandSidebar} setExpandSidebar={setExpandSidebar} />

      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          <Route
            index
            element={<Home />}
          />

          <Route
            path="/registering"
            element={<Registering />}
          />

          <Route
            path="/editing/:slug"
            element={<Editing />}
          />

          <Route
            path="/categories"
            element={<Categories />}
          />

          <Route
            path="/subcategories"
            element={<Subcategories />}
          />

          <Route
            path="/types"
            element={<Types />}
          />

          <Route
            path="/banners"
            element={<Banners />}
          />

          <Route
            path="*"
            element={<PageNotFound />}
          />
        </Routes>
      </AnimatePresence>
    </div>
  )
}
