import FormatDataUtils from '@/utils/formatData';
import { Add, Close, Edit, KeyboardReturn } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate, useParams } from 'react-router-dom';
import ExportProductTable from '@/pages/Transaction/ExportList/ExportOrderDetail/ExportProductTable';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getConsignmentsByExportOrderId,
  getExportOrderById,
} from '@/slices/ExportOrderSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';

const useStyles = makeStyles((theme) => ({
  billReferenceContainer: {
    fontSize: '24px',
  },
  buttonAction: {},
  cardTable: {
    padding: theme.spacing(2),
    minHeight: '80vh',
  },
  confirmInfo: {},
  warehourseInfo: {},
  orderNote: {
    minHeight: '20vh',
  },
  totalAmount: {},
}));

const exportOrder = {
  billReferenceNumber: 'ABC1234',
  statusName: 'completed',
  creatorId: '1',
  creatorName: 'Obama',
  createdDate: new Date(),
  validator: 'Biden',
  confirmedDate: new Date(),
  warehourseId: '1',
  warehourseName: 'Kho 1',
  addressDetail: 'So 32 To 4',
  provinceId: 1,
  districtId: 1,
  wardId: 1,
  provinceName: 'Ha Noi',
  districtName: 'Chuong My',
  wardName: 'Xuan Mai',
  description:
    'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
  productList: [
    {
      id: 1,
      productCode: 'GACH23',
      productName: 'Gạch men 60x60',
      unitMeasure: 'Viên',
      quantity: '700',
      unitPrice: 100000,
      consignments: [
        {
          id: 1,
          warehouseId: 1,
          warehourseName: 'Kho 1',
          importDate: '16/07/2022',
          expirationDate: '30/12/2022',
          quantity: '200',
        },
        {
          id: 2,
          warehouseId: 1,
          warehourseName: 'Kho 1',
          importDate: '20/07/2022',
          expirationDate: '30/12/2022',
          quantity: '500',
        },
      ],
    },
    {
      id: 2,
      productCode: 'GACH34',
      productName: 'Gạch men 60x60',
      unitMeasure: 'Viên',
      quantity: '1000',
      unitPrice: 100000,
      consignments: [
        {
          id: 1,
          warehouseId: 1,
          warehourseName: 'Kho 1',
          importDate: '16/07/2022',
          expirationDate: '30/12/2022',
          quantity: '200',
        },
        {
          id: 2,
          warehouseId: 1,
          warehourseName: 'Kho 1',
          importDate: '20/07/2022',
          expirationDate: '30/12/2022',
          quantity: '800',
        },
      ],
    },
  ],
};

