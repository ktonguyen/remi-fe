
import { styled } from '@mui/material/styles';
import { Container, Grid } from '@mui/material';
import useResponsive from '../hooks/useResponsive';

import ShareForm from 'containers/ShareForm';
import { getSession } from "next-auth/react";
import { GetServerSideProps } from 'next';
import { User } from 'model/user';
import Layout from '../layout';

interface PrivatePageProps {
  user: User | null;
}

export default function SharePage() {
  const mdUp = useResponsive('up', 'md');

  return (
    <Layout>
      <Container maxWidth="xl">
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8}>
            <ShareForm />
          </Grid>
        </Grid>
        
      </Container>
    </Layout>
  );
}
export const getServerSideProps: GetServerSideProps<PrivatePageProps> = async ({ req, res }) =>  {
  const session = await getSession({ req });
  if (!session?.user?.id) {
    res.setHeader('location', '/signin');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: { user: session.user },
  };
}