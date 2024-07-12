import Avatar from '@mui/material/Avatar';
import AvatarGroupMui from '@mui/material/AvatarGroup';
const AvatarGroup = ({ avatar, max = 3 }) => {
  return (
    <AvatarGroupMui max={max} spacing={'small'}>
      {avatar.map((item) => {
        return <Avatar key={item} src={item} />;
      })}
    </AvatarGroupMui>
  );
};

export default AvatarGroup;
