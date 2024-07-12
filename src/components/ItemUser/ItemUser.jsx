import AddOutlined from '@mui/icons-material/AddOutlined';
import { Avatar, CircularProgress, ListItem, Stack, Typography } from '@mui/material';
import { memo } from 'react';
import COLOR from '../../constants/color.js';
import Styling from '../Styling';

const { IconButtonCustom } = Styling;
const ItemUser = memo(({ user, handler, isAdded, IconChange, isPending, isRequestSended, isGroup = false }) => {
  const isChecked = isRequestSended || isAdded;
  return (
    <ListItem>
      <Stack direction={'row'} alignItems={'center'} width={'100%'}>
        <Avatar src={user.avatar} sx={{ width: '40px', height: '40px' }} />
        <Typography variant="body1" flexGrow={1} ml={1}>
          {user.name}
        </Typography>
        {!isGroup ? (
          <IconButtonCustom onClick={() => handler(user._id)} disabled={isChecked}>
            {isPending ? (
              <CircularProgress size={20} thickness={5} sx={{ color: COLOR.PINK }} />
            ) : isChecked ? (
              <IconChange />
            ) : (
              <AddOutlined />
            )}
          </IconButtonCustom>
        ) : (
          <IconButtonCustom onClick={() => handler(user._id)}>
            {isAdded ? <IconChange /> : <AddOutlined />}
          </IconButtonCustom>
        )}
      </Stack>
    </ListItem>
  );
});

export default ItemUser;
