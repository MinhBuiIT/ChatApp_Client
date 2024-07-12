import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LoadingButton from '@mui/lab/LoadingButton';
import { Avatar, Box, Container, IconButton, Paper, Stack, Typography } from '@mui/material';
import { blue, grey, red } from '@mui/material/colors';
import { useMutation } from '@tanstack/react-query';
import lodash from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { loginApi, registerApi } from '../apis/auth.js';
import ContainerBackground from '../components/ContainerBackground/ContainerBackground.jsx';
import FormInputText from '../components/FormInputText';
import Styling from '../components/Styling';
import { userExist } from '../redux/Auth/authSlice.js';
import {
  bioValidator,
  nameValidator,
  passwordLoginValidator,
  passwordValidator,
  usernameLoginValidator,
  usernameValidator
} from '../utils/validation';

const { VisualInput } = Styling;
const Login = () => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm();
  const loginForm = useForm();
  const [preview, setPreview] = useState();
  const [isLogin, setIsLogin] = useState(true);
  const toggleLogin = () => {
    setIsLogin((pre) => !pre);
  };
  const registerMutation = useMutation({
    mutationFn: (body) => registerApi(body)
  });
  const loginMutation = useMutation({
    mutationFn: (body) => loginApi(body)
  });
  const dispatch = useDispatch();

  //Xử lý preview ảnh
  const fileAvatar = watch('upload_avatar');
  useEffect(() => {
    if (!fileAvatar) {
      setPreview(undefined);
      return;
    }
    const file = fileAvatar[0];

    if (file.size > 500000) {
      setError('upload_avatar', { error: 'File too large' });
      return;
    }
    const objectUrl = window.URL.createObjectURL(new Blob([file], { type: file.type }));
    setPreview(objectUrl);
    clearErrors('upload_avatar');
    // free memory when ever this component is unmounted
    return () => window.URL.revokeObjectURL(objectUrl);
  }, [fileAvatar, setError, clearErrors]);

  //Xử lý submit
  const onSubmitRegister = handleSubmit((data) => {
    const formData = new FormData();
    for (const key in data) {
      if (key === 'upload_avatar') {
        formData.append('avatar', data[key][0]);
        continue;
      }
      formData.append(key, data[key]);
    }

    registerMutation.mutate(formData, {
      onSuccess: (data) => {
        dispatch(userExist({ user: lodash.omit(data.data.result, ['password', '__v']) }));
        //reload lại trang khi login thành công
        window.location.reload();
        toast.success(data.data.message || 'Register successful');
      },
      onError: (error) => {
        if (error.response?.status === 422) {
          const errorsRes = error.response?.data?.result?.errors;
          if (errorsRes) {
            for (const key in errorsRes) {
              loginForm.setError(key, { message: errorsRes[key]?.msg || 'Error Data' });
            }
          }
          return;
        }
        toast.error(error.response.data.message || 'Register failed');
      }
    });
  });
  const onSubmitLogin = loginForm.handleSubmit((data) => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        dispatch(userExist({ user: lodash.omit(data.data.result, ['password', '__v']) }));
        //reload lại trang khi login thành công
        window.location.reload();
        toast.success(data.data.message || 'Login successful');
      },
      onError: (error) => {
        if (error.response?.status === 422) {
          const errorsRes = error.response?.data?.result?.errors;
          if (errorsRes) {
            for (const key in errorsRes) {
              loginForm.setError(key, { message: 'User or Password invalid' });
            }
          }
          return;
        }
        toast.error(error.response?.data?.message || 'Login failed');
      }
    });
  });
  return (
    <ContainerBackground>
      <Container
        maxWidth="xs"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}
      >
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '20px',
            width: '100%'
          }}
        >
          {isLogin ? (
            <>
              <Typography variant={'h5'}>Login</Typography>
              <Box component={'form'} noValidate sx={{ width: '100%', marginTop: '20px' }} onSubmit={onSubmitLogin}>
                <Stack spacing={2}>
                  <FormInputText
                    errors={loginForm.formState.errors}
                    control={loginForm.control}
                    name="username"
                    variant={'outlined'}
                    rules={usernameLoginValidator}
                    type="text"
                    fullWidth
                    label="Tên đăng nhập"
                    disabled={loginMutation.isPending}
                  />
                  <FormInputText
                    errors={loginForm.formState.errors}
                    control={loginForm.control}
                    name="password"
                    variant={'outlined'}
                    rules={passwordLoginValidator}
                    fullWidth
                    label="Mật khẩu"
                    type="password"
                    disabled={loginMutation.isPending}
                  />
                  <LoadingButton variant="contained" type="submit" loading={loginMutation.isPending}>
                    Đăng Nhập
                  </LoadingButton>
                </Stack>
                <Typography textAlign={'center'} mt={2}>
                  Hoặc
                </Typography>
                <Typography
                  sx={{ cursor: 'pointer' }}
                  color={blue[500]}
                  textAlign={'center'}
                  mt={2}
                  onClick={toggleLogin}
                >
                  Đăng Ký
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Typography variant={'h5'}>Register</Typography>

              <Box component={'form'} onSubmit={onSubmitRegister} noValidate sx={{ width: '100%' }}>
                <Box mt={2} sx={{ position: 'relative', display: 'flex', align: 'center', justifyContent: 'center' }}>
                  <IconButton
                    component="label"
                    sx={{
                      background: 'rgba(0,0,0,0.4)',
                      '&:hover': { background: 'rgba(0,0,0,0.2)' },
                      position: 'absolute',
                      bottom: '-5px',
                      transform: 'translateX(66%)',
                      zIndex: 1
                    }}
                  >
                    <PhotoCameraIcon style={{ color: grey[300] }} />
                    <VisualInput
                      disabled={registerMutation.isPending}
                      onChange={(e) => setValue('upload_avatar', e.target.files)}
                      type="file"
                      name="upload_avatar"
                      {...register('upload_avatar', { required: 'Avatar is required' })}
                      accept="image/*"
                    />
                  </IconButton>
                  <Avatar sx={{ width: 85, height: 85 }} src={preview} />
                </Box>
                <Box mb={4}>
                  {errors.upload_avatar && (
                    <Typography color={red[600]} fontSize={14} textAlign={'center'}>
                      {errors.upload_avatar.message || errors.upload_avatar.error}
                    </Typography>
                  )}
                </Box>
                <Stack spacing={2}>
                  <FormInputText
                    disabled={registerMutation.isPending}
                    name="name"
                    control={control}
                    label="Tên người dùng"
                    rules={nameValidator}
                    errors={errors}
                  />
                  <FormInputText name="bio" control={control} label="Mô tả" rules={bioValidator} errors={errors} />
                  <FormInputText
                    disabled={registerMutation.isPending}
                    name="username"
                    control={control}
                    label="Tên đăng nhập"
                    rules={usernameValidator}
                    errors={errors}
                  />
                  <FormInputText
                    disabled={registerMutation.isPending}
                    name="password"
                    control={control}
                    label="Mật khẩu"
                    rules={passwordValidator}
                    errors={errors}
                    type="password"
                  />
                  {/* <TextField variant={'outlined'} type="text" fullWidth label="Tên người dùng" />
                <TextField variant={'outlined'} type="text" fullWidth label="Mô tả" />
                <TextField variant={'outlined'} type="text" fullWidth label="Tên đăng nhập" />
                <TextField variant={'outlined'} fullWidth label="Mật khẩu" type="password" /> */}
                  <LoadingButton variant="contained" fullWidth type="submit" loading={registerMutation.isPending}>
                    Đăng Ký
                  </LoadingButton>
                </Stack>
                <Typography textAlign={'center'} mt={2}>
                  Hoặc
                </Typography>
                <Typography
                  sx={{ cursor: 'pointer' }}
                  color={blue[500]}
                  textAlign={'center'}
                  mt={2}
                  onClick={toggleLogin}
                >
                  Đăng Nhập
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </ContainerBackground>
  );
};
export default Login;
