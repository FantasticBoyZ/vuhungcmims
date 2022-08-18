import AlertPopup from '@/components/Common/AlertPopup';
import Label from '@/components/Common/Label';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import ExportProductTable from '@/pages/Transaction/ExportList/ExportOrderDetail/ExportProductTable';
import AuthService from '@/services/authService';
import {
  cancelExportOrder,
  confirmExportOrder,
  getConsignmentsByExportOrderId,
  getExportOrderById,
} from '@/slices/ExportOrderSlice';
import FormatDataUtils from '@/utils/formatData';
import { Close, Done, Edit, KeyboardReturn } from '@mui/icons-material';
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
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

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
    maxWidth: '25vw',
    minHeight: '20vh',
    wordBreak: 'break-word'
  },
  warehouseContainer: {
    backgroundColor: 'rgba(220, 244, 252,0.5)',
    padding: theme.spacing(1),
    borderRadius: '10px',
  },
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

const getStatusLabel = (exportOrderStatus) => {
  const map = {
    canceled: {
      text: 'Đã huỷ',
      color: 'error',
    },
    completed: {
      text: 'Đã xuất kho',
      color: 'success',
    },
    pending: {
      text: 'Đang chờ xử lý',
      color: 'warning',
    },
    returned: {
      text: 'Đã xuất kho',
      color: 'success',
    },
  };

  const { text, color } = map[exportOrderStatus];

  return <Label color={color}>{text}</Label>;
};

