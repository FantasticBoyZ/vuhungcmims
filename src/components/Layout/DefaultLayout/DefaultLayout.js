import Header from '@/components/Layout/DefaultLayout/Header/Header';
import Sidebar from '@/components/Layout/DefaultLayout/Sidebar/SideBar';
import { Box, CssBaseline, Stack } from '@mui/material';
import { useTheme } from '@mui/styles';

function DefaultLayout({ children }) {
  const theme = useTheme()
  return (
    <Box>
      <CssBaseline />
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ backgroundColor: theme.palette.sidebar.main}}
      >
        <Sidebar />
        <Stack flex={6}>
          <Header />
          <Box sx={{ backgroundColor: '#fbfbfb', minHeight: '94vh'}} p={2}>{children}</Box>
        </Stack>
      </Stack>
    </Box>
  );
}

export default DefaultLayout;
