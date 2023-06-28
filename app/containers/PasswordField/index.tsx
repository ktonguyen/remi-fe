import { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import Iconify from '../../../components/iconify';

export default function PasswordField(props:any) {

  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
        {...props}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
        endAdornment: (
            <InputAdornment position="end">
            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
            </IconButton>
            </InputAdornment>
        ),
        }}
    />
  );
}