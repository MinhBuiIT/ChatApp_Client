import { Navigate } from 'react-router-dom';
import RoutePath from '../../constants/route';

const AdminProtectRoute = ({ children, isAdmin }) => {
  return isAdmin ? children : <Navigate to={RoutePath.adminLogin} />;
};

export default AdminProtectRoute;
