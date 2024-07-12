import { Avatar, Box, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { chatListApi } from '../../apis/chat';
import emitConstants from '../../constants/socketEvent';
import useListenEmitSocket from '../../hooks/useListenEmitSocket';
import { addUserOnline, removeUserOnline } from '../../redux/Auth/authSlice';
import { handleNewLastMessage, handleNewMessageAlert, handleResetNewMessageAlert } from '../../redux/Chat/chatSlice';
import { getSocketContext } from '../../socket';
import ChatItem from '../ChatItem';
import Styling from '../Styling';

const { StackScrollList } = Styling;
const ChatList = () => {
  const navigate = useNavigate();
  const { user, userOnline } = useSelector((state) => state.auth);
  const userOnlineArr = userOnline.filter((item) => item !== user._id);
  const { last_message } = useSelector((state) => state.chat);
  const { id: chatId } = useParams();
  const dispatch = useDispatch();
  const { alert_message } = useSelector((state) => state.chat);

  const chatListQuery = useQuery({
    queryKey: ['chatList'],
    queryFn: () => chatListApi()
  });
  const chatList = chatListQuery.data?.data?.result || [];
  const handleAlertMessage = (data) => {
    //xử lý khi đang ở trong chat thì không hiển thị alert
    if (data.chatId.toString() === chatId) return;
    dispatch(handleNewMessageAlert(data));
  };
  const handleLastMessage = (data) => {
    dispatch(handleNewLastMessage(data));
  };
  const handleRefreshChatList = () => {
    chatListQuery.refetch();
  };
  const handleRefreshChatListNav = (data) => {
    chatListQuery.refetch();
    //Chỉ khi mà user bị xóa khỏi group đang chat thì mới chuyển về trang chính
    if (data.chatId.toString() === chatId) {
      navigate('/');
    }
  };
  const handleNewGroupMessage = (data) => {
    toast.info(data.message);
  };
  const handleOnlineUser = (data) => {
    dispatch(addUserOnline(data.onlineUser));
  };
  const handleOfflineUser = (data) => {
    dispatch(removeUserOnline(data));
  };
  const socket = getSocketContext();
  useEffect(() => {
    if (socket) socket.emit(emitConstants.JOIN_ROOM, { userId: user._id });
    // const interval = setInterval(() => {
    //   if (socket) socket.emit(emitConstants.JOIN_ROOM, { userId: user._id });
    // }, 3 * 60 * 1000);
    // return () => {
    //   clearInterval(interval);
    // };
  }, [socket, user._id]);
  const eventSocket = {
    [emitConstants.ALERT_MESSAGE]: handleAlertMessage,
    [emitConstants.LAST_MESSAGE]: handleLastMessage,
    [emitConstants.REFRESH_CHATS]: handleRefreshChatList,
    [emitConstants.REFRESH_CHATS_NAV]: handleRefreshChatListNav,
    [emitConstants.TOAST]: handleNewGroupMessage,
    [emitConstants.USER_ONLINE]: handleOnlineUser,
    [emitConstants.USER_OFFLINE]: handleOfflineUser
  };
  useListenEmitSocket(socket, eventSocket);

  useEffect(() => {
    dispatch(handleResetNewMessageAlert({ chatId }));
  }, [chatId, dispatch]);
  return (
    <Box paddingTop={2} height={'93%'}>
      <Typography variant="h5" fontWeight={600} paddingLeft={'16px'}>
        Messages
      </Typography>
      <StackScrollList mt={4}>
        {chatListQuery.isLoading
          ? [1, 2, 3, 4, 5].map((item) => {
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }} key={item}>
                  <Skeleton variant="circular">
                    <Avatar />
                  </Skeleton>
                  <Box sx={{ width: '100%' }}>
                    <Skeleton width="100%">
                      <Typography>.</Typography>
                    </Skeleton>
                  </Box>
                </Box>
              );
            })
          : chatList.map((chat) => {
              const { name, avatar, isGroup, id, members } = chat;
              const lastMessageOfChat = last_message.find((item) => item.chatId.toString() === id.toString());
              const avatarConfig = Array.isArray(avatar) ? avatar : [avatar];
              const newMessageCount = alert_message.find((messageObj) => messageObj._id === id)?.count ?? 0;
              const isOnline = members.some((member) => {
                return userOnlineArr.includes(member._id.toString());
              });
              return (
                <ChatItem
                  key={id}
                  name={name}
                  avatar={avatarConfig}
                  isGroup={isGroup}
                  chatId={id}
                  isOnline={isOnline}
                  newMessageCount={newMessageCount}
                  lastMessage={lastMessageOfChat?.last_message || chat.last_message}
                  me={user._id}
                ></ChatItem>
              );
            })}
      </StackScrollList>
    </Box>
  );
};

export default ChatList;
