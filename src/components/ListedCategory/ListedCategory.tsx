import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import useDatabaseContext from "../../hooks/useDatabaseContext";
import useDatabasePayload from "../../hooks/useDatabasePayload";

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import './ListedCategory.scss';
import UpdateCategoryPanel from "../UpdateCategoryPanel/UpdateCategoryPanel";
import { Category } from '../../types/Category';

type Props = {
  category: Category,
  setCategoriesData: (newState: Category[]) => void,
  setCategoriesLoading: (newState: boolean) => void
}

function ListedCategory(props: Props) {
  const { category, setCategoriesData, setCategoriesLoading } = props
  const { categories, setCategories } = useDatabaseContext()
  const { deleteCategoryPayload } = useDatabasePayload()

  const [showUpdateCategoryPanel, setShowUpdateCategoryPanel] = useState(false)

  async function deleteCategory () {
    try {
      const response = await fetch(`${import.meta.env.VITE_ADDRESS}/api/categories/${category._id}`, {
        method: "DELETE"
      })
      const json = await response.json()
      
      if (!response.ok) throw new Error(json.error)
      else {
        deleteCategoryPayload(json)
      }
    } 
    catch (error) {
      console.log(error)
    }
  }

  return (  
    <>
      <div className='listed-category'>
        <div className="content">
          <div className="image">
            <img src={category.imageUrl} alt="" />
          </div>
          <h2>{category.name}</h2>
        </div>
        <div className="buttons">
          <button className="update-button" onClick={() => setShowUpdateCategoryPanel(true)}>
            <EditIcon sx={{width: "22px", height: "22px"}} />
          </button>

          <button className="delete-button" onClick={deleteCategory}>
            <DeleteIcon sx={{width: "22px", height: "22px"}}/>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {
          showUpdateCategoryPanel && (
            <UpdateCategoryPanel 
              setShowUpdateCategoryPanel={setShowUpdateCategoryPanel} 
              category={category}
              setCategoriesLoading={setCategoriesLoading}
            />
          )
        }
      </AnimatePresence>
    </>
  );
}

export default ListedCategory;