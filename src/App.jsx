import { useQuery } from '@tanstack/react-query';
import lodash from 'lodash';
import { Suspense, lazy, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { checkLoginAdminApi } from './apis/admin';
import { getProfileApi } from './apis/user';
import AdminBanRoute from './components/AdminBanRoute';
import AdminProtectRoute from './components/AdminProtectRoute';
import BanRoute from './components/BanRoute';
import Loading from './components/Loading';
import ProtectRoute from './components/ProtectRoute';
import RoutePath from './constants/route';
import Dashboard from './pages/Admin/Dashboard';
import GroupManage from './pages/Admin/GroupManage';
import MessageManage from './pages/Admin/MessageManage';
import UserManage from './pages/Admin/UserManage';
import { adminExist, adminNotExist, userExist, userNotExist } from './redux/Auth/authSlice';
import SocketContextComponent from './socket';

const Home = lazy(() => import('./pages/Home'));
const Chat = lazy(() => import('./pages/Chat'));
const Login = lazy(() => import('./pages/Login'));
const MangeGroup = lazy(() => import('./pages/ManageGroup'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'));
const Layout = lazy(() => import('./pages/Admin/Layout'));

function App() {
  const queryProfile = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfileApi()
  });
  const checkAdminQuery = useQuery({
    queryKey: ['checkAdmin'],
    queryFn: () => checkLoginAdminApi()
  });
  const dispatch = useDispatch();
  const { user, isAdmin } = useSelector((state) => state.auth);
  const isAuth = !!user;
  useEffect(() => {
    if (queryProfile.data?.status === 200 && queryProfile.data.data?.result) {
      const result = queryProfile.data?.data?.result;
      dispatch(userExist({ user: lodash.omit(result, ['password', '__v']) }));
    }
    if (queryProfile.error) {
      dispatch(userNotExist());
    }
  }, [queryProfile.data, dispatch, queryProfile.error]);
  useEffect(() => {
    if (checkAdminQuery.data?.status === 200) {
      dispatch(adminExist());
    } else {
      dispatch(adminNotExist());
    }
  }, [checkAdminQuery.data, dispatch]);
  // useEffect(() => {
  //   axios
  //     .get('/api/v1/user/profile', {
  //       baseURL: 'http://localhost:3000',
  //       withCredentials: true
  //     })
  //     .then((res) => {
  //       console.log('Res::', res);
  //     })
  //     .catch((err) => {
  //       console.log('Err::', err);
  //     });
  // }, []);
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route
            path={RoutePath.login}
            element={
              <BanRoute isAuth={isAuth}>
                <Login />
              </BanRoute>
            }
          ></Route>
          <Route
            path={RoutePath.home}
            element={
              <SocketContextComponent>
                <ProtectRoute isAuth={isAuth}>
                  <Home />
                </ProtectRoute>
              </SocketContextComponent>
            }
          ></Route>
          <Route
            path={RoutePath.chatId}
            element={
              <SocketContextComponent>
                <ProtectRoute isAuth={isAuth}>
                  <Chat />
                </ProtectRoute>
              </SocketContextComponent>
            }
          ></Route>

          <Route
            path={RoutePath.group}
            element={
              <SocketContextComponent>
                <ProtectRoute isAuth={isAuth}>
                  <MangeGroup />
                </ProtectRoute>
              </SocketContextComponent>
            }
          ></Route>
          <Route
            path={RoutePath.adminLogin}
            element={
              <AdminBanRoute isAdmin={isAdmin}>
                <AdminLogin />
              </AdminBanRoute>
            }
          ></Route>
          <Route
            path="/admin"
            element={
              <AdminProtectRoute isAdmin={isAdmin}>
                <Layout />
              </AdminProtectRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path={'dashboard'} element={<Dashboard />}></Route>
            <Route path={'user'} element={<UserManage />}></Route>
            <Route path={'group'} element={<GroupManage />}></Route>
            <Route path={'message'} element={<MessageManage />}></Route>
          </Route>
          <Route path={'*'} element={<NotFound />}></Route>
        </Routes>
      </Suspense>
      <ToastContainer autoClose={2500} pauseOnHover={false} />
    </BrowserRouter>
  );
}

export default App;
