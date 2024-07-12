import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addMemberGroupApi, chatDetailApi, removeChatApi, removeMemberGroupApi, renameGroupApi } from '../../apis/chat';
import { getMyFriendApi } from '../../apis/user';
import COLOR from '../../constants/color';
import ItemUser from '../ItemUser';
import Styling from '../Styling';

import { useNavigate } from 'react-router-dom';
import RoutePath from '../../constants/route';

const Modal = lazy(() => import('../Modal'));
const { ListScroll } = Styling;
const ManageGroupDetail = ({ id, myGroupListRefetch }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isEdit, setIsEdit] = useState(false);
  const [nameGroup, setNameGroup] = useState('');
  const [addUserList, setAddUserList] = useState([]);
  const [isDeleteGroup, setIsDeleteGroup] = useState(false);
  const [nameGroupEdit, setNameGroupEdit] = useState('');
  const [isAddMember, setIsAddMember] = useState(false);

  //Query
  const groupDetailQuery = useQuery({
    queryKey: ['groupDetail', id],
    queryFn: () => chatDetailApi(id, true)
  });
  const groupDetailData = groupDetailQuery.data?.data?.result;
  const membersGroup = useMemo(() => {
    return groupDetailData?.members?.filter((member) => member._id.toString() !== user._id) || [];
  }, [groupDetailData, user]);

  const myFriendExceptGroup = useQuery({
    queryKey: ['myFriendExceptGroup', id],
    queryFn: () => getMyFriendApi(id)
  });
  const myFriendExceptGroupData = useMemo(() => myFriendExceptGroup.data?.data?.result || [], [myFriendExceptGroup]);
  //End Query
  //Mutation
  const renameGroupMutation = useMutation({
    mutationFn: (data) => renameGroupApi(id, data)
  });
  const removeMemberGroupMutation = useMutation({
    mutationFn: (data) => removeMemberGroupApi(data)
  });
  const addMemberGroupMutation = useMutation({
    mutationFn: (data) => addMemberGroupApi(data)
  });
  const deleteGroupMutation = useMutation({
    mutationFn: () => removeChatApi(id)
  });
  //End Mutation

  const handleConfirmEdit = () => {
    if (nameGroupEdit === '') return toast.error('Group name is required');
    renameGroupMutation.mutate(
      { name: nameGroupEdit },
      {
        onSuccess: () => {
          setIsEdit(false);
          myGroupListRefetch();
          setNameGroup(nameGroupEdit);
        },
        onError: (error) => {
          toast.error(error.response.data.message || 'Rename group failed');
        }
      }
    );
  };
  const handleConfirmDelete = () => {
    const toastId = toast.loading('Deleting group...');
    deleteGroupMutation.mutate(id, {
      onSuccess: (res) => {
        toast.update(toastId, { render: res.data.message, type: 'success', isLoading: false, autoClose: 1500 });
        myGroupListRefetch();
        navigate(RoutePath.group);
      },
      onError: (err) => {
        toast.update(toastId, {
          render: err.response.data.message || 'Delete group failed',
          type: 'error',
          isLoading: false,
          autoClose: 1500
        });
      }
    });
    setIsDeleteGroup(false);
  };

  const handleAddUserGroup = (_id) => {
    if (addUserList.includes(_id)) {
      const filterAddUserList = addUserList.filter((item) => item !== _id);
      setAddUserList(filterAddUserList);
    } else {
      setAddUserList((pre) => [...pre, _id]);
    }
  };
  const handleConfirmAddUserGroup = () => {
    addMemberGroupMutation.mutate(
      { members: addUserList, chat_id: id },
      {
        onSuccess: (res) => {
          toast.success(res.data.message, { autoClose: 1500 });
          setIsAddMember(false);
          setAddUserList([]);
          groupDetailQuery.refetch();
          myFriendExceptGroup.refetch();
        },
        onError: (err) => {
          toast.error(err.response.data.message || 'Add member failed', { autoClose: 1500 });
        }
      }
    );
  };
  const handleRemoveUserGroup = (_id) => {
    removeMemberGroupMutation.mutate(
      { chat_id: id, member_id: _id },
      {
        onSuccess: (res) => {
          toast.success(res.data.message, { autoClose: 1500 });
          groupDetailQuery.refetch();
          myFriendExceptGroup.refetch();
        },
        onError: (error) => {
          toast.error(error.response.data.message || 'Remove member failed', { autoClose: 1500 });
        }
      }
    );
  };
  useEffect(() => {
    if (groupDetailData) {
      setNameGroup(groupDetailData.name);
    }
    return () => {
      setNameGroup('');
      setNameGroupEdit('');
      setIsEdit(false);
    };
  }, [groupDetailData]);

  return (
    <>
      {isEdit ? (
        <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'center'}>
          <TextField
            variant="standard"
            value={nameGroupEdit}
            onChange={(e) => setNameGroupEdit(e.target.value)}
          ></TextField>
          <IconButton onClick={handleConfirmEdit}>
            <CheckOutlinedIcon sx={{ width: '20px' }} />
          </IconButton>
        </Stack>
      ) : (
        <Stack direction={'row'} spacing={1} alignItems={'center'} justifyContent={'center'}>
          <Typography variant="h5">{nameGroup}</Typography>
          <IconButton onClick={() => setIsEdit(true)}>
            <EditOutlinedIcon sx={{ width: '20px' }} />
          </IconButton>
        </Stack>
      )}
      <Typography mt={2} variant="h6">
        Thành viên
      </Typography>
      <Box
        sx={{
          padding: { md: '30px', sm: '20px', xs: '18px' },
          background: COLOR.GREY_LIGHT,
          height: '400px'
        }}
      >
        {/* Member */}
        <Stack direction={'column'} spacing={2} sx={{ height: '100%' }}>
          {membersGroup.map((user) => {
            return (
              <ItemUser
                key={user._id}
                user={user}
                handler={() => handleRemoveUserGroup(user._id)}
                isAdded={true}
                isGroup={true}
                IconChange={RemoveOutlinedIcon}
              />
            );
          })}
        </Stack>
      </Box>
      <Stack
        direction={{ md: 'row', xs: 'column-reverse' }}
        spacing={2}
        alignItems={'center'}
        justifyContent={'center'}
        mt={2}
      >
        <Button variant="text" color="error" onClick={() => setIsDeleteGroup(true)}>
          Xóa Nhóm
        </Button>
        <Button
          variant="contained"
          sx={{ background: '#000', '&:hover': { background: '#000', opacity: 0.9 } }}
          onClick={() => setIsAddMember(true)}
        >
          Thêm Thành Viên
        </Button>
      </Stack>
      {isDeleteGroup &&
        createPortal(
          <Suspense
            fallback={
              <Backdrop open={true}>
                <CircularProgress color="inherit" />
              </Backdrop>
            }
          >
            <Modal open={isDeleteGroup} handleClose={() => setIsDeleteGroup(false)}>
              <Typography variant="h6" textAlign={'center'}>
                Bạn có chắc chắn muốn xóa nhóm?
              </Typography>
              <Stack direction={'row'} spacing={2} mt={2} justifyContent={'center'}>
                <Button variant="text" color="error" onClick={() => setIsDeleteGroup(false)}>
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  sx={{ background: '#000', '&:hover': { background: '#000', opacity: 0.9 } }}
                  onClick={handleConfirmDelete}
                >
                  Xác nhận
                </Button>
              </Stack>
            </Modal>
          </Suspense>,
          document.body
        )}
      {isAddMember && (
        <Suspense
          fallback={
            <Backdrop open={true}>
              <CircularProgress color="inherit" />
            </Backdrop>
          }
        >
          <Modal open={isAddMember} handleClose={() => setIsAddMember(false)} width={'350px'}>
            <Typography variant="h6" textAlign={'center'}>
              Thêm thành viên
            </Typography>
            {myFriendExceptGroup.isLoading ? (
              <Skeleton />
            ) : myFriendExceptGroupData.length > 0 ? (
              <>
                <ListScroll sx={{ height: '200px', overflowY: 'scroll' }}>
                  {myFriendExceptGroupData.map((user) => {
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
                  })}
                </ListScroll>
                <Button
                  variant="text"
                  sx={{ color: COLOR.PINK, textAlign: 'center', width: '100%', '&:hover': { background: 'white' } }}
                  onClick={handleConfirmAddUserGroup}
                  disabled={addMemberGroupMutation.isPending}
                >
                  Lưu thay đổi
                </Button>
              </>
            ) : (
              <Typography variant="body1" textAlign={'center'}>
                Không có bạn bè nào
              </Typography>
            )}
          </Modal>
        </Suspense>
      )}
    </>
  );
};

export default ManageGroupDetail;
