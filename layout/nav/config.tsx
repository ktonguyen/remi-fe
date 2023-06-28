import React from 'react';
import SvgColor from '../../components/svgColor';
import HomeIcon from '@mui/icons-material/Home';
import IosShareIcon from '@mui/icons-material/IosShare';

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
}

const navConfig: NavItem[] = [
  {
    title: 'Home',
    path: '/',
    icon: <HomeIcon />,
  },
  {
    title: 'Share Video',
    path: '/share',
    icon: <IosShareIcon/>,
  },
];

export default navConfig;
