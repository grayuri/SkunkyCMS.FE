import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import useDatabasePayload from '../../hooks/useDatabasePayload';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import './ListedSubcategory.scss';
import UpdateSubcategoryPanel from '../UpdateSubcategoryPanel/UpdateSubcategoryPanel';
import { Subcategory } from '../../types/Subcategory';

type Props = {
  subcategory: Subcategory,
  setCategoriesLoading: React.Dispatch<React.SetStateAction<boolean>>
}

function ListedSubcategory(props: Props) {
  const { subcategory, setCategoriesLoading } = props
  const { deleteSubcategoryPayload } = useDatabasePayload()

  const [showUpdateSubcategoryPanel, setShowUpdateSubcategoryPanel] = useState(false)

  async function deleteSubcategory () {
    try {
      const response = await fetch(`${import.meta.env.VITE_ADDRESS}/api/subcategories/${subcategory._id}`, {
        method: "DELETE"
      })
      const json = await response.json()
      
      if (!response.ok) throw Error(json.error)
      else {
        deleteSubcategoryPayload(json)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  return (  
    <>
      <div className="listed-subcategory">
        <span>{subcategory.name}</span>

        <div className="buttons">
          <button className="update-button" onClick={() => setShowUpdateSubcategoryPanel(true)}>
            <EditIcon sx={{width: "22px", height: "22px"}} />
          </button>

          <button className="delete-button" onClick={deleteSubcategory}>
            <DeleteIcon sx={{width: "22px", height: "22px"}} />
          </button>
        </div>

      </div>
      
      <AnimatePresence mode="wait">
        {
          showUpdateSubcategoryPanel && (
            <UpdateSubcategoryPanel 
              setShowUpdateSubcategoryPanel={setShowUpdateSubcategoryPanel} 
              subcategory={subcategory}
              setCategoriesLoading={setCategoriesLoading}
            />
          )
        }
      </AnimatePresence>
    </>
  );
}

export default ListedSubcategory;