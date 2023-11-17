import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import slugify from 'slugify';
import useFetch from "../../hooks/useFetch";
import showIfImageExists from "../../utils/showIfImageExists";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AddSharpIcon from '@mui/icons-material/AddSharp';
import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import './Registering.scss';
import DescriptionPreviewer from '../../components/DescriptionPreviewer/DescriptionPreviewer';
import ImageWarning from "../../components/ImageWarning/ImageWarning";
import { Category } from "../../types/Category";
import { Subcategory } from "../../types/Subcategory";
import { Type } from "../../types/Type";

const quillModules = {
  toolbar: [
    [
      "bold",
      "italic",
      "underline"
    ],
    [
      "link",
      "image"
    ],
    [
      "clean"
    ]
  ]
}

export default function Registering() {
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError
  } = useFetch<Category>("/api/categories/")

  const {
    data: subcategories,
    loading: subcategoriesLoading,
    error: subcategoriesError
  } = useFetch<Subcategory>("/api/subcategories/")

  const {
    data: types,
    loading: typesLoading,
    error: typesError
  } = useFetch<Type>("/api/types/")

  const navigate = useNavigate()

  const [firstImage, setFirstImage] = useState("")
  const [secondImage, setSecondImage] = useState("")
  const [thirdImage, setThirdImage] = useState("")
  const [fourthImage, setFourthImage] = useState("")
  const [imageSelected, setImageSelected] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [currentPrice, setCurrentPrice] = useState("")
  const [oldPrice, setOldPrice] = useState("")
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [type, setType] = useState("")
  const [showDescriptionPreviewer, setShowDescriptionPreviewer] = useState(false)

  function notifyEmptyFields(emptyFields: string[]) {
    let fields: string = ""

    emptyFields.forEach((field, index) => {
      if (index === emptyFields.length - 1) fields += field
      else fields += `${field}, `
    })

    if (fields !== "") {
      toast.error(`Please, fill the fields: ${fields}`, {
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
    else {
      toast.error(`Please, fill all the fields!`, {
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
  }

  function notifyAtLeastOneImage() {
    toast.error('Please, insert at least one image.', {
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

  function notifyInvalidImage() {
    toast.error('Please, insert a valid image link.', {
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

  function setIfImageExists(
    value: string,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) {
    const exists = showIfImageExists(value)
    if (!exists) {
      setState("")
    }
    else {
      if (
        value !== firstImage &&
        value !== secondImage &&
        value !== thirdImage &&
        value !== fourthImage
      ) {
        setState(value)
      }
      else {
        setState("")
        notifyInvalidImage()
      }
    }
  }

  async function createProduct() {
    const imagesInserted = [
      firstImage,
      secondImage,
      thirdImage,
      fourthImage
    ]
    const newImages = imagesInserted.filter(image => image !== "")

    const fieldsNotFilled: string[] = []

    if (firstImage === "") fieldsNotFilled.push("First Image")
    if (name === "") fieldsNotFilled.push("Name")
    if (description === "") fieldsNotFilled.push("Description")
    if (currentPrice === "") fieldsNotFilled.push("Current Price")
    if (oldPrice === "") fieldsNotFilled.push("Old Price")
    if (category === "") fieldsNotFilled.push("Category")
    if (subcategory === "") fieldsNotFilled.push("Subcategory")
    if (type === "") fieldsNotFilled.push("Type")
    
    if (
      name === "" ||
      description === "" ||
      currentPrice === "" ||
      oldPrice === "" ||
      category === "" ||
      subcategory === "" ||
      type === ""
      ) {
      notifyEmptyFields(fieldsNotFilled)
      return
    }

    if (newImages.length === 0) return notifyAtLeastOneImage()

    const newProduct = {
      name,
      description,
      imagesUrls: newImages,
      currentPrice,
      oldPrice,
      categoryId: category,
      subcategoryId: subcategory,
      typeId: type,
      slug: slugify(name)
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_ADDRESS}/api/products/`, {
        method: "POST",
        body: JSON.stringify(newProduct),
        headers: { "Content-Type": "Application/json" }
      })
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.error)
      }
    }
    catch (error) {
      console.log(error)
    }

    navigate('/')
  }

  const filteredSubcategories = subcategories.filter(subcategory => subcategory.categoryId === category)

  return (
    <>
      <motion.div
        className="registering-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.24 } }}
        exit={{ opacity: 0, transition: { duration: 0.12 } }}
      >
        <div className="fields">
          <div className="image-fields">
            <div className="image-field first">
              <label htmlFor="first-image">
                <span>First Image: </span>
                <input
                  type="text"
                  id="first-image"
                  name="first-image"
                  onChange={(e) => setIfImageExists(e.target.value, setFirstImage)}
                  value={firstImage}
                />
              </label>
            </div>

            <div className="image-field second">
              <label htmlFor="second-image">
                <span>Second Image: </span>
                <input
                  type="text"
                  id="second-image"
                  name="second-image"
                  onChange={(e) => setIfImageExists(e.target.value, setSecondImage)}
                  value={secondImage}
                />
              </label>
            </div>

            <div className="image-field third">
              <label htmlFor="third-image">
                <span>Third Image: </span>
                <input
                  type="text"
                  id="third-image"
                  name="third-image"
                  onChange={(e) => setIfImageExists(e.target.value, setThirdImage)}
                  value={thirdImage}
                />
              </label>
            </div>

            <div className="image-field fourth">
              <label htmlFor="fourth-image">
                <span>Fourth Image: </span>
                <input
                  type="text"
                  id="fourth-image"
                  name="fourth-image"
                  onChange={(e) => setIfImageExists(e.target.value, setFourthImage)}
                  value={fourthImage}
                />
              </label>
            </div>

            <div className="images-previewer">
              <div className="images-selecteds">
                <div
                  className={`image-selected ${(!(firstImage === "") && (firstImage === imageSelected)) && "selected"}`}
                  onClick={() => setImageSelected(firstImage)}
                >
                  {
                    firstImage
                    ? <img src={firstImage} />
                    : <HideImageOutlinedIcon />
                  }
                </div>

                <div
                  className={`image-selected ${(!(secondImage === "") && (secondImage === imageSelected)) && "selected"}`}
                  onClick={() => setImageSelected(secondImage)}
                >
                  {
                    secondImage
                    ? <img src={secondImage} />
                    : <HideImageOutlinedIcon />
                  }
                </div>

                <div
                  className={`image-selected ${(!(thirdImage === "") && (thirdImage === imageSelected)) && "selected"}`}
                  onClick={() => setImageSelected(thirdImage)}
                >
                  {
                    thirdImage
                    ? <img src={thirdImage} />
                    : <HideImageOutlinedIcon />
                  }
                </div>

                <div
                  className={`image-selected ${(!(fourthImage === "") && (fourthImage === imageSelected)) && "selected"}`}
                  onClick={() => setImageSelected(fourthImage)}
                >
                  {
                    fourthImage
                    ? <img src={fourthImage} />
                    : <HideImageOutlinedIcon />
                  }
                </div>

              </div>

              <div className="previewer">
                <div className="image">
                  {
                    firstImage === ""
                    && secondImage === ""
                    && thirdImage === ""
                    && fourthImage === ""
                    ? <p>Insert the link of your images on the fields above.</p>
                    : (
                      imageSelected === ""
                      ? <ImageWarning />
                      : (
                        imageSelected !== firstImage
                        && imageSelected !== secondImage
                        && imageSelected !== thirdImage
                        && imageSelected !== fourthImage
                        ? <ImageWarning />
                        : <img src={imageSelected} />
                      )
                    )
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="product-fields">
            <label className="name" htmlFor="name">
              <span>Name: </span>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="description" htmlFor="description">
              <div className="top">
                <span>Description: </span>
                <VisibilityOutlinedIcon
                  className="description-previewer-icon"
                  sx={{ width: "24px", height: "24px" }}
                  cursor="pointer"
                  onClick={() => setShowDescriptionPreviewer(true)}
                />
              </div>
              <ReactQuill
                theme='snow'
                modules={quillModules}
                value={description}
                onChange={setDescription}
              />
            </label>

            <div className="prices">
              <label className="current-price" htmlFor="current-price">
                <span>Current Price: </span>
                <input
                  type="number"
                  id="current-price"
                  name="current-price"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                />
              </label>

              <label className="old-price" htmlFor="old-price">
                <span>Old Price: </span>
                <input
                  type="number"
                  id="old-price"
                  name="old-price"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                />
              </label>
            </div>

            <div className="categoric-row">
              <label className="category" htmlFor="category">
                <span>Category: </span>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a Category</option>
                  {
                    categories.map(category => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    ))
                  }
                </select>
              </label>

              <label className="subcategory" htmlFor="subcategory">
                <span>Subcategory: </span>
                <select
                  id="subcategory"
                  name="subcategory"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                >
                  <option value="">Select a Subcategory</option>
                  {
                    filteredSubcategories.map(subcategory => (
                      <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
                    ))
                  }
                </select>
              </label>
            </div>

            <label className="type" htmlFor="type">
              <span>Type: </span>
              <select
                id="type"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Select a Type</option>
                {
                  types.map(type => (
                    <option key={type._id} value={type._id}>{type.name}</option>
                  ))
                }
              </select>
            </label>
          </div>
        </div>
        <div className="buttons">
          <Link to="/" className="cancel-button">
            Cancel
          </Link>

          <button className="addProduct-button" onClick={createProduct}>
            <AddSharpIcon sx={{ width: '32px', height: '32px' }} />
            Add Product
          </button>
        </div>
      </motion.div>

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

      <AnimatePresence mode="wait">
        {
          showDescriptionPreviewer && (
            <DescriptionPreviewer
              text={description}
              setShowDescriptionPreviewer={setShowDescriptionPreviewer}
            />
          )
        }
      </AnimatePresence>
    </>
  )
}