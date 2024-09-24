import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404: Page Not Found</h1>
      <h3>
        Sorry, the page you are looking for does not exist. 
        Go back to the <Link to="/">Home Page</Link>.
      </h3>
    </div>
  );
};

export default PageNotFound;
