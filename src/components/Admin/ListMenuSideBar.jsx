import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Groups3OutlinedIcon from '@mui/icons-material/Groups3Outlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import { Box, List, ListItem, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logoutAdminApi } from '../../apis/admin';
import { adminNotExist } from '../../redux/Auth/authSlice';
import Styling from '../Styling';

const linkData = [
  {
    path: 'dashboard',
    icon: <DashboardOutlinedIcon />,
    name: 'Dashboard'
  },
  {
    path: 'user',
    icon: <AdminPanelSettingsOutlinedIcon />,
    name: 'User'
  },
  {
    path: 'group',
    icon: <Groups3OutlinedIcon />,
    name: 'Group'
  },
  {
    path: 'message',
    icon: <MessageOutlinedIcon />,
    name: 'Message'
  },
  {
    path: 'logout',
    icon: <LogoutOutlinedIcon />,
    name: 'Logout'
  }
];
const { StyledLink } = Styling;
const ListMenuSideBar = ({ locationPath, handleClose }) => {
  const dispatch = useDispatch();
  const logoutMutation = useMutation({
    mutationFn: () => logoutAdminApi(),
    onSuccess: (res) => {
      toast.success(res.data?.message);
      dispatch(adminNotExist());
    },
    onError: (err) => {
      toast.error(err.response.data?.message || 'Something went wrong');
    }
  });
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  return (
    <List sx={{ marginTop: '24px' }} style={{ width: '100%' }}>
      {linkData.map((item) => {
        const pathConfig = locationPath.split('/');
        let path = pathConfig[pathConfig.length - 1];
        if (path === 'admin') path = 'dashboard';
        const matched = path === item.path;
        const styleMatch = matched
          ? { background: 'rgba(0,0,0,1)', color: 'white' }
          : { background: 'none', color: 'black' };
        const isLogout = item.path === 'logout';
        return (
          <ListItem sx={{ width: '100%', padding: 0, margin: 0 }} key={item.path}>
            {!isLogout ? (
              <StyledLink
                onClick={() => handleClose && handleClose()}
                to={item.path}
                sx={{
                  width: '100%',
                  padding: '20px 50px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '16px',
                  zIndex: 1,
                  ...styleMatch,
                  '&:hover': {
                    background: `${!matched ? 'rgba(0,0,0,0.1)' : '#000'} `,
                    color: `${!matched ? '#000' : 'white'}`
                  }
                }}
              >
                {item.icon}
                <Typography>{item.name}</Typography>
              </StyledLink>
            ) : (
              <Box
                onClick={handleLogout}
                sx={{
                  width: '100%',
                  padding: '20px 50px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  zIndex: 1,
                  ...styleMatch,
                  '&:hover': {
                    background: `${!matched ? 'rgba(0,0,0,0.1)' : '#000'} `,
                    color: `${!matched ? '#000' : 'white'}`
                  }
                }}
              >
                {item.icon}
                <Typography>{item.name}</Typography>
              </Box>
            )}
          </ListItem>
        );
      })}
    </List>
  );
};

export default ListMenuSideBar;
