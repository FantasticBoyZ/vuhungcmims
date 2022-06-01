import Header from './Header';
import Sidebar from './Sidebar';
import { Box, CssBaseline, Stack } from '@mui/material';

function DefaultLayout({ children }) {
  return (
    <Box>
      <CssBaseline />
      <Stack direction="row" justifyContent="space-between">
        <Sidebar />
        <Stack flex={6}>
          <Header />
          <Box bgcolor="pink" p={2}>
            {children}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}

export default DefaultLayout;
