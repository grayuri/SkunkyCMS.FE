import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import useFetch from '../../hooks/useFetch';
import useDatabasePayload from '../../hooks/useDatabasePayload';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import './ListedType.scss';
import UpdateTypePanel from '../UpdateTypePanel/UpdateTypePanel';
import { Type } from '../../types/Type';
import { Product } from '../../types/Product';
import Loader from '../Loader/Loader';

type Props = {
  type: Type,
  setTypesLoading: (newState: boolean) => void
}

function ListedType(props: Props) {
  const { type, setTypesLoading } = props
  const { deleteTypePayload } = useDatabasePayload()

  const {
    data: products,
    loading: productsLoading,
    error: productsError
  } = useFetch<Product>("/api/products/")

  const [showUpdateTypePanel, setShowUpdateTypePanel] = useState(false)

  async function deleteType () {
    try {
      const response = await fetch(`${import.meta.env.VITE_ADDRESS}/api/types/${type._id}`, {
        method: "DELETE"
      })
      const json = await response.json()

      if (!response.ok) throw Error(json.error)
      else {
        deleteTypePayload(json)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const filteredProducts = products.filter(product => product.typeId === type._id)

  return (  
    <>
      <div className="listed-type">
        <div className="listed-type-top">
          <h1>{type.name}</h1>

          <div className="buttons">
            <button className="update-button" onClick={() => setShowUpdateTypePanel(true)}>
              <EditIcon sx={{ width: "24px", height: "24px" }} />
            </button>

            <button className="delete-button" onClick={deleteType}>
              <DeleteIcon sx={{ width: "24px", height: "24px" }} />
            </button>
          </div>
        </div>
        <ul className="products-list">
          {
            productsError
            ? "Error"
            : (
              productsLoading
              ? <Loader size={64} />
              : (
                filteredProducts.map(product => (
                  <li key={product._id}>{product.name}</li>
                ))
              )
            )
          }
        </ul>
      </div>
      
      <AnimatePresence mode="wait">
        {
          showUpdateTypePanel && (
            <UpdateTypePanel 
              setShowUpdateTypePanel={setShowUpdateTypePanel}
              type={type}
              setTypesLoading={setTypesLoading}
            />
          )
        }
      </AnimatePresence>
    </>
  );
}

export default ListedType;