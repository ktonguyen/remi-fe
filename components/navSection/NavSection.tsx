import { Box, List, ListItemText } from '@mui/material';
import { ReactNode } from 'react';
import { StyledNavItem, StyledNavItemIcon } from './styles';

interface NavSectionProps {
  data?: Array<{
    title: string;
    path: string;
    icon: ReactNode;
    info?: ReactNode;
  }>;
}

export default function NavSection({ data = [], ...other }: NavSectionProps) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List>
    </Box>
  );
}

interface NavItemProps {
  item: {
    title: string;
    path: string;
    icon: ReactNode;
    info?: ReactNode;
  };
}

function NavItem({ item }: NavItemProps) {
  const { title, path, icon, info } = item;

  return (
    <StyledNavItem
      to={path}
      sx={{
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
      <ListItemText disableTypography primary={title} />
      {info && info}
    </StyledNavItem>
  );
}
