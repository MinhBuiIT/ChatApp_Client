import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { Box, Drawer, Grid, IconButton, List, ListItem, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getMyGroupApi } from '../apis/chat';
import GroupItem from '../components/GroupItem';
import MangeGroupDetail from '../components/ManageGroupDetail';
import COLOR from '../constants/color';
import RoutePath from '../constants/route';
import emitConstants from '../constants/socketEvent';
import useListenEmitSocket from '../hooks/useListenEmitSocket';
import useSearchParamObj from '../hooks/useSearchParamObj';
import { handleNewMessageAlert } from '../redux/Chat/chatSlice';
import { getSocketContext } from '../socket';

const ManageGroup = () => {
  const dispatch = useDispatch();
  const obj = useSearchParamObj();
  const id = obj.g;
  const navigate = useNavigate();
  const [isOpenMenuMobile, setIsOpenMenuMobile] = useState(false);

  //Query
  const myGroupQuery = useQuery({
    queryKey: ['myGroup'],
    queryFn: () => getMyGroupApi()
  });
  const myGroupData = myGroupQuery.data?.data?.result || [];
  //End Query

  const handleAlertMessage = (data) => {
    //xử lý khi đang ở trong chat thì không hiển thị alert khi có tin nhắn mới
    dispatch(handleNewMessageAlert(data));
  };

  const socket = getSocketContext();
  const eventSocket = {
    [emitConstants.ALERT_MESSAGE]: handleAlertMessage
  };
  useListenEmitSocket(socket, eventSocket);

  const hanldeToggleMenuMobile = () => {
    setIsOpenMenuMobile((pre) => !pre);
  };
  const renderGroupList = useCallback(() => {
    return myGroupData.map((groupItem) => {
      return (
        <ListItem key={groupItem.id} sx={{ width: '100%', paddingLeft: 0, paddingRight: 0 }}>
          <GroupItem id={id} avatar={groupItem.avatar} name={groupItem.name} groupId={groupItem.id} />
        </ListItem>
      );
    });
  }, [myGroupData, id]);
  return (
    <Grid container sx={{ height: '100vh' }}>
      <Grid
        item
        sm={4}
        sx={{ display: { xs: 'none', sm: 'block' }, borderRight: `1px solid ${grey[200]}`, paddingTop: '14px' }}
      >
        <Typography variant="h6" sx={{ paddingLeft: '16px' }}>
          Quản lý nhóm
        </Typography>
        <List>{renderGroupList()}</List>
      </Grid>
      <Grid item sm={8} xs={12} sx={{ padding: '8px 12px' }}>
        <Stack direction={'row'} sx={{ width: '100%' }} justifyContent={'space-between'}>
          <IconButton onClick={() => navigate(RoutePath.home)}>
            <KeyboardBackspaceOutlinedIcon sx={{ color: '#000' }} />
          </IconButton>
          <IconButton onClick={hanldeToggleMenuMobile} sx={{ display: { xs: 'block', sm: 'none' } }}>
            <MenuOutlinedIcon sx={{ color: '#000' }} />
          </IconButton>
          <Drawer
            open={isOpenMenuMobile}
            onClose={() => setIsOpenMenuMobile(false)}
            sx={{ width: { xs: '70vw', sm: '50vw' } }}
          >
            {renderGroupList()}
          </Drawer>
        </Stack>
        {id ? (
          <MangeGroupDetail id={id} myGroupListRefetch={myGroupQuery.refetch} />
        ) : (
          <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: 'fit-content', background: COLOR.PINK_LIGHT, padding: '6px', borderRadius: '50px' }}>
              Chọn nhóm để xem thông tin
            </Box>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default ManageGroup;
