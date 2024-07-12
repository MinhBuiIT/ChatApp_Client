import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Avatar, Backdrop, Badge, Box, CircularProgress, Drawer, Stack, Tooltip } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logoutApi } from '../../apis/auth.js';
import ChatList from '../../components/ChatList/ChatList.jsx';
import Info from '../../components/Info/Info.jsx';
import Modal from '../../components/Modal';
import Styling from '../../components/Styling';
import COLOR from '../../constants/color';
import RoutePath from '../../constants/route';
import emitConstants from '../../constants/socketEvent.js';
import { userNotExist } from '../../redux/Auth/authSlice';
import { handleResetNotification } from '../../redux/Chat/chatSlice.js';
import {
  handleIsOpenAddGroup,
  handleNotificationModal,
  handleProfileModal,
  handleSearchModal,
  hanldeChatListModal
} from '../../redux/Modal/modalSlice.js';
import { getSocketContext } from '../../socket.jsx';

const Search = lazy(() => import('../../components/Search'));
const Notification = lazy(() => import('../../components/Notification'));
const AddGroup = lazy(() => import('../../components/AddGroup'));
const { IconButtonHeader } = Styling;
const SlideBar = () => {
  const { notification_count } = useSelector((state) => state.chat);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isChatListModal, isProfileModal, isSearchModal, isNotificationModal, isOpenAddGroup } = useSelector(
    (state) => state.modal
  );
  const { user } = useSelector((state) => state.auth);

  const socket = getSocketContext();

  const mutationLogout = useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: (res) => {
      socket.emit(emitConstants.LOGOUT, { userId: user._id });
      toast.success(res?.data?.message);
      dispatch(userNotExist());
      navigate(RoutePath.login);
    },
    onError: () => {
      toast.error('Something went wrong');
    }
  });
  const openChatList = () => {
    dispatch(hanldeChatListModal(true));
  };
  const openProfile = () => {
    dispatch(handleProfileModal(true));
  };

  const openSearch = () => {
    dispatch(handleSearchModal(!isSearchModal));
  };
  const openAddGroup = () => {
    dispatch(handleIsOpenAddGroup(!isOpenAddGroup));
  };
  const openManageGroup = () => {
    navigate(RoutePath.group);
  };
  const openNotification = () => {
    dispatch(handleNotificationModal(!isNotificationModal));
    dispatch(handleResetNotification());
  };

  const openLogout = () => {
    mutationLogout.mutate();
  };
  return (
    <>
      <Box
        width={'45px'}
        height={'45px'}
        sx={{
          border: `3px solid ${COLOR.PINK}`,
          borderRadius: '50%',
          margin: { md: '10px auto', xs: 'auto 0px' },
          display: { xs: 'none', md: 'block' }
        }}
      >
        <Avatar src={user.avatar.url} sx={{ width: '100%', height: '100%' }} />
      </Box>
      <Drawer
        PaperProps={{
          sx: { width: '70vw' }
        }}
        open={isChatListModal}
        onClose={() => dispatch(hanldeChatListModal(false))}
      >
        <ChatList />
      </Drawer>
      <Box width={'45px'} height={'45px'} mt={'2px'} sx={{ display: { sx: 'block', md: 'none' } }}>
        <IconButtonHeader onClick={openChatList}>
          <Tooltip title="Chat List">
            <MenuOutlinedIcon style={{ color: '#fff' }} />
          </Tooltip>
        </IconButtonHeader>
      </Box>
      <Stack
        sx={{ flexGrow: 1, marginTop: { xs: '0px', md: '50px' } }}
        direction={{ xs: 'row', md: 'column' }}
        justifyContent="center"
        alignItems="center"
        spacing={{ xs: 2, sm: 3 }}
      >
        <IconButtonHeader onClick={openSearch}>
          <Tooltip title="Search">
            <SearchOutlinedIcon style={{ color: '#fff' }} />
          </Tooltip>
        </IconButtonHeader>
        <IconButtonHeader onClick={openAddGroup}>
          <Tooltip title="Add Group">
            <AddOutlinedIcon style={{ color: '#fff' }} />
          </Tooltip>
        </IconButtonHeader>
        <IconButtonHeader onClick={openManageGroup}>
          <Tooltip title="Manage Group">
            <PeopleOutlineOutlinedIcon style={{ color: '#fff' }} />
          </Tooltip>
        </IconButtonHeader>
        <IconButtonHeader onClick={openNotification}>
          <Tooltip title="Notification">
            <Badge
              badgeContent={notification_count > 0 ? notification_count : null}
              sx={{ '& .MuiBadge-badge': { background: COLOR.PINK, color: 'white' } }}
            >
              <NotificationsNoneOutlinedIcon style={{ color: '#fff' }} />
            </Badge>
          </Tooltip>
        </IconButtonHeader>
        <IconButtonHeader onClick={openLogout}>
          <Tooltip title="Logout">
            <LogoutOutlinedIcon style={{ color: '#fff' }} />
          </Tooltip>
        </IconButtonHeader>
      </Stack>
      <Box
        width={'45px'}
        height={'45px'}
        sx={{
          border: `3px solid ${COLOR.PINK}`,
          borderRadius: '50%',
          margin: { md: '10px auto', xs: 'auto 0px' },
          display: { xs: 'block', md: 'none' }
        }}
        onClick={openProfile}
      >
        <Avatar src={user.avatar.url} sx={{ width: '100%', height: '100%' }} />
      </Box>

      <Drawer
        PaperProps={{
          sx: { width: '60vw' }
        }}
        anchor="right"
        open={isProfileModal}
        onClose={() => dispatch(handleProfileModal(false))}
      >
        <Info />
      </Drawer>

      {isSearchModal &&
        createPortal(
          <Suspense
            fallback={
              <Backdrop open={true}>
                <CircularProgress color="inherit" />
              </Backdrop>
            }
          >
            <Modal open={isSearchModal} handleClose={openSearch} width={'400px'}>
              <Search></Search>
            </Modal>
          </Suspense>,
          document.body
        )}
      {isOpenAddGroup &&
        createPortal(
          <Suspense
            fallback={
              <Backdrop open={true}>
                <CircularProgress color="inherit" />
              </Backdrop>
            }
          >
            <Modal open={isOpenAddGroup} handleClose={openAddGroup} width={'420px'}>
              <AddGroup handleClose={openAddGroup}></AddGroup>
            </Modal>
          </Suspense>,
          document.body
        )}
      {isNotificationModal &&
        createPortal(
          <Suspense
            fallback={
              <Backdrop open={true}>
                <CircularProgress color="inherit" />
              </Backdrop>
            }
          >
            <Modal open={isNotificationModal} handleClose={openNotification} sx={{ width: '500px' }}>
              <Notification></Notification>
            </Modal>
          </Suspense>,
          document.body
        )}
    </>
  );
};

export default SlideBar;
