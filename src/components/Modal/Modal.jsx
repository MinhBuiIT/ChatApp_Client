import { Box } from '@mui/material';
import ModalBox from '@mui/material/Modal';
const style = (width) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: `${width}`,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 3
});
const Modal = ({ children, open, handleClose, width }) => {
  return (
    <ModalBox
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style(width)}>{children}</Box>
    </ModalBox>
  );
};

export default Modal;
