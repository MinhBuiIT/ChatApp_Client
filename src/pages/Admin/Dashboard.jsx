import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';
import MessageOutlined from '@mui/icons-material/MessageOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import { Box, Button, Container, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { getStatsAdminApi } from '../../apis/admin';
import DoughnutChart from '../../components/DoughnutChart';
import LineChart from '../../components/LineChart';
import Styling from '../../components/Styling';

const { InputCustomCicrle } = Styling;
const Dashboard = () => {
  const getStatsQuery = useQuery({
    queryKey: ['stats'],
    queryFn: () => getStatsAdminApi()
  });
  const data = getStatsQuery.data?.data?.result || {};
  return (
    <>
      {getStatsQuery.isLoading ? (
        <Box width={'100%'}>
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
          <Skeleton animation="wave" />
        </Box>
      ) : (
        <Container maxWidth="md" sx={{ height: '100vh', padding: '24px 0' }}>
          <Paper
            elevation={2}
            sx={{
              padding: '20px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              width: '100%'
            }}
          >
            <AdminPanelSettingsTwoToneIcon />
            <Box component={'form'} flexGrow={1} sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <InputCustomCicrle placeholder="Search..." sx={{ width: '50%' }} />
              <Button
                sx={{
                  borderRadius: '100px',
                  color: 'white',
                  background: '#000',
                  textTransform: 'capitalize',
                  fontSize: '14px',
                  padding: '8px 16px'
                }}
              >
                Search
              </Button>
            </Box>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              <Typography sx={{ fontSize: '15px', color: grey[500], display: { xs: 'none', md: 'block' } }}>
                {moment().format('dddd, MMMM Do YYYY')}
              </Typography>
              <NotificationsNoneOutlinedIcon />
            </Stack>
          </Paper>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={'center'}
            justifyContent={'center'}
            spacing={2}
            sx={{
              marginTop: '20px',
              maxWidth: '100%',
              flexWrap: 'wrap'
            }}
          >
            <Paper
              elevation={2}
              sx={{
                height: '320px',
                padding: '20px',
                borderRadius: '8px',
                width: { xs: '94%', sm: '420px', md: '63%' }
              }}
            >
              <Typography sx={{ fontSize: '24px', marginBottom: '10px' }}>Last Message</Typography>
              <Box sx={{ width: '100%' }}>
                <LineChart dataArr={data?.messageAmountInWeek} />
              </Box>
            </Paper>
            <Paper
              elevation={2}
              sx={{
                height: '320px',
                padding: '20px',
                borderRadius: '8px',
                width: { xs: '94%', sm: '350px', md: '33%' },
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '54%',
                  left: '50%',
                  transform: 'translate(-50%,-50%)',
                  display: 'flex'
                }}
              >
                <Person2OutlinedIcon />
                <Typography>Vs</Typography>
                <PeopleOutlinedIcon />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  width: '100%'
                }}
              >
                <DoughnutChart
                  dataArr={[data?.totalChat - data?.totalGroupChat, data?.totalGroupChat]}
                  sx={{ with: '100%' }}
                />
              </Box>
            </Paper>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              width={'100%'}
              alignItems={'center'}
              justifyContent={'center'}
              style={{ marginTop: '20px' }}
            >
              <Paper
                sx={{
                  width: { xs: '85%', sm: '30%' },
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '80px',
                    height: '80px',
                    border: '3px solid #000',
                    borderRadius: '50%'
                  }}
                >
                  <Typography sx={{ fontSize: '20px', color: '#000' }}>{data?.totalUser}</Typography>
                </Box>
                <Stack direction={'row'} spacing={2} alignItems={'center'} sx={{ marginTop: '16px' }}>
                  <Person2OutlinedIcon />
                  <Typography sx={{ fontSize: '16px', color: grey[800] }}>Users</Typography>
                </Stack>
              </Paper>
              <Paper
                sx={{
                  width: { xs: '85%', sm: '30%' },
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '80px',
                    height: '80px',
                    border: '3px solid #000',
                    borderRadius: '50%'
                  }}
                >
                  <Typography sx={{ fontSize: '20px', color: '#000' }}>{data?.totalGroupChat}</Typography>
                </Box>
                <Stack direction={'row'} spacing={2} alignItems={'center'} sx={{ marginTop: '16px' }}>
                  <PeopleOutlinedIcon />
                  <Typography sx={{ fontSize: '16px', color: grey[800] }}>Groups</Typography>
                </Stack>
              </Paper>
              <Paper
                sx={{
                  width: { xs: '85%', sm: '30%' },
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '80px',
                    height: '80px',
                    border: '3px solid #000',
                    borderRadius: '50%'
                  }}
                >
                  <Typography sx={{ fontSize: '20px', color: '#000' }}>{data?.totalMessage}</Typography>
                </Box>
                <Stack direction={'row'} spacing={2} alignItems={'center'} sx={{ marginTop: '16px' }}>
                  <MessageOutlined />
                  <Typography sx={{ fontSize: '16px', color: grey[800] }}>Messages</Typography>
                </Stack>
              </Paper>
            </Stack>
          </Stack>
        </Container>
      )}
    </>
  );
};

export default Dashboard;
