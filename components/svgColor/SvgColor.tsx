import { Box, BoxProps } from '@mui/material';
import { forwardRef, ForwardedRef } from 'react';

interface SvgColorProps extends BoxProps {
  src?: string;
}

const SvgColor = forwardRef(function SvgColor(
  { src, sx, ...other }: SvgColorProps,
  ref: ForwardedRef<HTMLSpanElement>
) {
  return (
    <Box
      component="span"
      className="svg-color"
      ref={ref}
      sx={{
        width: 24,
        height: 24,
        display: 'inline-block',
        bgcolor: 'currentColor',
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        ...sx,
      }}
      {...other}
    />
  );
});

export default SvgColor;
