import CloseOutlined from '@mui/icons-material/CloseOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { Avatar, Box, IconButton, Modal, Stack, Tooltip, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import moment from 'moment';
import { memo, useState } from 'react';
import { createPortal } from 'react-dom';
import RenderFile from '../RenderFile';

const MessageItem = memo(({ message, avatar, time, isSameSender, name, attchments = [] }) => {
  const [isOpenModalAttach, setIsOpenModalAttach] = useState(false);
  const [fileDataAttachModal, setFileDataAttachModal] = useState({ url: '', file_type: '' });
  const handleCloseModalAttach = () => {
    setIsOpenModalAttach(false);
  };
  const handleClickModalAttach = (url, file_type) => {
    setIsOpenModalAttach(true);
    setFileDataAttachModal({ url, file_type });
  };
  return (
    <>
      <Tooltip
        title={moment(time).format('dddd, MMMM Do YYYY, h:mm a')}
        placement={isSameSender ? 'top-end' : 'top-start'}
      >
        <Box my={1}>
          <Stack
            direction={isSameSender ? 'row' : 'row-reverse'}
            justifyContent={isSameSender ? 'end' : 'start'}
            alignItems={'end'}
            spacing={1}
          >
            <Stack direction={'column'} alignItems={isSameSender ? 'end' : 'start'} sx={{ width: '100%' }}>
              {message && (
                <Box
                  sx={{
                    fontSize: '14px',
                    color: `${isSameSender ? 'white' : 'black'}`,
                    background: `${isSameSender ? '#000' : '#fff'}`,
                    padding: '12px',
                    borderRadius: '10px',
                    maxWidth: '50%',
                    width: 'fit-content'
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: '500',
                      textAlign: `${isSameSender ? 'right' : 'left'}`,
                      marginBottom: '12px'
                    }}
                  >
                    {isSameSender ? 'Bạn' : name.split(' ')[0]}
                  </Typography>
                  {message}
                </Box>
              )}
              {attchments.length > 0 &&
                attchments.map((file) => {
                  let fileStyle = { width: '40%', height: '150px', marginTop: '12px' };
                  if (file.file_type === 'file' || file.file_type === 'audio') {
                    fileStyle = { marginTop: '12px' };
                  }
                  return (
                    <Box
                      sx={{ ...fileStyle, cursor: 'pointer' }}
                      key={file.url}
                      onClick={() => handleClickModalAttach(file.url, file.file_type)}
                    >
                      <RenderFile
                        url={file.url}
                        style={{ width: '100%', height: '100%' }}
                        type={file.file_type}
                        fileName={file?.file_name}
                        isTransform={true}
                      />
                    </Box>
                  );
                })}
            </Stack>
            <Avatar src={avatar} />
          </Stack>
          <Box
            color={grey[500]}
            sx={{
              width: '100%',
              textAlign: `${isSameSender ? 'right' : 'left'}`,
              fontSize: '12px',
              paddingRight: '50px',
              paddingLeft: '50px'
            }}
          >
            {new Date().getTime() - new Date(time).getTime() < 1000 * 60 * 60 * 24 && moment(time).fromNow()}
          </Box>
        </Box>
      </Tooltip>
      {createPortal(
        <Modal
          open={isOpenModalAttach}
          onClose={handleCloseModalAttach}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Box sx={{ width: '70vw', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box
              sx={{
                top: '14px',
                right: '14px',
                position: 'absolute',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <a href={fileDataAttachModal.url} target="_blank" download style={{ marginTop: '10px' }}>
                <DownloadOutlinedIcon sx={{ color: 'white' }} />
              </a>
              <IconButton sx={{ color: 'white' }} onClick={handleCloseModalAttach}>
                <CloseOutlined />
              </IconButton>
            </Box>
            <RenderFile
              url={fileDataAttachModal.url}
              style={{ width: '100%', height: '100%' }}
              type={fileDataAttachModal.file_type}
              isTransform={false}
            />
          </Box>
        </Modal>,
        document.body
      )}
    </>
  );
});

export default MessageItem;
