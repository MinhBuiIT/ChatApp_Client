import CheckOutlined from '@mui/icons-material/CheckOutlined';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { sendRequestApi } from '../../apis/request';
import { getUserApi } from '../../apis/user';
import useDebounce from '../../hooks/useDebounce';
import ItemUser from '../ItemUser';
import Styling from '../Styling';

const { TextFieldCustom, ListScroll } = Styling;
const Search = () => {
  const [friendReqList, setFriendReqList] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [pendingSendReq, setPendingSendReqState] = useState('');
  const debounceValue = useDebounce(searchValue, 800);

  const userSearchQuery = useQuery({
    queryKey: ['userSearch', debounceValue],
    queryFn: () => {
      return getUserApi({ name: debounceValue });
    }
  });
  const sendRequestMutate = useMutation({
    mutationFn: (body) => sendRequestApi(body)
  });
  const userData = userSearchQuery.data?.data?.result || [];

  const hanldeAddRequestFriend = async (_id) => {
    setPendingSendReqState(_id);
    await sendRequestMutate.mutateAsync(
      { receiver_id: _id },
      {
        onSuccess: (res) => {
          toast(res.data.message, {
            position: 'top-center',
            autoClose: 2000,
            theme: 'light',
            draggable: true,
            pauseOnHover: false
          });
        },
        onError: (err) => {
          toast.error(err.response.data?.message || 'Something went wrong', {
            position: 'top-center',
            autoClose: 2000,
            draggable: true,
            pauseOnHover: false
          });
        }
      }
    );
    setFriendReqList((pre) => [...pre, _id]);
  };
  useEffect(() => {
    if (!sendRequestMutate.isPending) setPendingSendReqState('');
  }, [sendRequestMutate.isPending]);
  return (
    <Box>
      <Box>
        <Typography variant="h6" textAlign={'center'}>
          Tìm kiếm bạn bè
        </Typography>
      </Box>
      <Box component={'form'}>
        <TextFieldCustom
          fullWidth
          placeholder="Nhập tên cần tìm..."
          sx={{ marginTop: '12px' }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </Box>
      <ListScroll sx={{ height: '60vh', overflowY: 'auto' }}>
        {userSearchQuery.isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress></CircularProgress>
          </Box>
        ) : (
          userData.map((user) => {
            return (
              <ItemUser
                key={user._id}
                user={user}
                handler={hanldeAddRequestFriend}
                isAdded={friendReqList.includes(user._id)}
                isPending={pendingSendReq === user._id}
                isRequestSended={user.isRequestSended}
                IconChange={CheckOutlined}
              />
            );
          })
        )}
      </ListScroll>
    </Box>
  );
};

export default Search;
