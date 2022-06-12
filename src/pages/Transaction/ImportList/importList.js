import SelectWrapper from '@/components/FormsUI/Select';
import ImportOrders from '@/pages/Transaction/ImportList/ImportOrders';
import { Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Form, Formik } from 'formik';

const useStyles = makeStyles({
  searchField: {
    width: '30%',
  },
  toolbar: {
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  selectBox: {
    width: '50%',
  },
});

const createrList = {
  1: 'Vũ Tiến Khôi',
  2: 'Trịnh Bá Minh Ninh',
  3: 'Nguyễn Thị Hiền',
  4: 'Nguyễn Đức Chính',
  5: 'Dương Đức Trọng',
};

const ImportList = () => {
  const classes = useStyles();
  return (
    <Container maxWidth="xl">
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
        p={2}
      >
        <Button
          variant="contained"
          color="secondary"
        >
          Thêm mới
        </Button>
        <Button variant="contained">Xuất file excel</Button>
        <Button variant="contained">Nhập file excel</Button>
      </Stack>
      <Toolbar className={classes.toolbar}>
        <TextField
          id="outlined-basic"
          placeholder="Search"
          label={null}
          variant="outlined"
          className={classes.searchField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          // onChange={handleSearch}
        />
        <Box className={classes.selectBox}>
          <Formik
            initialValues={{
              creater: '1',
            }}
            // validationSchema={FORM_VALIDATION}
            // onSubmit={handleLogin}
          >
            <Form>
              <Stack
                direction="row"
                spacing={2}
              >
                <SelectWrapper
                  label="Người tạo"
                  name="creater"
                  options={createrList}
                />
              </Stack>
            </Form>
          </Formik>
        </Box>
      </Toolbar>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid
          item
          xs={12}
        >
          <ImportOrders />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ImportList;
