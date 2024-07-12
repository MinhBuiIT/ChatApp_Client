import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { Box, Button, List, Skeleton, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createGroupApi } from '../../apis/chat';
import { getMyFriendApi } from '../../apis/user';
import COLOR from '../../constants/color';
import ItemUser from '../ItemUser';
import Styling from '../Styling';

const { TextFieldCustom } = Styling;
const AddGroup = ({ handleClose }) => {
  const [nameGroup, setNameGroup] = useState('');
  const [addUserList, setAddUserList] = useState([]);

  //Query
  const myFriendQuery = useQuery({
    queryKey: ['myFriend'],
    queryFn: () => getMyFriendApi()
  });
  //End Query
  //Mutation
  const mutationCreateGroup = useMutation({
    mutationFn: (data) => createGroupApi(data)
  });
  //End Mutation

  const friendList = myFriendQuery.data?.data?.result || [];
  const handleChangeInput = (e) => {
    setNameGroup(e.target.value);
  };
  const handleAddUserGroup = (_id) => {
    if (addUserList.includes(_id)) {
      const filterAddUserList = addUserList.filter((item) => item !== _id);
      setAddUserList(filterAddUserList);
    } else {
      setAddUserList((pre) => [...pre, _id]);
    }
  };
  const handleSubmitChanges = (e) => {
    e.preventDefault();
    if (!nameGroup) return toast.error('Name group is required');
    const toastID = toast.loading('Creating group...');
    mutationCreateGroup.mutate(
      { name: nameGroup, members: addUserList },
      {
        onSuccess: (res) => {
          toast.update(toastID, { render: res.data.message, type: 'success', isLoading: false, autoClose: 1000 });
          handleClose();
        },
        onError: (err) => {
          toast.update(toastID, {
            render: err?.response?.data?.message,
            type: 'error',
            isLoading: false,
            autoClose: 1000
          });
        }
      }
    );
  };
  useEffect(() => {
    return () => {
      setAddUserList([]);
      setNameGroup('');
    };
  }, []);
  return (
    <>
      {myFriendQuery.isFetching ? (
        <Skeleton />
      ) : (
        <Box>
          <Box>
            <Typography variant="h6" textAlign={'center'}>
              Thêm nhóm mới
            </Typography>
          </Box>
          <Box component={'form'} onSubmit={handleSubmitChanges} id="form-new-group">
            <TextFieldCustom
              fullWidth
              placeholder="Nhập tên nhóm..."
              sx={{ marginTop: '12px' }}
              value={nameGroup}
              onChange={(e) => handleChangeInput(e)}
            />
          </Box>
          <List>
            {friendList.length === 0 ? (
              <Typography textAlign={'center'}>Chưa có bạn bè</Typography>
            ) : (
              friendList.map((user) => {
                return (
                  <ItemUser
                    key={user._id}
                    user={user}
                    handler={handleAddUserGroup}
                    isAdded={addUserList.includes(user._id)}
                    IconChange={RemoveOutlinedIcon}
                    isGroup={true}
                  />
                );
              })
            )}
          </List>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <Button
              variant="contained"
              type="submit"
              form="form-new-group"
              sx={{
                background: COLOR.PINK,
                '&:hover': { background: COLOR.PINK, opacity: 0.9, boxShadow: 'none' },
                boxShadow: 'none'
              }}
            >
              Tạo mới
            </Button>
            <Button
              variant="contained"
              sx={{
                background: grey[400],
                color: 'white',
                '&:hover': { background: grey[500], opacity: 0.9, boxShadow: 'none' },
                boxShadow: 'none'
              }}
              onClick={handleClose}
            >
              Hủy
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default AddGroup;
