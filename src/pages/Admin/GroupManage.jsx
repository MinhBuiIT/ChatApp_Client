import { Avatar, Box, Container, Paper, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { getGroupAdminApi } from '../../apis/admin';
import TableDataGrid from '../../components/Admin/TableDataGrid';
import AvatarGroup from '../../components/AvatarGroup/AvatarGroup';
import COLOR from '../../constants/color';

const columns = [
  { field: 'id', headerClassName: 'header-custom', headerName: 'ID', width: 200 },
  {
    field: 'avatars',
    headerClassName: 'header-custom',
    headerName: 'Avatar',
    width: 300,
    renderCell: (params) => {
      const avatars = params.row.members.map((member) => member.avatar.url);
      return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'start' }}>
          <AvatarGroup avatar={avatars} />
        </Box>
      );
    }
  },
  { field: 'name', headerClassName: 'header-custom', headerName: 'Name', width: 250 },
  { field: 'totalMembers', headerClassName: 'header-custom', headerName: 'Total Members', width: 200 },
  {
    field: 'members',
    headerClassName: 'header-custom',
    headerName: 'Members',
    width: 450,
    renderCell: (params) => {
      const membersAvatar = params.row.members.map((member) => member.avatar.url);
      return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'start' }}>
          <AvatarGroup avatar={membersAvatar} max={100} />
        </Box>
      );
    }
  },
  { field: 'totalMessages', headerClassName: 'header-custom', headerName: 'Total Message', width: 200 },
  {
    field: 'creator',
    headerClassName: 'header-custom',
    headerName: 'Create By',
    width: 250,
    renderCell: (params) => {
      return (
        <Stack direction="row" spacing={1} alignItems={'center'}>
          <Avatar src={params.row.creator.avatar.url} alt={params.row.creator.name} />
          <Typography>{params.row.creator.name}</Typography>
        </Stack>
      );
    }
  }
];
const GroupManage = () => {
  const getGroupDataQuery = useQuery({
    queryKey: ['groupData'],
    queryFn: () => getGroupAdminApi()
  });
  const data = useMemo(() => {
    return getGroupDataQuery.data?.data?.result || [];
  }, [getGroupDataQuery.data]);
  const [rowsData, setRowsData] = useState([]);
  useEffect(() => {
    console.log(data);
    if (data.length > 0) setRowsData(data.map((group) => ({ ...group, id: group._id })));
  }, [data]);
  return (
    <Container sx={{ background: COLOR.GREY_LIGHT, width: '100%', height: '100vh' }}>
      <Paper elevation={2} sx={{ borderRadius: '10px', boxShadow: 'none', padding: '20px 0' }}>
        <Typography sx={{ fontSize: '32px', textAlign: 'center' }}>All Groups</Typography>
      </Paper>
      <Box sx={{ height: '80%', width: '100%' }}>
        <TableDataGrid columns={columns} rows={rowsData} />
      </Box>
    </Container>
  );
};

export default GroupManage;
