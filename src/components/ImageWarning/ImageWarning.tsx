import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';

import './ImageWarning.scss';

function ImageWarning() {
  return (  
    <div className="image-warning">
      <HideImageOutlinedIcon sx={{width: "32px", height: "32px"}} />
      <p>You didn't select an image yet.</p>
    </div>
  );
}

export default ImageWarning;