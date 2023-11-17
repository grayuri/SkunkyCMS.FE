import { Link } from 'react-router-dom';
import useFetchSingle from '../../hooks/useFetchSingle';
import useDatabaseContext from '../../hooks/useDatabaseContext';

import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';

import './ListedProduct.scss';

import Currency from '../../utils/Currency';
import { Product } from '../../types/Product';
import { Category } from '../../types/Category';
import { Subcategory } from '../../types/Subcategory';
import { Type } from '../../types/Type';

type Props = {
  product: Product,
  setProductsData: (newState: Product[]) => void
}

function ListedProduct(props: Props) {
  const { product, setProductsData } = props
  const { products, setProducts } = useDatabaseContext()

  const { data: category } = useFetchSingle<Category>(`/api/categories/${product.categoryId}`)

  const { data: subcategory } = useFetchSingle<Subcategory>(`/api/subcategories/${product.subcategoryId}`)

  const { data: type } = useFetchSingle<Type>(`/api/types/${product.typeId}`)

  async function deleteProduct() {
    try {
      const response = await fetch(`${import.meta.env.VITE_ADDRESS}/api/products/${product._id}`, {
        method: "DELETE"
      })
      const json = await response.json()
      
      if (!response.ok) throw new Error(json.error)
      else {
        const allProductsExceptDeleted = products.filter(singleProduct => singleProduct._id !== product._id)
        setProductsData(allProductsExceptDeleted)
        setProducts(allProductsExceptDeleted)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  return (  
    <tr className="listed-product">
      <td className="title">{product.name.toLowerCase()}</td>
      <td className="price">{Currency.format(product.currentPrice)}</td>
      <td className="category">{category === undefined ? "Deleted" : category.name}</td>
      <td className="subcategory">{subcategory === undefined ? "Deleted" : subcategory.name}</td>
      <td className="type">{ type === undefined ? "Deleted" : type.name }</td>
      <td className="operations">
        <Link className='link' to={`/editing/${product._id}`}>
          <div className="editProduct-operation">
            <CreateOutlinedIcon
              cursor="pointer"
            />
          </div>
        </Link>

        <div className="removeProduct-operation" onClick={deleteProduct}>
          <DeleteOutlineOutlinedIcon
            cursor="pointer"
          />
        </div>
      </td>
    </tr>
  );
}

export default ListedProduct;