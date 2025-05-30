import React from 'react';
import { Link as MuiLink, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface CustomLinkProps {
  to?: string;
  children: React.ReactNode;
}

const CustomLink: React.FC<CustomLinkProps> = ({ to, children }) => {
  return (
    <MuiLink
      component={RouterLink}
      to={to ?? ""}
      underline="hover"
      sx={{
        cursor: 'pointer',
        '&:hover': {
          textDecorationColor: '#37474f',
        },
      }}
    >
      <Typography variant="h6" sx={{ ml: 1, color: '#37474f' }}>
        {children}
      </Typography>
    </MuiLink>
  );
};

export default CustomLink;
