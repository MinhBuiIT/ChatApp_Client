/* eslint-disable react-hooks/rules-of-hooks */
import { Grid } from '@mui/material';
import { grey } from '@mui/material/colors';
import ChatList from '../../components/ChatList';
import Info from '../../components/Info/Info';

import { useDispatch } from 'react-redux';
import emitConstants from '../../constants/socketEvent';
import useListenEmitSocket from '../../hooks/useListenEmitSocket';
import { handleIncrementNotification } from '../../redux/Chat/chatSlice';
import { getSocketContext } from '../../socket';
import SlideBar from '../SlideBar';

const AppLayout = () => (ComponetChild) => {
  return (props) => {
    const dispatch = useDispatch();
    const handleNotificationSocket = (data) => {
      console.log(data);
      dispatch(handleIncrementNotification());
    };
    const socket = getSocketContext();
    const eventSocket = { [emitConstants.ALERT]: handleNotificationSocket };
    useListenEmitSocket(socket, eventSocket);
    return (
      <Grid container height={'100vh'}>
        <Grid
          item
          md={1}
          lg={0.5}
          bgcolor={'black'}
          sx={{
            display: {
              xs: 'flex',
              md: 'block'
            },
            position: {
              xs: 'absolute',
              md: 'static'
            },
            bottom: {
              xs: '0'
            },
            left: {
              xs: '0'
            },
            right: {
              xs: '0'
            },
            height: {
              xs: '3rem',
              md: '100%'
            }
          }}
        >
          <SlideBar />
        </Grid>
        <Grid
          item
          md={3}
          lg={3}
          sx={{
            display: { xs: 'none', md: 'block' },
            height: { xs: 'calc(100% - 3rem)', md: '100%' },
            borderRight: `1px solid ${grey[300]}`
          }}
        >
          <ChatList />
        </Grid>
        <Grid item xs={12} sm={12} md={8} lg={5.5} sx={{ height: { xs: 'calc(100% - 3rem)', md: '100%' } }}>
          <ComponetChild {...props} />
        </Grid>

        <Grid
          item
          lg={3}
          sx={{ display: { xs: 'none', lg: 'block' }, height: { xs: 'calc(100% - 3rem)', md: '100%' } }}
        >
          <Info />
        </Grid>
      </Grid>
    );
  };
};

export default AppLayout;
