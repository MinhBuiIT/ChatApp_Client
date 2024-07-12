import { Navigate } from 'react-router-dom';
import RoutePath from '../../constants/route';

const AdminBanRoute = ({ children, isAdmin }) => {
  return !isAdmin ? children : <Navigate to={RoutePath.adminDashboard} />;
};

export default AdminBanRoute;
