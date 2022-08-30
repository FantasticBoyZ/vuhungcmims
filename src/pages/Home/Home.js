import { removePost } from '@/slices/PostSlice';
import testAPI from '@/utils/testApi';
import { AccountCircle, Search } from '@mui/icons-material';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import InventoryChart from '@/pages/Home/InventoryChart';
import DashboardService from '@/services/dashboardService';
import { toast } from 'react-toastify';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import useAuth from '@/utils/useAuth';
import FormatDataUtils from '@/utils/formatData';

const useStyles = makeStyles((theme) => ({
  cardInfo: {
    minHeight: '180px',
  },
  contentContainer: {
    minHeight: '180px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  widget: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: '24px',
    color: '#9FA2B4',
    textAlign: 'center',
    fontWeight: '500',
    margin: '0',
  },
  number: {
    fontSize: '40px',
    color: '#252733',
    fontWeight: '500',
    margin: '0',
  },
  searchField: {
    minHeight: '53px',
    backgroundColor: '#FFFFFF',
    borderRadius: '50px',
    outline: 'none',
  },
  noBorder: {
    border: 'none',
  },
  chart: {
    height: '50vh',
    width: '100%',
  },
}));
const HomePage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dashBoardData, setDashBoardData] = useState({});
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const { auth, role } = useAuth();

  const functionList = [
    {
      label: 'Danh sách sản phẩm',
      path: '/product',
      acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
    },
    {
      label: 'Danh sách nhà sản xuất',
      path: '/manufacturer',
      acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
    },
    {
      label: 'Danh sách danh mục',
      path: '/category',
      acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
    },
    {
      label: 'Danh sách nhà kho',
      path: '/warehouse',
      acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
    },
    {
      label: 'Tạo phiếu nhập hàng',
      path: '/import/create-order',
      acceptRole: ['ROLE_OWNER', 'ROLE_SELLER'],
    },
    {
      label: 'Danh sách nhập hàng',
      path: '/import/list',
      acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
    },
    {
      label: 'Tạo phiếu xuất hàng',
      path: '/export/create-order',
      acceptRole: ['ROLE_OWNER', 'ROLE_SELLER'],
    },
    {
      label: 'Danh sách xuất hàng',
      path: '/export/list',
      acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
    },
    {
      label: 'Danh sách trả hàng',
      path: '/export/return/list',
      acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
    },
    {
      label: 'Tạo phiếu lưu kho',
      path: '/term-inventory/return/create',
      acceptRole: ['ROLE_OWNER', 'ROLE_SELLER'],
    },
    {
      label: 'Danh sách lưu kho',
      path: '/term-inventory/return/list',
      acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER', 'ROLE_SELLER'],
    },
    {
      label: 'Tạo phiếu kiểm kho',
      path: '/inventory-checking/create',
      acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER'],
    },
    {
      label: 'Lịch sử kiểm kho',
      path: '/inventory-checking/list',
      acceptRole: ['ROLE_OWNER', 'ROLE_STOREKEEPER'],
    },
    {
      label: 'Đăng ký nhân viên mới',
      path: '/staff/register',
      acceptRole: ['ROLE_OWNER'],
    },
    {
      label: 'Danh sách nhân viên',
      path: '/staff/list',
      acceptRole: ['ROLE_OWNER'],
    },
  ];
  const functionListFiltered = functionList.filter((func) =>
    func.acceptRole.includes(role),
  );
  const getDashboardData = () => {
    try {
      setLoading(true);
      DashboardService.getDashboardData().then(
        (res) => {
          // console.log(res.data.data);
          setDashBoardData(res.data.data);
          const chartDataRaw = res.data.data.chart;
          let chartDataList = [];
          for (let index = 0; index < chartDataRaw.length; index++) {
            const element = chartDataRaw[index];
            chartDataList.push({
              saveDate: element.saveDate ? FormatDataUtils.formatDateByFormat(
                element.saveDate,
                'dd-MM-yyyy',
              ) : null,
              amout: element.amout,
            });
          }
          setChartData(chartDataList);
          setLoading(false);
        },
        (error) => {
          const errMessage =
            (error.response && error.response.data) || error.message || error.toString();
          toast.error(errMessage);
          setLoading(false);
        },
      );
    } catch (error) {
      toast.error('Mất kết nối mạng');
      setLoading(false);
    }
  };
  useEffect(() => {
    getDashboardData();
  }, []);
  return (
    <Box>
      {loading ? (
        <ProgressCircleLoading />
      ) : (
        <Container maxWidth="xl">
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={3}
              item
            >
              <Card className={classes.cardInfo}>
                <CardContent className={classes.contentContainer}>
                  <Box className={classes.widget}>
                    <p className={classes.title}>
                      {role === 'ROLE_OWNER'
                        ? 'Số nhân viên hiện tại'
                        : 'Số mặt hàng đang có trong kho'}
                    </p>
                  </Box>
                  <Box className={classes.widget}>
                    <p className={classes.number}>
                      {role === 'ROLE_OWNER'
                        ? dashBoardData?.numberUser
                        : dashBoardData?.numberProduct}
                    </p>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              xs={3}
              item
            >
              <Card className={classes.cardInfo}>
                <CardContent className={classes.contentContainer}>
                  <Box className={classes.widget}>
                    <p className={classes.title}>Số đơn nhập đang chờ xét duyệt</p>
                  </Box>
                  <Box className={classes.widget}>
                    <p className={classes.number}>
                      {dashBoardData?.numberImportOrderNotConfirmed}
                    </p>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              xs={3}
              item
            >
              <Card className={classes.cardInfo}>
                <CardContent className={classes.contentContainer}>
                  <Box className={classes.widget}>
                    <p className={classes.title}>Số đơn xuất đang chờ xét duyệt</p>
                  </Box>
                  <Box className={classes.widget}>
                    <p className={classes.number}>
                      {dashBoardData?.numberExportOrderNotConfirmed}
                    </p>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              xs={3}
              item
            >
              <Card className={classes.cardInfo}>
                <CardContent className={classes.contentContainer}>
                  <Box className={classes.widget}>
                    <p className={classes.title}>Số đơn hàng lưu kho</p>
                  </Box>
                  <Box className={classes.widget}>
                    <p className={classes.number}>
                      {dashBoardData?.numberImportOrderConfirmed}
                    </p>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              xs={12}
              item
            >
              <Card>
                <Autocomplete
                  id="functionSearch"
                  // className={classes.searchField}
                  name="functionSearch"
                  options={functionListFiltered}
                  noOptionsText="Không tìm thấy chức năng"
                  onChange={(event, newValue) => {
                    navigate(newValue.path);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Tìm kiếm chức năng..."
                      InputProps={{
                        ...params.InputProps,

                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </Card>
              {/* <TextField
                id="outlined-basic"
                className={classes.searchField}
                name="functionSearch"
                placeholder="Tìm kiếm chức năng..."
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
              /> */}
            </Grid>
            <Grid
              xs={12}
              item
            >
              <Card>
                <CardHeader title="Lượng tồn kho theo quý" />
                <CardContent>
                  <Box className={classes.chart}>
                    <InventoryChart
                      chartData={[
                        ...chartData,
                        {
                          saveDate: FormatDataUtils.formatDateByFormat(
                            dashBoardData.lastDay,
                            'dd-MM-yyyy',
                          ),
                          amout: dashBoardData.latestInventoryAmount,
                        },
                      ]}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <InventoryChart />
        </Container>
      )}
      {/* <Button
        variant="contained"
        component={Link}
        to={'/post/add'}
      >
        Add New Post
      </Button>
      {posts &&
        posts.map((post) => (
          <Box key={post.id}>
            <Typography variant="span">
              {post.id}.{post.title}
            </Typography>
            <Button
              sx={{ m: 2 }}
              variant="outlined"
              color="secondary"
              onClick={() => handleEditPost(post)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleRemovePost(post)}
            >
              Delete
            </Button>
          </Box>
        ))} */}
    </Box>
  );
};

export default HomePage;