const ExportOrderDetail = () => {
  const { exportOrderId } = useParams();
  const navigate = useNavigate();
  const [exportOrder, setExportOrder] = useState();
  const [listConsignments, setListConsignments] = useState([]);
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.products }));

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    if (listConsignments) {
      const productList = listConsignments;
      for (let index = 0; index < productList.length; index++) {
        totalAmount =
          totalAmount + +productList[index]?.quantity * +productList[index]?.unitPrice;
      }
    }
    return totalAmount;
  };

  const fetchExportOrderDetail = async () => {
    try {
      // const params = {
      //   orderId: importOrderId,
      // };
      const actionResult = await dispatch(getExportOrderById(exportOrderId));
      const dataResult = unwrapResult(actionResult);
      if (dataResult.data) {
        setExportOrder(dataResult.data.inforExportDetail);
      }
      console.log('Export Order Detail', dataResult);
    } catch (error) {
      console.log('Failed to fetch exportOrder detail: ', error);
    }
  };

  const fetchConsignmentsByExportOrderId = async () => {
    try {
      const params = {
        // pageIndex: page,
        // pageSize: rowsPerPage,
        orderId: exportOrderId,
      };
      const actionResult = await dispatch(getConsignmentsByExportOrderId(params));
      const dataResult = unwrapResult(actionResult);
      if (dataResult.data) {
        setListConsignments(dataResult.data);
        setTotalRecord(dataResult.data.totalRecord);
      }
      console.log('consignments List', dataResult);
    } catch (error) {
      console.log('Failed to fetch consignment list by exportOder: ', error);
    }
  };

  useEffect(() => {
    fetchExportOrderDetail();
    fetchConsignmentsByExportOrderId();
  }, []);

  return (
    <>
      {loading ? (
        <ProgressCircleLoading />
      ) : (
        <Box>
          {exportOrder && (
            <Grid
              container
              spacing={2}
            >
              <Grid
                xs={12}
                item
              >
                <Card>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    p={2}
                  >
                    <Box className={classes.billReferenceContainer}>
                      <Typography variant="span">
                        <strong>Phiếu xuất kho số:</strong> {exportOrder.billRefernce}
                      </Typography>{' '}
                      <span>
                        {FormatDataUtils.getStatusLabel(exportOrder.statusName)}
                      </span>
                    </Box>
                    {exportOrder.statusName === 'pending' && (
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                        className={classes.buttonAction}
                      >
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          color="success"
                        >
                          Xác nhận xuất kho
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<Edit />}
                          color="warning"
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<Close />}
                          color="error"
                        >
                          Huỷ phiếu xuất kho
                        </Button>
                      </Stack>
                    )}
                    {exportOrder.statusName === 'completed' && (
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                        className={classes.buttonAction}
                      >
                        <Button
                          variant="contained"
                          startIcon={<KeyboardReturn />}
                          color="warning"
                          onClick={() => navigate(`/export/return/${exportOrderId}`)}
                        >
                          Trả hàng
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </Card>
              </Grid>
              <Grid
                xs={9}
                item
              >
                <Grid
                  container
                  spacing={2}
                >
                  {/* <Grid
            xs={12}
            item
          >
            <Card>Thông tin phiếu xuất kho</Card>
          </Grid> */}
                  <Grid
                    xs={12}
                    item
                  >
                    <Card className={classes.cardTable}>
                      {/* {loading ? (
                        <ProgressCircleLoading />
                      ) : (
                        <ExportProductTable productList={listConsignments} />
                      )} */}
                      {listConsignments && listConsignments?.length > 0 ? <ExportProductTable productList={listConsignments} /> : (<Box>Đơn xuất hàng không có lô hàng nào</Box>)}
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                xs={3}
                item
              >
                <Grid
                  container
                  spacing={2}
                >
                  <Grid
                    xs={12}
                    item
                  >
                    <Card>
                      <CardContent className={classes.confirmInfo}>
                        <Typography variant="h6">Thông tin xác nhận</Typography>
                        <Typography>
                          Người tạo đơn: <i>{exportOrder.createBy}</i>
                        </Typography>
                        <Typography>Ngày tạo đơn:</Typography>
                        <Typography>
                          {exportOrder.createDate
                            ? FormatDataUtils.formatDateTime(exportOrder.createDate)
                            : null}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid
                    xs={12}
                    item
                  >
                    <Card>
                      <CardContent className={classes.warehourseInfo}>
                        <Typography variant="h6">Kho lấy hàng</Typography>
                        <Typography>{exportOrder.wareHouseName}</Typography>
                        <Divider />
                        <Typography>{exportOrder.addressDetail}</Typography>
                        <Typography>
                          {exportOrder.wardName} - {exportOrder.districtName} -{' '}
                          {exportOrder.provinceName}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid
                    xs={12}
                    item
                  >
                    <Card>
                      {/* <CardHeader
                  titleTypographyProps={{ variant: 'h6' }}
                  title="Tổng giá trị đơn hàng"
                /> */}
                      <CardContent className={classes.orderNote}>
                        <Typography variant="h6">Ghi chú</Typography>
                        <Typography>{exportOrder.description}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid
                    xs={12}
                    item
                  >
                    <Card>
                      <CardContent className={classes.totalAmount}>
                        {/* <CardHeader
                  titleTypographyProps={{ variant: 'h6' }}
                  title="Tổng giá trị đơn hàng"
                /> */}
                        <Typography variant="h6">Tổng giá trị đơn hàng</Typography>
                        <br />
                        <Typography align="right">
                          {FormatDataUtils.formatCurrency(calculateTotalAmount())}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Box>
      )}
    </>
  );
};

export default ExportOrderDetail;
