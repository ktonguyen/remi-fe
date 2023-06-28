
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
import useResponsive from '../hooks/useResponsive';
import SignupForm from 'containers/SignupForm';
import { getSession } from "next-auth/react";
import { GetServerSideProps, NextPage } from 'next';
import { User } from 'model/user';
  
interface PrivatePageProps {
    user: User | null;
}

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');
  return (
    <>
      <StyledRoot>

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Welcome, Funny Video
            </Typography>
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Sign up to Funny Video
            </Typography>

            <Typography variant="body2" sx={{ mb: 5 }}>
              Do you have an account? {''}
              <Link variant="subtitle2" href="/signin" >Sign in</Link>
            </Typography>

            <SignupForm />
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PrivatePageProps> = async ({ req, res }) =>  {
    const session = await getSession({ req });
    console.log("token", session)
    if (session?.user?.id) {
      res.setHeader('location', '/');
      res.statusCode = 302;
      res.end();
      return { props: { user: session?.user} };
    }
  
    return {
      props: { },
    };
}