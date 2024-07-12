import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';

const FormInputText = (props) => {
  const { name, control, label, rules, errors, ...rest } = props;
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={rules}
      render={({ field }) => (
        <TextField
          {...field}
          {...rest}
          label={label}
          variant="outlined"
          fullWidth
          margin="normal"
          error={!!errors[name]}
          helperText={errors[name] ? errors[name].message : ''}
        />
      )}
    />
  );
};
export default FormInputText;
