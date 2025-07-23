import { useAdminAuth } from '../../app/useAdminAuth';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const RequireAdminAuth = ({ children }) => {
  const { token } = useAdminAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
};

RequireAdminAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireAdminAuth; 