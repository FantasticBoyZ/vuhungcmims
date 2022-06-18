import { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import CommonTable from '@/components/Common/CommonTable';
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
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  searchField: {
    width: '30%',
    marginRight: '57px',
  },
  icons: {
    color: 'gray',
    marginRight: '10px',
  },
  form: {
    display: 'flex',
    padding: '3%',
  },
});

const headCells = [
  { id: 'username', label: 'Họ Tên' },
  { id: 'role', label: 'Vị trí làm việc' },
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' },
  { id: 'active', label: 'Active' },
];

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
  return (
    <>
      <Paper>
        <Formik>
          <Form className={classes.form}>
            <Box className={classes.searchField}>
              <TextfieldWrapper
                id="outlined-basic"
                name="productName"
                placeholder="Search"
                label={null}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Button
              variant="contained"
              color="secondary"
            >
              Thêm mới
            </Button>
          </Form>
        </Formik>

        <Box>
          <TblContainer>
            <TblHead />
            <TableBody>
              {staffLists.map((item) => (
                <TableRow
                  key={item?.id}
                  //   onClick={() => handleOnClickTableRow(item.id)}
                >
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
                  {/* <TableCell> */}
                  {/* <EditIcon className={classes.icons} /> */}
                  {/* <img
                      src="/src/assets/images/edit.svg"
                      className="mx-1"
                      alt=""
                    /> */}
                  {/* <VisibilityIcon className={classes.icons} /> */}
                  {/* <img
                      src="src/assets/images/view.svg"
                      className="mx-1"
                      alt=""
                    /> */}
                  {/* </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </TblContainer>
        </Box>
      </Paper>
    </>
  );
};

export default StaffList;
