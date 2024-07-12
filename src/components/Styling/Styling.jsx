import { Badge, Box, IconButton, List, Stack, TextField, Typography, styled } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Link } from 'react-router-dom';
import COLOR from '../../constants/color';

const VisualInput = styled('input')({
  overflow: 'hidden',
  border: 0,
  clip: 'rect(0,0,0,0)',
  width: 0
});
const IconButtonHeader = styled(IconButton)({
  width: '40px',
  height: '40px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: COLOR.PINK,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0
    }
  }
}));
const StyledLink = styled(Link)({
  textDecoration: 'none',
  color: 'black',
  padding: '10px 16px',
  '&:hover': {
    backgroundColor: 'rgba(251,244,251,1)'
  }
});
const TextFieldCustom = styled(TextField)({
  '& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input': {
    padding: '10px 8px'
  }
});
const IconButtonCustom = styled(IconButton)({
  background: COLOR.PINK_LIGHT,
  '&:hover': {
    background: COLOR.PINK,
    '.MuiSvgIcon-root': {
      color: '#fff'
    }
  },
  '& .MuiSvgIcon-root': {
    color: COLOR.PINK
  }
});
const IconButtonSendCustom = styled(IconButton)({
  background: COLOR.PINK,
  '&:hover': {
    background: COLOR.PINK,
    '.MuiSvgIcon-root': {
      color: '#fff'
    }
  },
  '& .MuiSvgIcon-root': {
    color: '#fff'
  }
});
const InputCustomText = styled('input')({
  border: 'none',
  outline: 'none',
  fontSize: '16px',
  color: grey[600],
  fontWeight: 400,
  resize: 'none',
  fontFamily: 'Arial, sans-serif'
});
const StackScroll = styled(Box)({
  overflowX: 'hidden',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column-reverse',
  scrollBehavior: 'smooth',
  // justifyContent: 'flex-end',
  padding: '0px 10px',
  background: COLOR.GREY_LIGHT,
  flexGrow: 1,
  /* width */
  '&::-webkit-scrollbar': {
    width: '10px'
  },

  /* Track */
  '&::-webkit-scrollbar-track': {
    background: COLOR.GREY_LIGHT
  },

  /* Handle */
  '&::-webkit-scrollbar-thumb': {
    background: '#888'
  },

  /* Handle on hover */
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555'
  }
});
const StackScrollList = styled(Stack)({
  overflow: 'scroll',
  height: '100%',
  '&::-webkit-scrollbar': {
    width: '5px'
  },

  /* Track */
  '&::-webkit-scrollbar-track': {
    background: COLOR.GREY_LIGHT
  },

  /* Handle */
  '&::-webkit-scrollbar-thumb': {
    background: 'transparent'
  },

  /* Handle on hover */
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#eee'
  }
});
const ListScroll = styled(List)({
  overflowX: 'hidden',
  overflowY: 'scroll',
  /* width */
  '&::-webkit-scrollbar': {
    width: '6px'
  },

  /* Track */
  '&::-webkit-scrollbar-track': {
    background: COLOR.GREY_LIGHT
  },

  /* Handle */
  '&::-webkit-scrollbar-thumb': {
    background: '#888'
  },

  /* Handle on hover */
  '&::-webkit-scrollbar-thumb:hover': {
    background: '#555'
  }
});
const TypographyCustomDot = styled(Typography)({
  display: 'block',
  maxWidth: '150px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
});
const InputCustomCicrle = styled('input')({
  padding: '12px 16px',
  borderRadius: '100px',
  border: 'none',
  outline: 'none',
  background: grey[200],
  color: grey[600]
});

const Styling = {
  VisualInput,
  IconButtonHeader,
  StyledBadge,
  StyledLink,
  TextFieldCustom,
  IconButtonCustom,
  InputCustomText,
  IconButtonSendCustom,
  StackScroll,
  ListScroll,
  TypographyCustomDot,
  InputCustomCicrle,
  StackScrollList
};
export default Styling;
