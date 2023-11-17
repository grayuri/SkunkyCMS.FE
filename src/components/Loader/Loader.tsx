import { ClipLoader } from 'react-spinners';

import './Loader.scss';


type Props = {
  size: number;
}

function Loader(props: Props) {
  const { size } = props

  return (  
    <div className="loader">
      <ClipLoader 
        size={size ? size : 32}
        color="#610055"
      />
    </div>
  );
}

export default Loader;