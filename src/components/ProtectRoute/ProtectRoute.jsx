import { Navigate } from 'react-router-dom';
import RoutePath from '../../constants/route';

const ProtectRoute = ({ isAuth, redirect = RoutePath.login, children }) => {
  return isAuth ? children : <Navigate to={redirect} />;
};

export default ProtectRoute;
