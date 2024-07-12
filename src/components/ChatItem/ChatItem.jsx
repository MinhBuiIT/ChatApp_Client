import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import { Avatar, Box, Menu, MenuItem, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { leaveGroupApi, removeChatApi } from '../../apis/chat';
import COLOR from '../../constants/color';
import { hanldeChatListModal } from '../../redux/Modal/modalSlice';
import AvatarGroup from '../AvatarGroup/AvatarGroup';
import Styling from '../Styling';

const { StyledBadge, StyledLink, TypographyCustomDot } = Styling;
const ChatItem = ({ chatId, newMessageCount, avatar = [], isGroup = false, isOnline, name, lastMessage, me }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  //Mutation
  const deleteChatMutation = useMutation({
    mutationFn: (chatId) => removeChatApi(chatId)
  });
  const leaveGroupMutation = useMutation({
    mutationFn: (chatId) => leaveGroupApi(chatId)
  });
  //End Mutation

  const senderLastMessage = lastMessage?.sender?._id === me.toString() ? 'You: ' : `${lastMessage?.sender?.name}: `;
  const contentLastMessage = lastMessage?.content ? lastMessage?.content : 'Send An File';

  const handleContextMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleConfirmDeleteChat = async (chatId) => {
    const toastId = toast.loading('Deleting Chat...');
    try {
      const res = await deleteChatMutation.mutateAsync(chatId);
      console.log('Res', res);
      toast.update(toastId, {
        render: res.data.message,
        type: 'success',
        isLoading: false,
        autoClose: 1500
      });
    } catch (err) {
      console.log('Err', err);
      toast.update(toastId, {
        render: err.response.data.message,
        type: 'error',
        isLoading: false,
        autoClose: 1500
      });
    } finally {
      setAnchorEl(null);
    }

    // deleteChatMutation.mutate(chatId, {
    //   onSuccess: (res) => {
    //     console.log('Res', res);
    //     toast.update(toastId, {
    //       render: res.data.message,
    //       type: 'success',
    //       isLoading: false,
    //       autoClose: 1500
    //     });
    //     setAnchorEl(null);
    //   },
    //   onError: (err) => {
    //     console.log('Err', err);
    //     toast.update(toastId, {
    //       render: err.response.data.message,
    //       type: 'error',
    //       isLoading: false,
    //       autoClose: 1500
    //     });
    //     setAnchorEl(null);
    //   }
    // });
  };
  const handleConfirmLeaveGroup = (chatId) => {
    const toastId = toast.loading('Leaving Group...');
    leaveGroupMutation.mutate(chatId, {
      onSuccess: (res) => {
        toast.update(toastId, {
          render: res.data.message,
          type: 'success',
          isLoading: false,
          autoClose: 1500
        });
      },
      onError: (err) => {
        toast.update(toastId, {
          render: err.response.data.message,
          type: 'error',
          isLoading: false,
          autoClose: 1500
        });
      }
    });
    setAnchorEl(null);
  };
  return (
    <>
      <StyledLink
        to={`/chat/${chatId}`}
        sx={{ backgroundColor: `${chatId == id ? COLOR.PINK_LIGHT : 'unset'}` }}
        key={chatId}
        onClick={() => dispatch(hanldeChatListModal(false))}
        onContextMenu={handleContextMenu}
      >
        <Box sx={{ display: 'flex', position: 'relative' }}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant={`${isOnline && 'dot'}`}
          >
            {isGroup ? <AvatarGroup avatar={avatar} /> : <Avatar sx={{ width: 55, height: 55 }} src={avatar[0]} />}
          </StyledBadge>

          <Box sx={{ marginLeft: '8px' }}>
            <Typography variant="h6" fontWeight={500}>
              {name}
            </Typography>
            {lastMessage && (
              <TypographyCustomDot fontSize={12} fontWeight={400} color={grey[700]}>
                {newMessageCount > 0 ? (
                  <b>{`${senderLastMessage} ${contentLastMessage}`}</b>
                ) : (
                  `${senderLastMessage} ${contentLastMessage}`
                )}
              </TypographyCustomDot>
            )}
          </Box>
          {newMessageCount !== 0 && (
            <Box
              sx={{
                position: 'absolute',
                right: '10px',
                bottom: '10px',
                fontSize: '12px',
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${COLOR.PINK}`
              }}
            >
              {newMessageCount > 5 ? '5+' : newMessageCount}
            </Box>
          )}
        </Box>
      </StyledLink>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {isGroup ? (
          <MenuItem onClick={() => handleConfirmLeaveGroup(chatId)}>
            <ExitToAppOutlinedIcon />
            Leave Group
          </MenuItem>
        ) : (
          <MenuItem onClick={() => handleConfirmDeleteChat(chatId)}>
            <DeleteOutlineOutlinedIcon />
            Delete Chat
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ChatItem;
