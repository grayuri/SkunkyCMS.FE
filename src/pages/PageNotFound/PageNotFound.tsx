import { Link } from 'react-router-dom';

import './PageNotFound.scss';

function PageNotFound() {
  return (  
    <div className="page-404">
      <img src="/images/404-warning.svg" alt="404 Warning" />
      <h1>404: Page Not Found</h1>
      <p>This page, unfortunatly, doesn't exists. Please, go back to the <Link to="/">homepage</Link>.</p>
    </div>
  );
}

export default PageNotFound;