import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import EditIcon from '@mui/icons-material/Edit';

import './ListedBanner.scss';
import UpdateBannerPanel from '../UpdateBannerPanel/UpdateBannerPanel';
import ImageWarning from '../ImageWarning/ImageWarning';
import { Banner } from '../../types/Banner';

type Props = {
  banner: Banner,
  setBannersLoading: (newState: boolean) => void
}

function ListedBanner(props: Props) {
  const { banner, setBannersLoading } = props
  
  const [showUpdateBannerPanel, setShowUpdateBannerPanel] = useState(false)

  return (  
    <>
      <div className="listed-banner">
        <div className="listed-banner-top">
          <h1 className="name">{banner.name}</h1>
          <button className="update-button" onClick={() => setShowUpdateBannerPanel(true)}>
            <EditIcon />
          </button>
        </div>

        <div className="image">
          {
            banner.imageUrl
            ? <img src={banner.imageUrl} alt={`${banner.name} banner`} />
            : <ImageWarning />
          }
        </div>
      </div>

      <AnimatePresence mode="wait">
        {
          showUpdateBannerPanel && (
            <UpdateBannerPanel 
              setShowUpdateBannerPanel={setShowUpdateBannerPanel}
              banner={banner}
              setBannersLoading={setBannersLoading}
            />
          )
        }
      </AnimatePresence>
    </>
  );
}

export default ListedBanner;