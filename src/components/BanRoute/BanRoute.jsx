import { Navigate } from 'react-router-dom';
import RoutePath from '../../constants/route';

const BanRoute = ({ isAuth, redirect = RoutePath.home, children }) => {
  return !isAuth ? children : <Navigate to={redirect} />;
};

export default BanRoute;