const ExportOrderDetail = () => {
  const { exportOrderId } = useParams();
  const navigate = useNavigate();
  const [exportOrder, setExportOrder] = useState();
  const [listConsignments, setListConsignments] = useState([]);
  const [addressWarehouse, setAddressWarehouse] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isConfirm, setIsConfirm] = useState(false);
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.exportOrders }));
  const currentUserRole = AuthService.getCurrentUser().roles[0];

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

  const handleOnClickConfirm = () => {
    setTitle('Bạn có chắc chắn muốn xác nhận xuất hàng thành công?');
    setMessage('Hãy kiểm tra kỹ hàng hóa trước khi xác nhận.');
    setIsConfirm(true);
    setOpenPopup(true);
  };

  const handleOnClickCancel = () => {
    setTitle('Bạn có chắc chắn muốn hủy phiếu xuất hàng không?');
    setMessage('');
    setIsConfirm(false);
    setOpenPopup(true);
  };

  const handleConfirm = async () => {
    if (isConfirm) {
      console.log('Xác nhận');
      try {
        const confirmUserId = AuthService.getCurrentUser().id;
        const params = { exportOrderId, confirmUserId };
        const actionResult = await dispatch(confirmExportOrder(params));
        const result = unwrapResult(actionResult);
        console.log(result);
        if (!!result) {
          if (!!result.body.message) {
            toast.success(result.body.message);
          } else {
            toast.success('Xác nhận xuất kho thành công!');
          }
          fetchExportOrderDetail();
          fetchConsignmentsByExportOrderId();
          setOpenPopup(false);
        }
      } catch (error) {
        console.log('Failed to confirm importOder: ', error);
        toast.error('Lỗi! Xác nhận xuất kho thất bại!');
      }
    } else {
      console.log('Huỷ');
      try {
        const confirmUserId = AuthService.getCurrentUser().id;
        const params = { exportOrderId, confirmUserId };
        const actionResult = await dispatch(cancelExportOrder(params));
        const result = unwrapResult(actionResult);
        console.log(result);
        if (!!result) {
          if (!!result.body.message) {
            toast.success(result.body.message);
          } else {
            toast.success('Huỷ xuất kho thành công!');
          }
          fetchExportOrderDetail();
          fetchConsignmentsByExportOrderId();
          setOpenPopup(false);
        }
      } catch (error) {
        console.log('Failed to cancel importOder: ', error);
        toast.error('Lỗi! Huỷ xuất kho thất bại!');
      }
    }
  };

  const fetchExportOrderDetail = async () => {
    try {
      // const params = {
      //   orderId: importOrderId,
      // };
      const actionResult = await dispatch(getExportOrderById(exportOrderId));
      const dataResult = unwrapResult(actionResult);
      if (
        dataResult.data &&
        !FormatDataUtils.isEmptyObject(dataResult.data.inforExportDetail)
      ) {
        setExportOrder(dataResult.data.inforExportDetail);
      } else {
        navigate('/404');
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
        setListConsignments(dataResult.data.productList);
        setAddressWarehouse(dataResult.data.addressWarehouse);
        setTotalRecord(dataResult.data.totalRecord);
      }
      console.log('consignments List', dataResult);
    } catch (error) {
      console.log('Failed to fetch consignment list by exportOder: ', error);
    }
  };

  useEffect(() => {
    if (isNaN(exportOrderId)) {
      navigate('/404');
    } else {
      fetchExportOrderDetail();
      fetchConsignmentsByExportOrderId();
    }
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
                        <strong>Phiếu xuất kho số:</strong> {'PX' + exportOrderId}
                      </Typography>{' '}
                      <span>
                        {exportOrder.statusName && getStatusLabel(exportOrder.statusName)}
                      </span>
                    </Box>
                    {exportOrder.statusName === 'pending' && (
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                        className={classes.buttonAction}
                      >
                        {(currentUserRole === 'ROLE_OWNER' ||
                          currentUserRole === 'ROLE_STOREKEEPER') && (
                          <Button
                            variant="contained"
                            startIcon={<Done />}
                            color="success"
                            onClick={() => handleOnClickConfirm()}
                          >
                            Xác nhận xuất kho
                          </Button>
                        )}
                        {(currentUserRole === 'ROLE_OWNER' ||
                          currentUserRole === 'ROLE_STOREKEEPER') && (
                          <Button
                            variant="contained"
                            startIcon={<Edit />}
                            color="warning"
                            onClick={() => {
                              navigate(`/export/edit/${exportOrderId}`);
                            }}
                          >
                            Chỉnh sửa
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          startIcon={<Close />}
                          color="error"
                          onClick={() => handleOnClickCancel()}
                        >
                          Huỷ phiếu xuất kho
                        </Button>
                      </Stack>
                    )}
                    {exportOrder.statusName === 'completed' &&
                      exportOrder.isReturn !== true &&
                      (currentUserRole === 'ROLE_OWNER' ||
                        currentUserRole === 'ROLE_SELLER') && (
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
                      {listConsignments && listConsignments?.length > 0 ? (
                        <ExportProductTable productList={listConsignments} />
                      ) : (
                        <Box>Đơn xuất hàng không có lô hàng nào</Box>
                      )}
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
                        <Stack spacing={2}>
                          <Box>
                            <Typography variant="h6">Thông tin xác nhận</Typography>
                            <Typography>
                              Người tạo đơn:{' '}
                              <i>
                                {exportOrder.createdFullName +
                                  '(' +
                                  exportOrder.createBy +
                                  ')'}
                              </i>
                            </Typography>
                            <Typography>Ngày tạo đơn:</Typography>
                            <Typography>
                              <i>
                                {exportOrder.createDate
                                  ? FormatDataUtils.formatDateTime(exportOrder.createDate)
                                  : null}
                              </i>
                            </Typography>
                          </Box>
                          {exportOrder.statusName === 'completed' && (
                            <Box>
                              <Typography>
                                Người xác nhận:{' '}
                                <i>
                                  {exportOrder.confirmByFullName +
                                    '(' +
                                    exportOrder.confirmBy +
                                    ')'}
                                </i>
                              </Typography>
                              <Typography>Ngày xác nhận:</Typography>
                              <Typography>
                                <i>
                                  {exportOrder.confirmDate
                                    ? FormatDataUtils.formatDateTime(
                                        exportOrder.confirmDate,
                                      )
                                    : null}
                                </i>
                              </Typography>
                            </Box>
                          )}
                        </Stack>
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
                        <Stack spacing={2}>
                          {addressWarehouse.length > 0 &&
                            addressWarehouse.map((address, index) => (
                              <Box
                                key={index}
                                className={classes.warehouseContainer}
                              >
                                <Typography>{address.name}</Typography>
                                <Divider />
                                <Typography>{address.detailAddress}</Typography>
                                <Typography>
                                  {address.wardName} - {address.districtName} -{' '}
                                  {address.provinceName}
                                </Typography>
                              </Box>
                            ))}
                        </Stack>
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
              <AlertPopup
                maxWidth="sm"
                title={title}
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
                isConfirm={true}
                handleConfirm={handleConfirm}
              >
                <Box
                  component={'span'}
                  className="popupMessageContainer"
                >
                  {message}
                </Box>
              </AlertPopup>
            </Grid>
          )}
        </Box>
      )}
    </>
  );
};

export default ExportOrderDetail;
