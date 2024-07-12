import MenuOutlined from '@mui/icons-material/MenuOutlined';
import { Box, Drawer, Grid, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ListMenuSideBar from '../../components/Admin/ListMenuSideBar';

const Layout = () => {
  const [openMenuMobile, setOpenMenuMobile] = useState(false);
  const location = useLocation();

  return (
    <Grid container width={'100%'} height={'100vh'} sx={{ padding: '0' }}>
      <Grid item md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
        <Box sx={{ paddingTop: '1.5rem', width: '100%', borderRight: '1px solid #e5e5e5', height: '100%' }}>
          <Typography variant="h5" sx={{ paddingLeft: '1.5rem' }}>
            Admin Chat
          </Typography>
          <ListMenuSideBar locationPath={location.pathname} />
        </Box>
      </Grid>
      <Grid item md={9} xs={12}>
        <IconButton
          sx={{ display: { xs: 'flex', md: 'none' }, position: 'fixed', right: '16px', top: '5px' }}
          onClick={() => setOpenMenuMobile(true)}
        >
          <MenuOutlined />
        </IconButton>
        <Drawer open={openMenuMobile} onClose={() => setOpenMenuMobile(false)}>
          <ListMenuSideBar locationPath={location.pathname} handleClose={() => setOpenMenuMobile(false)} />
        </Drawer>
        <Outlet />
      </Grid>
    </Grid>
  );
};

export default Layout;
