import { getManufacturerById } from '@/slices/ManufacturerSlice';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Container,
  Grid,
  Stack,
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
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import Select from 'react-select';
import FormatDataUtils from '@/utils/formatData';
import CustomTablePagination from '@/components/Common/TablePagination';
const useStyles = makeStyles({
  cardHeader: {
    display: 'flex',
    padding: '20px 20px',
    marginBottom: '20px',
    justifyContent: 'space-between',
  },
  infoContainer: {
    display: 'block',
    padding: '20px',
    marginBottom: '20px',
  },
  infoProduct: {
    padding: '20px',
  },
  table: {
    '& thead th': {
      backgroundColor: '#DCF4FC',
    },
  },
});
const ManufacturerDetail = () => {
  const { manufacturerId } = useParams();
  const [manufacturer, setManufacturer] = useState();
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.manufacturers }));
  const [selectedUnitMeasureList, setSelectedUnitMeasureList] = useState([]);
  const pages = [5, 10, 15];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOnClickEdit = () => {
    navigate(`/manufacturer/edit/${manufacturerId}`);
  };

  const fetchManufacturerDetail = async () => {
    const params = {
      pageIndex: page + 1,
      pageSize: rowsPerPage,
      manufacturerId: manufacturerId
    };
    try {
      const actionResult = await dispatch(getManufacturerById(params));
      const dataResult = unwrapResult(actionResult);
      if (dataResult.data) {
        setManufacturer(dataResult.data.manufactor);
        setTotalRecord(dataResult.data.totalRecord);
      }
      console.log('dataResult', dataResult);
    } catch (error) {
      console.log('Failed to fetch manufacturer detail: ', error);
    }
  };

  useEffect(() => {
    fetchManufacturerDetail();
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchManufacturerDetail();
  }, []);

  console.log(manufacturer?.listProducts);
  return (
    <Grid>
      <Card className={classes.cardHeader}>
        <Stack>
          <Typography
            variant="h5"
            style={{ fontWeight: 'bold' }}
          >
            {manufacturer?.name}
          </Typography>
        </Stack>

        <Button
          onClick={() => handleOnClickEdit()}
          color="warning"
          variant="contained"
          startIcon={<CreateIcon />}
        >
          Chỉnh sửa
        </Button>
      </Card>

      <Card className={classes.infoContainer}>
        {loading && !manufacturer ? (
          <ProgressCircleLoading />
        ) : (
          <>
            <CardHeader title="Thông tin chi tiết" />
            <CardContent>
              <Stack
                paddingX={3}
                spacing={2}
              >
                <Grid container>
                  <Grid
                    xs={2}
                    item
                  >
                    <Typography color="#696969">Số điện thoại</Typography>
                  </Grid>
                  <Grid
                    xs={10}
                    item
                  >
                    <Typography>{manufacturer?.phone}</Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid
                    xs={2}
                    item
                  >
                    <Typography color="#696969">Email</Typography>
                  </Grid>
                  <Grid
                    xs={10}
                    item
                  >
                    <Typography>{manufacturer?.email}</Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid
                    xs={2}
                    item
                  >
                    <Typography color="#696969"> Địa chỉ</Typography>
                  </Grid>
                  <Grid
                    xs={10}
                    item
                  >
                    <Typography>{manufacturer?.addressManufactor}</Typography>
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </>
        )}
      </Card>

      <Card className={classes.infoProduct}>
        {loading ? (
          <ProgressCircleLoading />
        ) : (
          <>
            {' '}
            <CardHeader title="Các sản phẩm cung cấp" />
            <CardContent>
              {totalRecord > 0 ? (
                <TableContainer>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Mã sản phẩm</TableCell>
                        <TableCell>Tên sản phẩm</TableCell>
                        <TableCell align="center">Danh mục</TableCell>
                        <TableCell align="center">Đơn vị tính</TableCell>
                        <TableCell align="center">Tồn kho</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {manufacturer?.listProducts.map((productByManufacturer, index) => {
                        // TODO: làm selectedImportOrders
                        const newSelectdUnitMeasureList = selectedUnitMeasureList.slice();
                        return (
                          <TableRow
                            hover
                            key={productByManufacturer.id}
                            selected={false}
                          >
                            <TableCell>
                              <Typography
                                variant="body1"
                                color="text.primary"
                                gutterBottom
                                noWrap
                              >
                                {productByManufacturer.productCode}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body1"
                                color="text.primary"
                                gutterBottom
                                noWrap
                              >
                                {productByManufacturer.name}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography
                                variant="body1"
                                color="text.primary"
                                gutterBottom
                                noWrap
                              >
                                {productByManufacturer.categoryName}
                              </Typography>
                            </TableCell>
                            <TableCell
                              align="center"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              {productByManufacturer?.wrapUnitMeasure == null ? (
                                productByManufacturer?.unitMeasure
                              ) : (
                                <Select
                                  classNamePrefix="select"
                                  isSearchable={false}
                                  defaultValue={
                                    FormatDataUtils.getOption([
                                      {
                                        number: 1,
                                        name: productByManufacturer.unitMeasure,
                                      },
                                      {
                                        number:
                                          productByManufacturer.numberOfWrapUnitMeasure,
                                        name: productByManufacturer.wrapUnitMeasure,
                                      },
                                    ])[0]
                                  }
                                  options={FormatDataUtils.getOption([
                                    {
                                      number: 1,
                                      name: productByManufacturer.unitMeasure,
                                    },
                                    {
                                      number:
                                        productByManufacturer.numberOfWrapUnitMeasure,
                                      name: productByManufacturer.wrapUnitMeasure,
                                    },
                                  ])}
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                  }}
                                />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Typography
                                variant="body1"
                                color="text.primary"
                                gutterBottom
                                noWrap
                              >
                                {productByManufacturer.quantity}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
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
                <>Chưa có sản phẩm nào của nhà sản xuất này trong kho</>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </Grid>
  );
};

export default ManufacturerDetail;
