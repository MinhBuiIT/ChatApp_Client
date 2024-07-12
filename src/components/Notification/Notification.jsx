import CheckOutlined from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Avatar, Box, Button, IconButton, List, ListItem, Skeleton, Stack, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { getRequestApi, reactRequestApi } from '../../apis/request';
import COLOR from '../../constants/color';

const Notification = () => {
  const [resultRequest, setResultRequest] = useState([]);
  const getNotiQuery = useQuery({
    queryKey: ['notification'],
    queryFn: () => getRequestApi()
  });
  const notiData = getNotiQuery.data?.data?.result || [];
  const reactNotiMutation = useMutation({
    mutationFn: (body) => reactRequestApi(body)
  });

  const handleReactNoti = async (accepted, request_id) => {
    await reactNotiMutation.mutateAsync(
      { accepted, request_id },
      {
        onSuccess: () => {
          setResultRequest((pre) => {
            const message = accepted ? 'Đã chấp nhận' : 'Đã từ chối';
            return [...pre, { request_id, message }];
          });
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || 'Something went wrong');
        }
      }
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Typography variant="h6" textAlign={'center'}>
          Thông báo
        </Typography>
      </Box>
      {getNotiQuery.isLoading ? (
        <>
          <Skeleton></Skeleton>
          <Skeleton></Skeleton>
        </>
      ) : (
        <List>
          {notiData.length === 0 ? (
            <Typography>Không có thông báo mới</Typography>
          ) : (
            notiData.map((noti) => {
              const isReacted = resultRequest.find((item) => item.request_id === noti._id);
              return (
                <ListItem key={noti._id} sx={{ width: '100%' }}>
                  <Stack direction={'row'} alignItems={'center'} width={'100%'}>
                    <Avatar
                      src={noti.sender.avatar}
                      sx={{ width: '60px', height: '60px', border: `2px solid ${COLOR.PINK}` }}
                    />
                    <Typography variant="body1" maxWidth={'60%'} ml={1}>
                      <b>{noti.sender.name}</b> đã gửi lời mời kết bạn
                    </Typography>
                    {isReacted ? (
                      <Button variant="outlined" disabled sx={{ fontSize: '12px' }}>
                        {isReacted?.message}
                      </Button>
                    ) : (
                      <Box
                        sx={{ display: 'flex', gap: '12px', justifyContent: 'end', marginLeft: '12px' }}
                        flexGrow={1}
                      >
                        <IconButton
                          sx={{
                            width: '40px',
                            height: '40px',
                            background: green[400],
                            '&:hover': { background: green[600] }
                          }}
                          onClick={() => handleReactNoti(1, noti._id)}
                          disabled={reactNotiMutation.isPending}
                        >
                          <CheckOutlined style={{ color: 'white' }} />
                        </IconButton>
                        <IconButton
                          color={red[700]}
                          sx={{
                            width: '40px',
                            height: '40px',
                            background: red[400],
                            '&:hover': { background: red[600] }
                          }}
                          onClick={() => handleReactNoti(0, noti._id)}
                          disabled={reactNotiMutation.isPending}
                        >
                          <CloseOutlinedIcon style={{ color: 'white' }} />
                        </IconButton>
                      </Box>
                    )}
                  </Stack>
                </ListItem>
              );
            })
          )}
        </List>
      )}
    </Box>
  );
};

export default Notification;
