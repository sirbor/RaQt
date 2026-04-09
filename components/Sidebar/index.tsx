import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { SIGN_IN_HUB_PATH } from 'lib/authEntry';

const ink = '#1a1a1a';

const links = [
  { title: 'Solutions', href: '/#solutions' },
  { title: 'Use cases', href: '/#use-cases' },
  { title: 'Pricing', href: '/#pricing' },
  { title: 'Book A Demo', href: SIGN_IN_HUB_PATH },
];

const Sidebar: React.FC<any> = ({ setOpen, open }) => {
  const list = () => (
    <Box sx={{ width: 300, pt: 1, bgcolor: '#ffffff' }} role="presentation">
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1 }}>
        <IconButton onClick={setOpen} aria-label="Close menu" size="large">
          <CloseIcon sx={{ color: ink }} />
        </IconButton>
      </Box>
      <List disablePadding sx={{ px: 1.5, pb: 2 }}>
        {links.map((item) => (
          <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              href={item.href}
              onClick={setOpen}
              sx={{
                borderRadius: 1,
                py: 1.25,
                border: '1px solid rgba(26, 26, 26, 0.06)',
                bgcolor: '#ffffff',
                '&:hover': { bgcolor: '#ffffff', borderColor: 'rgba(166, 139, 91, 0.45)' },
              }}>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: ink,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={setOpen}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
          boxShadow: '0 24px 48px rgba(26, 26, 26, 0.1)',
          borderLeft: '1px solid rgba(166, 139, 91, 0.35)',
        },
      }}>
      {list()}
    </Drawer>
  );
};

export default Sidebar;
