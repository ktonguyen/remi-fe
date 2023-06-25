import { Box, BoxProps } from '@mui/material';
import { forwardRef, ForwardedRef, ReactElement, ReactText } from 'react';
import { Icon } from '@iconify/react';

interface IconifyProps extends BoxProps {
  icon: ReactElement | ReactText;
  width?: number | string;
}

const Iconify = forwardRef(function Iconify(
  { icon, width = 20, sx, ...other }: IconifyProps,
  ref: ForwardedRef<HTMLSpanElement>
) {
  return (
    <Box
      ref={ref}
      component={Icon}
      icon={icon}
      sx={{ width, height: width, ...sx }}
      {...other}
    />
  );
});

export default Iconify;
