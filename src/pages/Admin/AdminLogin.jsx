import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginAdminApi } from '../../apis/admin';
import ContainerBackground from '../../components/ContainerBackground/ContainerBackground';
import RoutePath from '../../constants/route';
import { adminExist } from '../../redux/Auth/authSlice';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [secretKey, setSecretKey] = useState('');
  const dispatch = useDispatch();
  const loginMutation = useMutation({
    mutationFn: (data) => loginAdminApi(data)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const toastId = toast.loading('Loading...');
    loginMutation.mutate(
      { secret_key: secretKey },
      {
        onSuccess: (res) => {
          toast.update(toastId, { render: res.data?.message, type: 'success', isLoading: false, autoClose: 2000 });
          dispatch(adminExist());
          navigate(RoutePath.adminDashboard);
        },
        onError: (err) => {
          toast.update(toastId, {
            render: err.response.data?.message,
            type: 'error',
            isLoading: false,
            autoClose: 2000
          });
        }
      }
    );
  };
  return (
    <ContainerBackground>
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Paper elevation={2} sx={{ padding: '24px', borderRadius: '8px', width: '300px' }}>
          <Typography variant="h5" textAlign={'center'}>
            Admin Login
          </Typography>
          <Box component={'form'} mt={2} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              label="Secret Key"
              fullWidth
              type="password"
              onChange={(e) => setSecretKey(e.target.value)}
            />
            <Button type="submit" variant="contained" sx={{ width: '100%', textAlign: 'center', marginTop: '16px' }}>
              Xác nhận
            </Button>
          </Box>
        </Paper>
      </Box>
    </ContainerBackground>
  );
};

export default AdminLogin;
