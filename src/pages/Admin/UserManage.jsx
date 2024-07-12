import { Avatar, Box, Container, Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { getUserAdminApi } from '../../apis/admin';
import TableDataGrid from '../../components/Admin/TableDataGrid';
import COLOR from '../../constants/color';

const columns = [
  { field: 'id', headerClassName: 'header-custom', headerName: 'ID', width: 200 },
  {
    field: 'avatar',
    headerClassName: 'header-custom',
    headerName: 'Avatar',
    width: 250,
    renderCell: (params) => {
      return <Avatar src={params.row.avatar} alt={params.row.username} />;
    }
  },
  { field: 'name', headerClassName: 'header-custom', headerName: 'Name', width: 250 },
  { field: 'friends', headerClassName: 'header-custom', headerName: 'Friends', width: 200 },
  { field: 'groups', headerClassName: 'header-custom', headerName: 'Groups', width: 200 }
];
const UserManage = () => {
  const [rowsData, setRowsData] = useState([]);
  const userDataQuery = useQuery({
    queryKey: ['userData'],
    queryFn: () => getUserAdminApi()
  });
  const data = useMemo(() => {
    return userDataQuery.data?.data?.result || [];
  }, [userDataQuery.data]);
  useEffect(() => {
    if (userDataQuery.data?.status === 200 && data) setRowsData(data.map((item) => ({ ...item, id: item._id })));
  }, [data, userDataQuery.data]);
  return (
    <Container sx={{ background: COLOR.GREY_LIGHT, width: '100%', height: '100vh' }}>
      <Paper elevation={2} sx={{ borderRadius: '10px', boxShadow: 'none', padding: '20px 0' }}>
        <Typography sx={{ fontSize: '32px', textAlign: 'center' }}>All User</Typography>
      </Paper>
      <Box sx={{ height: '80%', width: '100%' }}>
        <TableDataGrid columns={columns} rows={rowsData} />
      </Box>
    </Container>
  );
};

export default UserManage;
