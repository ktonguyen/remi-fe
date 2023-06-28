import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Button, Link } from '@mui/material';
import Iconify from '../../components/iconify';
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import { useSession } from 'next-auth/react';

const NAV_WIDTH = 280;
const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(8px)', 
  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

interface HeaderProps {
  onOpenNav: () => void;
}

export default function Header({ onOpenNav }: HeaderProps) {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  if (loading) {
    return <></>;
  }
  return (
    <StyledRoot>
      <StyledToolbar>
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          {session && session?.user?.email && (
            <AccountPopover user={session.user} />
            
          )}
          {(!session || !session?.user) && (
            <Button href="/signin" variant="contained" color="primary">
              Sign In
            </Button>
          )}
          
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
