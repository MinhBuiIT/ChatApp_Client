import FileIcon from '@mui/icons-material/AttachFile';
import SendOutlined from '@mui/icons-material/SendOutlined';
import { Avatar, Box, CircularProgress, Drawer, Skeleton, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { chatDetailApi, getMessagesApi } from '../apis/chat.js';
import AvatarGroup from '../components/AvatarGroup/AvatarGroup.jsx';
import BubbleCircle from '../components/BubbleCircle';
import ChatItem from '../components/ChatItem';
import MenuFile from '../components/MenuFile/MenuFile.jsx';
import MessageItem from '../components/MessageItem';
import Styling from '../components/Styling';
import COLOR from '../constants/color';
import emitConstants from '../constants/socketEvent.js';
import useListenEmitSocket from '../hooks/useListenEmitSocket.jsx';
import AppLayout from '../layouts/AppLayout/AppLayout';
import { chatList } from '../lib/sampleData';
import { hanldeIsOpenMenuFile } from '../redux/Modal/modalSlice.js';
import { getSocketContext } from '../socket';

const newMessageAlert = [{ _id: 1, count: 3 }]; //fetch data
const onlineList = [1, 2, 3, 4, 5]; //fetch data
const { StyledBadge, InputCustomText, IconButtonSendCustom, StackScroll } = Styling;
const { STOP_TYPING, START_TYPING, NEW_MESSAGE, ALERT_GROUP } = emitConstants;

const Chat = () => {
  const dispatch = useDispatch();
  const { user, userOnline } = useSelector((state) => state.auth);
  const { id: chatId } = useParams();
  const formRef = useRef(null);
  const { isOpenMenuFile } = useSelector((state) => state.modal);
  const [isOpenMenuMobile, setIsOpenMenuMobile] = useState(false);
  const [sendMessage, setSendMessage] = useState('');
  const [messageRealTime, setMessageRealTime] = useState([]);
  const [isTypingMessage, setIsTypingMessage] = useState(false);
  const [isUserTyingMessage, setIsUserTyingMessage] = useState(false);
  const [alertChangeGroup, setAlertChangeGroup] = useState(null);
  const anchorElFile = useRef(null);
  const observer = useRef();
  const typingTimeOut = useRef(null);

  //Reset when change chat
  useEffect(() => {
    return () => {
      setMessageRealTime([]);
    };
  }, [chatId]);
  //Tin nhắn mới thì scroll into view bottom
  // useEffect(() => {
  //   if (scrollView.current) scrollView.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  // }, [messageRealTime]);

  const onChangeSendMessage = (e) => {
    const message = e.target.value;
    setSendMessage(message);
    const members = chatDetailData?.members;

    if (!isTypingMessage) {
      setIsTypingMessage(true);
      socket.emit(emitConstants.START_TYPING, { chatId, members: members, name: user.name });
    }
    if (typingTimeOut.current) clearTimeout(typingTimeOut.current);
    typingTimeOut.current = setTimeout(() => {
      setIsTypingMessage(false);
      socket.emit(emitConstants.STOP_TYPING, { chatId, members: members, name: user.name });
    }, 1000);
  };
  //Query API
  const chatDetailQuery = useQuery({
    queryKey: ['chatDetail', { chatId }],
    queryFn: () => chatDetailApi(chatId, true),
    enabled: !!chatId,
    refetchOnMount: false
  });
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } = useInfiniteQuery({
    queryKey: ['messageInfi', chatId],
    queryFn: ({ pageParam = 1 }) => {
      return getMessagesApi(chatId, pageParam);
    },
    getNextPageParam: (lastPage, allPages) => {
      const { page, totalPages } = lastPage.data.result;
      return page < totalPages ? allPages.length + 1 : undefined;
    },
    keepPreviousData: true,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });
  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading]
  );
  const messageChatData = useMemo(() => {
    return data?.pages.map((page) => page.data.result.messages).flat() || [];
  }, [data?.pages]);

  // const messageChatData = getMessageChatQuery.data?.data?.result.messages || [];
  const chatDetailData = chatDetailQuery.data?.data?.result;
  const memberNotMe = chatDetailData?.members.filter((member) => member._id !== user._id);
  //kiểm tra người nhận tin nhắn có đang online không
  const isOnlineReceiver = memberNotMe?.some((member) => userOnline.includes(member._id));
  const memberAvatar = memberNotMe?.map((member) => member.avatar) || [];

  const socket = getSocketContext();
  const handleSubmitSendMessage = (e) => {
    e.preventDefault();
    if (sendMessage.trim() === '') {
      setSendMessage('');
      return;
    }
    const data = { chatId, message: sendMessage, members: chatDetailData?.members };
    socket.emit(NEW_MESSAGE, data);
    setSendMessage('');
  };
  const handleMessage = (data) => {
    if (data.chatId !== chatId) return;

    setMessageRealTime((pre) => [data.message, ...pre]);
  };
  const handleStartTypingListen = (data) => {
    if (data.chatId !== chatId) return;
    setIsUserTyingMessage(true);
  };
  const handleStopTypingListen = (data) => {
    if (data.chatId !== chatId) return;
    setIsUserTyingMessage(false);
  };
  const handleChangeStateGroup = (data) => {
    if (data.chatId !== chatId) return;
    console.log('Data', data);
    setAlertChangeGroup({ chatId: data.chatId, message: data.message });
  };
  const listenEmitEvent = {
    [NEW_MESSAGE]: handleMessage,
    [START_TYPING]: handleStartTypingListen,
    [STOP_TYPING]: handleStopTypingListen,
    [ALERT_GROUP]: handleChangeStateGroup
  };
  //Lắng nghe sự kiện
  useListenEmitSocket(socket, listenEmitEvent);
  const allMessaages = useMemo(() => {
    return [...messageRealTime, ...messageChatData];
  }, [messageRealTime, messageChatData]);
  return (
    <>
      {chatDetailQuery.isLoading ? (
        <Stack direction={'column'} height={'100%'} position={'relative'} width={'100%'}>
          <Skeleton animation="wave"></Skeleton>
          <Skeleton animation="wave"></Skeleton>
          <Skeleton animation="wave"></Skeleton>
        </Stack>
      ) : (
        <Stack direction={'column'} height={'100%'} position={'relative'} width={'100%'}>
          <Box height={'3.7rem'} sx={{ boxShadow: '0px 0px 6px 0px rgba(0,0,0,0.15)', left: '0px', right: '0px' }}>
            <Stack padding={'12px'} alignItems={'center'} spacing={1} direction={'row'}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant={`${isOnlineReceiver && 'dot'}`}
              >
                {memberAvatar.length > 1 ? (
                  <AvatarGroup avatar={memberAvatar} />
                ) : (
                  <Avatar sx={{ width: 40, height: 40 }} src={memberAvatar[0]} />
                )}
              </StyledBadge>
              <Stack direction={'column'}>
                <Typography fontWeight={500} fontSize={'16px'}>
                  {chatDetailData?.name || memberNotMe[0]?.name}
                </Typography>
              </Stack>
              <Box sx={{ flexGrow: 1, textAlign: 'end', display: 'flex', justifyContent: 'end' }}>
                <Drawer
                  open={isOpenMenuMobile}
                  onClose={() => setIsOpenMenuMobile(false)}
                  sx={{ width: { xs: '70vw', sm: '50vw' } }}
                >
                  {chatList.map((chat) => {
                    const { name, avatar, isGroup, _id, members } = chat;
                    const newMessageCount = newMessageAlert.find((messageObj) => messageObj._id === _id)?.count ?? 0;
                    const isOnline = members.some((member) => {
                      return onlineList.includes(member);
                    });
                    return (
                      <ChatItem
                        key={_id}
                        name={name}
                        avatar={avatar}
                        isGroup={isGroup}
                        chatId={_id}
                        isOnline={isOnline}
                        newMessageCount={newMessageCount}
                      ></ChatItem>
                    );
                  })}
                </Drawer>
              </Box>
            </Stack>
          </Box>

          <StackScroll>
            <motion.div
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.5 } }}
              style={{ display: 'flex', flexDirection: 'column-reverse' }}
            >
              {alertChangeGroup && alertChangeGroup.chatId === chatId ? (
                <Box sx={{ margin: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box
                    sx={{
                      width: 'fit-content',
                      fontSize: '13px',
                      background: COLOR.PINK_LIGHT,
                      padding: '6px',
                      borderRadius: '50px'
                    }}
                  >
                    {alertChangeGroup.message}
                  </Box>
                </Box>
              ) : null}

              {isUserTyingMessage && <BubbleCircle />}
              {allMessaages.map((messageItem) => {
                const isSameSender = user._id === messageItem.sender._id;
                return (
                  <MessageItem
                    key={messageItem._id}
                    message={messageItem.content}
                    time={messageItem.createdAt}
                    avatar={messageItem.sender.avatar.url}
                    isSameSender={isSameSender}
                    name={messageItem.sender.name}
                    attchments={messageItem.attachments}
                  />
                );
              })}
            </motion.div>

            <Box
              ref={lastElementRef}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '10px' }}
            >
              {isFetching && <CircularProgress color="secondary" />}
            </Box>
          </StackScroll>
          <Box
            height={'3.5rem'}
            width={'100%'}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLOR.GREY_LIGHT }}
          >
            <Stack
              width={'95%'}
              height={'3rem'}
              sx={{
                background: 'white',
                border: `1px solid ${grey[300]}`,
                borderRadius: '100px',
                padding: '8px 16px',
                overflow: 'hidden'
              }}
              direction={'row'}
              alignItems={'center'}
              component={'form'}
              onSubmit={handleSubmitSendMessage}
              ref={formRef}
            >
              <InputCustomText
                placeholder="Tin nhắn..."
                sx={{ flexGrow: 1 }}
                value={sendMessage}
                onChange={onChangeSendMessage}
              />
              <Box
                ref={anchorElFile}
                onClick={() => dispatch(hanldeIsOpenMenuFile(true))}
                aria-controls={isOpenMenuFile ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isOpenMenuFile ? 'true' : undefined}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px',
                  cursor: 'pointer'
                }}
              >
                <FileIcon sx={{ color: grey[600] }} />
              </Box>
              <MenuFile chatId={chatId} anchorElFile={anchorElFile} />
              <IconButtonSendCustom sx={{ width: '35px', height: '35px' }} type="submit">
                <SendOutlined sx={{ transform: 'rotate(-25deg)', width: '20px' }} />
              </IconButtonSendCustom>
            </Stack>
          </Box>
        </Stack>
      )}
    </>
  );
};
export default AppLayout()(Chat);
