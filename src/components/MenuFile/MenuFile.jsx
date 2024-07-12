import AudioFileOutlinedIcon from '@mui/icons-material/AudioFileOutlined';
import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Menu, MenuItem } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { uploadAttachmentApi } from '../../apis/chat';
import { handleLoadingUploadFile, hanldeIsOpenMenuFile } from '../../redux/Modal/modalSlice';

const MenuFile = ({ anchorElFile, chatId }) => {
  const inputImage = useRef(null);
  const inputVideo = useRef(null);
  const inputAudio = useRef(null);
  const inputFile = useRef(null);

  const { isOpenMenuFile } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const mutationUploadFile = useMutation({
    mutationFn: (data) => uploadAttachmentApi(chatId, data)
  });

  const handleUploadClick = (input) => {
    input.current.click();
  };
  const handleChangeFile = async (e, key) => {
    const files = e.target.files;
    if (files.length === 0) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('attach', files[i]);
    }
    //Xử lý upload file
    dispatch(handleLoadingUploadFile(true));
    const toastId = toast.loading(`Uploading ${key}...`, {
      position: 'top-center'
    });

    //Gọi API upload file
    try {
      await mutationUploadFile.mutateAsync(formData);
      toast.update(toastId, {
        render: 'Upload file successfully',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
        position: 'top-center'
      });
    } catch (error) {
      toast.update(toastId, {
        render: 'Upload file failed',
        type: 'error',
        isLoading: false,
        autoClose: 2000,
        position: 'top-center'
      });
    }
    dispatch(handleLoadingUploadFile(false));
    dispatch(hanldeIsOpenMenuFile(false));
  };
  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorElFile.current}
      open={isOpenMenuFile}
      onClose={() => dispatch(hanldeIsOpenMenuFile(false))}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <MenuItem onClick={() => handleUploadClick(inputImage)}>
        <BrokenImageOutlinedIcon sx={{ color: 'grey', marginRight: '8px' }} />
        Tải hình ảnh
        <input
          type="file"
          accept="image/jpg,image/png,image/jpeg,image/avif"
          style={{ display: 'none' }}
          multiple
          ref={inputImage}
          onChange={(e) => handleChangeFile(e, 'Images')}
        />
      </MenuItem>
      <MenuItem onClick={() => handleUploadClick(inputVideo)}>
        <SmartDisplayOutlinedIcon sx={{ color: 'grey', marginRight: '8px' }} />
        Tải video
        <input
          type="file"
          accept="video/mp4,video/x-m4v"
          style={{ display: 'none' }}
          multiple
          ref={inputVideo}
          onChange={(e) => handleChangeFile(e, 'Videos')}
        />
      </MenuItem>
      <MenuItem onClick={() => handleUploadClick(inputAudio)}>
        <AudioFileOutlinedIcon sx={{ color: 'grey', marginRight: '8px' }} />
        Tải bản ghi âm
        <input
          type="file"
          accept="audio/*"
          style={{ display: 'none' }}
          multiple
          ref={inputAudio}
          onChange={(e) => handleChangeFile(e, 'Audios')}
        />
      </MenuItem>
      <MenuItem onClick={() => handleUploadClick(inputFile)}>
        <UploadFileOutlinedIcon sx={{ color: 'grey', marginRight: '8px' }} />
        Tải tệp tin file
        <input
          type="file"
          style={{ display: 'none' }}
          ref={inputFile}
          onChange={(e) => handleChangeFile(e, 'File')}
          multiple
        />
      </MenuItem>
    </Menu>
  );
};

export default MenuFile;
