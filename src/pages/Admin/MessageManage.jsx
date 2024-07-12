import { Avatar, Box, Container, Paper, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { getMessageAdminApi } from '../../apis/admin';
import TableDataGrid from '../../components/Admin/TableDataGrid';
import RenderFile from '../../components/RenderFile';
import COLOR from '../../constants/color';

const columns = [
  { field: 'id', headerClassName: 'header-custom', headerName: 'ID', width: 200 },
  {
    field: 'attachments',
    headerClassName: 'header-custom',
    headerName: 'Message Attachments',
    width: 300,
    renderCell: (params) => {
      const attachments = params.row.attachments;
      if (attachments.length === 3) {
        console.log(attachments);
      }
      if (attachments.length === 0)
        return (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '14px' }}>Không đính kèm tệp</Typography>
          </Box>
        );
      return (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%'
          }}
        >
          {attachments.map((file) => {
            return (
              <Box sx={{ width: '100%', height: '100%' }} key={file.url}>
                <a href={file.url} target="_blank" download>
                  <RenderFile
                    url={file.url}
                    style={{ width: '100%', height: '100%' }}
                    type={file.file_type}
                    fileName={file.file_name}
                  />
                </a>
              </Box>
            );
          })}
        </Box>
      );
    }
  },
  { field: 'content', headerClassName: 'header-custom', headerName: 'Message Content', width: 250 },
  {
    field: 'sender',
    headerClassName: 'header-custom',
    headerName: 'Send By',
    width: 250,
    renderCell: (params) => {
      return (
        <Stack direction="row" spacing={1} alignItems={'center'} sx={{ height: '100%' }}>
          <Avatar src={params.row.sender.avatar} alt={params.row.sender.name} />
          <Typography>{params.row.sender.name}</Typography>
        </Stack>
      );
    }
  },
  { field: 'chatId', headerClassName: 'header-custom', headerName: 'Chat', width: 200 },
  { field: 'isGroup', headerClassName: 'header-custom', headerName: 'Group Chat', width: 200 },
  {
    field: 'createdAt',
    headerClassName: 'header-custom',
    headerName: 'Time',
    width: 250,
    renderCell: (params) => {
      return (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '14px' }}>
            {moment(params.row.create).format('MMMM Do YYYY, h:mm:ss A')}
          </Typography>
        </Box>
      );
    }
  }
];
const MessageManage = () => {
  const getMessageQuery = useQuery({
    queryKey: ['messageData'],
    queryFn: () => getMessageAdminApi()
  });
  const data = useMemo(() => {
    return getMessageQuery.data?.data?.result || [];
  }, [getMessageQuery.data]);
  const [rowsData, setRowsData] = useState([]);
  useEffect(() => {
    if (data.length > 0) {
      setRowsData(
        data.map((message) => ({
          ...message,
          id: message._id,
          chatId: message.chat._id,
          isGroup: message.chat.isGroup
        }))
      );
    }
  }, [data]);
  return (
    <Container sx={{ background: COLOR.GREY_LIGHT, width: '100%', height: '100vh' }}>
      <Paper elevation={2} sx={{ borderRadius: '10px', boxShadow: 'none', padding: '20px 0' }}>
        <Typography sx={{ fontSize: '32px', textAlign: 'center' }}>All Messages</Typography>
      </Paper>
      <Box sx={{ height: '80%', width: '100%' }}>
        <TableDataGrid columns={columns} rows={rowsData} rowHeight={120} />
      </Box>
    </Container>
  );
};

export default MessageManage;
