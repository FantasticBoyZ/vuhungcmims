import AlertPopup from '@/components/Common/AlertPopup';
import Label from '@/components/Common/Label';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import CustomTablePagination from '@/components/Common/TablePagination';
import { API_URL_IMAGE } from '@/constants/apiUrl';
import { getStaffList, setActiveForStaff } from '@/slices/StaffSlice';
import { PersonSearch, Search } from '@mui/icons-material';
import {
  Box,
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
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';

const useStyles = makeStyles({
  selectBox: {
    width: '200px',
  },
  searchButton: {
    width: '170px',
    fontSize: '18px',
    maxHeight: '56px'
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
  { value: 'fullName', label: 'Tên' },
  { value: 'userName', label: 'Mã nhân viên' },
  { value: 'phone', label: 'Số điện thoại' },
];

const getRoleLabel = (exportOrderStatus) => {
  const map = {
    ROLE_STOREKEEPER: {
      text: 'Thủ kho',
      color: 'warning',
    },
    ROLE_SELLER: {
      text: 'Nhân viên bán hàng',
      color: 'primary',
    },
    ROLE_OWNER: {
      text: 'Chủ kho',
      color: 'error',
    },
  };

  const { text, color } = map[exportOrderStatus];

  return <Label color={color}>{text}</Label>;
};
const staffLists = [
  {
    id: '1',
    username: 'khoivt',
    imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
    fullname: 'Vũ Tiến Khôi',
    role: 'seller',
    phone: '0987654321',
    email: 'khoivt@gmail.com',
    active: true,
  },
  {
    id: '2',
    username: 'ninhtbm',
    imgUrl: 'https://www.w3schools.com/howto/img_avatar.png',
    fullname: 'Trịnh Bá Minh Ninh',
    role: 'storekeeper',
    phone: '0123456789',
    email: 'ninhtbm@gmail.com',
    active: false,
  },
];

const localhost = 'http://localhost:8080';
const deployUrl = 'http://ec2-52-221-240-240.ap-southeast-1.compute.amazonaws.com:8080';

const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecord, setTotalRecord] = useState();
  const [keyword, setKeyword] = useState('');
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [changedActiveStaff, setChangeActiveStaff] = useState();
  const [imageList, setImageList] = useState();
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.staff }));
  const [searchBy, setSearchBy] = useState('fullName');

  const handleOnClickDetail = (staffId) => {
    navigate(`/staff/detail/${staffId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleConfirm = async () => {
    console.log(!changedActiveStaff.active);
    if (!!changedActiveStaff) {
      try {
        const params = {
          staffId: changedActiveStaff.id,
          isActive: !changedActiveStaff.active,
        };
        const actionResult = await dispatch(setActiveForStaff(params));
        const dataResult = unwrapResult(actionResult);
        console.log('dataResult', dataResult);
        if (dataResult) {
          toast.success(dataResult.message);
          searchStaff();
          setOpenPopup(false);
        }
      } catch (error) {
        console.log('Failed to set active staff: ', error);
      }
    }
  };

  const searchStaff = async () => {
    try {
      const params = {
        pageIndex: page,
        pageSize: rowsPerPage,
        keyWords: keyword,
        sortColumn: searchBy,
      };
      const actionResult = await dispatch(getStaffList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult) {
        setTotalRecord(dataResult.totalRecord);
        setStaffList(dataResult.listStaff);
      }
    } catch (error) {
      console.log('Failed to search staff list: ', error);
    }
  };

  const setActiveStaff = async (staff) => {
    console.log(staff);
    if (Boolean(staff.active) === true) {
      setTitle(
        'Bạn có chắc chắn muốn ngưng hoạt động của tài khoản ' +
          staff.userName +
          ' không?',
      );
    } else {
      setTitle('Bạn có chắc chắn muốn kích hoạt tài khoản ' + staff.userName + ' không?');
    }
    setChangeActiveStaff(staff);
    setMessage('');
    setErrorMessage(null);
    setOpenPopup(true);
  };

  const fetchImage = async (imageUrl) => {
    const res = await fetch(imageUrl);
    const imageBlob = await res.blob();
    return URL.createObjectURL(imageBlob);
    // console.log(imageObjectURL)
    // setImageList(imageObjectURL)
  };

  const fetchStaffList = async () => {
    try {
      const params = {
        pageIndex: page,
        pageSize: rowsPerPage,
        keyWords: '',
      };
      const actionResult = await dispatch(getStaffList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult) {
        setTotalRecord(dataResult.totalRecord);
        setStaffList(dataResult.listStaff);
      }
    } catch (error) {
      console.log('Failed to fetch staff list: ', error);
    }
  };

  useEffect(() => {
    searchStaff();
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchStaffList();
  }, []);
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
              onChange={handleSearchChange}
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
              onClick={(e) => searchStaff()}
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
            {loading ? (
              <ProgressCircleLoading />
            ) : (
              <Box>
                {totalRecord > 0 ? (
                  <TableContainer>
                    {staffList && staffList.length > 0 && (
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell align="center">Mã nhân viên</TableCell>
                            <TableCell align="center">Ảnh</TableCell>
                            <TableCell align="center">Tên nhân viên</TableCell>
                            <TableCell align="center">Số điện thoại</TableCell>
                            <TableCell align="center">Chức vụ</TableCell>
                            <TableCell align="center">Trạng thái hoạt động</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {staffList.map((staff) => {
                            return (
                              <TableRow
                                key={staff.id}
                                hover
                                onClick={() => handleOnClickDetail(staff.id)}
                              >
                                <TableCell align="center">{staff.userName}</TableCell>
                                <TableCell align="center">
                                  <img
                                    className={classes.imgStaff}
                                    loading="lazy"
                                    src={
                                      staff.imageUrl
                                        ? API_URL_IMAGE + '/' +  staff.imageUrl
                                        : require('@/assets/images/default-avatar.jpg')
                                    }
                                  />
                                </TableCell>
                                <TableCell align="center">{staff.fullName}</TableCell>
                                <TableCell align="center">{staff.phone}</TableCell>
                                <TableCell align="center">
                                  {getRoleLabel(staff.roleName)}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                >
                                  <FormControlLabel
                                    value="bottom"
                                    // TODO: set checked = active
                                    onChange={() => setActiveStaff(staff)}
                                    control={
                                      <Switch
                                        checked={Boolean(staff.active)}
                                        color="success"
                                      />
                                    }
                                    label={
                                      staff.active
                                        ? 'Đang hoạt động'
                                        : 'Đã ngưng hoạt động'
                                    }
                                    labelPlacement="bottom"
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    )}
                    <CustomTablePagination
                      page={page}
                      pages={pages}
                      rowsPerPage={rowsPerPage}
                      totalRecord={totalRecord}
                      handleChangePage={handleChangePage}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                ) : (
                  <>Không tìm thấy nhân viên phù hợp</>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
      <AlertPopup
        maxWidth="sm"
        title={errorMessage ? 'Chú ý' : title}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        isConfirm={!errorMessage}
        handleConfirm={handleConfirm}
      >
        <Box
          component={'span'}
          className="popupMessageContainer"
        >
          {errorMessage ? errorMessage : message}
        </Box>
      </AlertPopup>
    </Grid>
  );
};

export default StaffList;
