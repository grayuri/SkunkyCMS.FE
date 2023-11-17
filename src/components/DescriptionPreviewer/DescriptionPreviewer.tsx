import { motion } from 'framer-motion';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import './DescriptionPreviewer.scss';

type Props = {
  setShowDescriptionPreviewer:  React.Dispatch<React.SetStateAction<boolean>>,
  text: string
}

function DescriptionPreviewer(props: Props) {
  const { text, setShowDescriptionPreviewer } = props

  const settingTextInHTML = () => {
    return { __html: text }
  }

  return (
    <motion.div 
      className="description-previewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.48, ease: [0.65, 0, 0.35, 1]} }}
      exit={{ opacity: 0, transition: { duration: 0.48, ease: [0.65, 0, 0.35, 1]} }}
    >
      <div className="dark-layer" onClick={() => setShowDescriptionPreviewer(false)}/>
      
      <motion.main
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
      >
        <div className="top">
          <h1>Description Previewer</h1>
          <CloseOutlinedIcon
            className="close-icon"
            cursor="pointer"
            onClick={() => setShowDescriptionPreviewer(false)}
            sx={{ width: '32px', height: '32px' }}
          />
        </div>

        <div
          className='description-text'
          dangerouslySetInnerHTML={settingTextInHTML()}
        />
      </motion.main>
    </motion.div>
  );
}

export default DescriptionPreviewer;