import { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import CommonTable from '@/components/Common/CommonTable';
import SelectWrapper from '@/components/FormsUI/Select';
import TextfieldWrapper from '@/components/FormsUI/Textfield';
import { Search } from '@mui/icons-material';
import {
  Box,
  Button,
  Paper,
  Stack,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Toolbar,
  Switch,
  InputAdornment,
  Container,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { width } from '@mui/system';

const useStyles = makeStyles({
  searchField: {
    width: '40%',
  },
  icons: {
    color: 'gray',
    marginRight: '10px',
  },
  form: {
    display: 'flex',
    padding: '2% 4%',
    width: '100%',
    justifyContent: 'space-between',
  },
  styleTable: {
    padding: '0 0 2% 0',
  },
  styleButton: {
    paddingBottom: '2%',
  },
  selectBox: {
    width: '30%',
  },
});

const headCells = [
  { id: 'username', label: 'Họ Tên' },
  { id: 'role', label: 'Vị trí làm việc' },
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' },
  { id: 'active', label: 'Active' },
  { id: 'action', label: 'Action' },
];

const createrList = {
  1: 'Quản lý',
  2: 'Thủ kho',
  3: 'Seller',
};

const StaffList = () => {
  const staffLists = [
    {
      id: '1',
      username: 'Vũ Tiến Khôi',
      role: 'Seller',
      phone: '0123456789',
      email: 'khoi@gmail.com',
    },
    {
      id: '2',
      username: 'Tri Ba Minh Ninh',
      role: 'Seller',
      phone: '0123456789',
      email: 'khoi@gmail.com',
    },
  ];

  const classes = useStyles();
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const { TblContainer, TblHead } = CommonTable(productList, headCells);

  const handleOnClickTableRow = (staffId) => {
    navigate(`/staff/${staffId}`);
  };

  const handleOnClickAdd = () => {
    navigate(`/staff/add`);
  };
  return (
    <Container>
      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
        p={2}
      >
        <Button
          className={classes.styleButton}
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => handleOnClickAdd()}
        >
          Thêm mới
        </Button>
      </Stack>
      <Paper>
        <Toolbar className={classes.form}>
          <TextField
            id="outlined-basic"
            placeholder="Tìm kiếm"
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
            >
              <Form>
                <Stack direction="row">
                  <SelectWrapper
                    label="Vị trí việc làm"
                    name="creater"
                    options={createrList}
                  />
                </Stack>
              </Form>
            </Formik>
          </Box>
        </Toolbar>
      </Paper>

      <Paper>
        <Box className={classes.styleTable}>
          <TblContainer>
            <TblHead />
            <TableBody>
              {staffLists.map((item) => (
                <TableRow key={item?.id}>
                  <TableCell>{item.username}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{item.phone}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <Switch
                      // checked={checked}
                      // onChange={handleChange}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </TableCell>
                  <TableCell>
                    <ModeEditIcon className={classes.icons} />
                    <VisibilityIcon
                      className={classes.icons}
                      onClick={() => handleOnClickTableRow(item.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TblContainer>
        </Box>
      </Paper>
    </Container>
  );
};

export default StaffList;
