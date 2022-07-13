import Label from '@/components/Common/Label';
import { PersonSearch, Search } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Grid,
  InputAdornment,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const useStyles = makeStyles({
  selectBox: {
    width: '200px',
  },
  searchButton: {
    width: '170px',
    fontSize: '20px',
  },
  table: {
    '& thead th': {
      backgroundColor: '#DCF4FC',
    },
    '& tbody td': {},
    '& tbody tr:hover': {
      cursor: 'pointer',
    },
  },
  imgStaff: {
    width: '120px',
    height: '120px',
  },
});

const optionsSearch = [
  { value: 'staffName', label: 'Tên' },
  { value: 'staffCode', label: 'Mã nhân viên' },
  { value: 'phone', label: 'Số điện thoại' },
];

const getRoleLabel = (exportOrderStatus) => {
  const map = {
    storekeeper: {
      text: 'Thủ kho',
      color: 'warning',
    },
    seller: {
      text: 'Nhân viên bán hàng',
      color: 'primary',
    },
  };

  const { text, color } = map[exportOrderStatus];

  return <Label color={color}>{text}</Label>;
};

const StaffList = () => {
  const staffLists = [
    {
      id: '1',
      username: 'khoivt',
      imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
      fullname: 'Vũ Tiến Khôi',
      role: 'seller',
      phone: '0987654321',
      email: 'khoivt@gmail.com',
      isActive: true,
    },
    {
      id: '2',
      username: 'ninhtbm',
      imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
      fullname: 'Trịnh Bá Minh Ninh',
      role: 'storekeeper',
      phone: '0123456789',
      email: 'ninhtbm@gmail.com',
      isActive: false,
    },
  ];

  const classes = useStyles();
  const navigate = useNavigate();
  const [searchBy, setSearchBy] = useState('staffName');

  const handleOnClickDetail = (staffId) => {
    navigate(`/staff/detail/${staffId}`);
  };

  const handleOnClickAdd = () => {
    navigate(`/staff/add`);
  };
  return (
    <Grid
      container
      spacing={2}
    >
      <Grid
        xs={12}
        item
      >
        <Card>
          <CardHeader title="Tìm kiếm thông tin nhân viên" />
          <Stack
            direction="row"
            spacing={2}
            p={2}
          >
            <TextField
              id="outlined-basic"
              name="keyword"
              placeholder="Tìm kiếm nhân viên"
              fullWidth
              label={null}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              // onKeyDown={handleSearch}
              // onChange={handleSearchChange}
            />
            <Select
              classNamePrefix="select"
              className={classes.selectBox}
              // placeholder="Danh mục"
              // noOptionsMessage={() => <>Không có tìm thấy danh mục phù hợp</>}
              // isClearable={true}
              // isSearchable={true}
              name="searchBy"
              value={optionsSearch.filter((option) => option.value === searchBy)}
              options={optionsSearch}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                control: (base) => ({
                  ...base,
                  height: 56,
                  minHeight: 56,
                }),
              }}
              onChange={(e) => setSearchBy(e.value)}
            />
            <Button
              variant="contained"
              startIcon={<PersonSearch />}
              className={classes.searchButton}
            >
              Tìm kiếm
            </Button>
          </Stack>
        </Card>
      </Grid>
      <Grid
        xs={12}
        item
      >
        <Card>
          <CardHeader title="Nhân viên" />
          <CardContent>
            <TableContainer>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Mã nhân viên</TableCell>
                    <TableCell align="center">Ảnh</TableCell>
                    <TableCell align="center">Tên nhân viên</TableCell>
                    <TableCell align="center">Số điện thoại</TableCell>
                    <TableCell align="center">Chức vụ</TableCell>
                    <TableCell align="center">Trạng thái động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {staffLists.map((staff) => {
                    return (
                      <TableRow hover onClick={() => handleOnClickDetail(staff.id)}>
                        <TableCell align="center">{staff.username}</TableCell>
                        <TableCell align="center">
                          <img
                            className={classes.imgStaff}
                            src={staff.imgUrl}
                          />
                        </TableCell>
                        <TableCell align="center">{staff.fullname}</TableCell>
                        <TableCell align="center">{staff.phone}</TableCell>
                        <TableCell align="center">{getRoleLabel(staff.role)}</TableCell>
                        <TableCell
                          align="center"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <FormControlLabel
                            value="bottom"
                            // TODO: set checked = active
                            control={
                              <Switch
                                checked={staff.isActive}
                                color="success"
                              />
                            }
                            label={staff.isActive ? "Đang hoạt động" : "Đã ngưng hoạt động"}
                            labelPlacement="bottom"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StaffList;
