import Header from './Header/header';
import Sidebar from './Sidebar/sidebar';
import { Box, CssBaseline, Stack } from '@mui/material';

function DefaultLayout({ children }) {
  return (
    <Box>
      <CssBaseline />
      <Stack direction="row" justifyContent="space-between">
        <Sidebar />
        <Stack flex={6}>
          <Header />
          <Box p={2}>
            {children}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}

export default DefaultLayout;
