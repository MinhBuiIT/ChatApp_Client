import { Avatar, Box, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useSelector } from 'react-redux';
import COLOR from '../../constants/color';

const Info = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Box sx={{ height: '100%', borderLeft: '1px solid rgba(0,0,0,0.1)', padding: '50px 16px 20px' }}>
      <Stack
        direction={'column'}
        alignItems={'center'}
        sx={{ paddingBottom: '30px', borderBottom: '1px solid rgba(0,0,0,0.1) ' }}
      >
        <Avatar src={user.avatar.url} sx={{ width: '100px', height: '100px', border: `4px solid ${COLOR.PINK}` }} />
        <Typography mt={'12px'} fontSize={'24px'} fontWeight={600} fontFamily={'revert'}>
          {user.name}
        </Typography>
        <Typography mt={'4px'} color={grey[600]} fontSize={'16px'} fontWeight={600}>
          @{user.username}
        </Typography>
        <Typography mt={'6px'} fontStyle={'italic'} color={grey[600]} fontSize={'14px'}>
          {user.bio}
        </Typography>
      </Stack>
    </Box>
  );
};

export default Info;
