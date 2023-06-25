import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Layout from '../layout';

export default function DashboardAppPage() {
  const theme = useTheme();

  return (
    <Layout>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          
        </Grid>
      </Container>
    </Layout>
  );
}