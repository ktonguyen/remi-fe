import { styled, CSSObject } from '@mui/material/styles';
import { ListItemIcon, ListItemButton } from '@mui/material';
import { ReactNode } from 'react';

interface StyledNavItemProps {
  children?: ReactNode;
  className?: string;
  disableGutters?: boolean;
  sx?: CSSObject;
  to: string;
}

export const StyledNavItem = styled((props: StyledNavItemProps) => (
  <ListItemButton disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
}));

export const StyledNavItemIcon = styled(ListItemIcon)({
  width: 22,
  height: 22,
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
