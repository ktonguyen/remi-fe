import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Layout from '../layout';
import Home from 'containers/Home';

export default function DashboardAppPage() {
  return (
    <Layout>
      <Container maxWidth="md">
        <Home />
      </Container>
    </Layout>
  );
}