import AlertPopup from '@/components/Common/AlertPopup';
import ExportProductTable from '@/pages/Transaction/ExportList/ExportOrderDetail/ExportProductTable';
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
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReturnProductTable from '@/pages/Export/ReturnList/ReturnOrderDetail/ReturnProductTable';
import { getReturnOrderById } from '@/slices/ExportOrderSlice';
import { useParams } from 'react-router-dom';
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
  warehouseContainer: {
    backgroundColor: 'rgba(220, 244, 252,0.5)',
    padding: theme.spacing(1),
    borderRadius: '10px',
  },
}));

const exportOrder = {
  billRefernce: 'ABC1234',
  statusName: 'completed',
  creatorId: '1',
  createBy: 'Obama',
  createDate: new Date(),
  validator: 'Biden',
  confirmedDate: new Date(),
  warehourseId: '1',
  wareHouseName: 'Kho 1',
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
      wrapUnitMeasure: 'Hộp',
      numberOfWrapUnitMeasure: 10,
      quantity: '700',
      unitPrice: 100000,
      consignmentList: [
        {
          id: 1,
          warehouseId: 1,
          warehouseName: 'Kho 1',
          importDate: '16/07/2022',
          expirationDate: '30/12/2022',
          quantityReturn: 20,
          quantity: '200',
        },
        {
          id: 2,
          warehouseId: 1,
          warehouseName: 'Kho 1',
          importDate: '20/07/2022',
          expirationDate: '30/12/2022',
          quantityReturn: 0,
          quantity: '500',
        },
      ],
    },
    {
      id: 2,
      productCode: 'GACH34',
      productName: 'Gạch men 60x60',
      unitMeasure: 'Viên',
      wrapUnitMeasure: 'Hộp',
      numberOfWrapUnitMeasure: 10,
      quantity: '1000',
      unitPrice: 100000,
      consignmentList: [
        {
          id: 1,
          warehouseId: 1,
          warehouseName: 'Kho 1',
          importDate: new Date('16/07/2022'),
          expirationDate: '30/12/2022',
          quantityReturn: 25,
          quantity: '200',
        },
        {
          id: 2,
          warehouseId: 1,
          warehouseName: 'Kho 1',
          importDate: '20/07/2022',
          expirationDate: '30/12/2022',
          quantityReturn: 50,
          quantity: '800',
        },
      ],
    },
  ],
};

const ReturnOrderDetail = () => {
  const { returnOrderId } = useParams();
  const classes = useStyles();
  const [returnOrder, setReturnOrder] = useState();
  const [listConsignments, setListConsignments] = useState([]);
  const [addressWarehouse, setAddressWarehouse] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isConfirm, setIsConfirm] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.exportOrders }));

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

  const fetchReturnOrderDetail = async () => {
    try {
      const params = {
        orderId: returnOrderId,
      };
      const actionResult = await dispatch(getReturnOrderById(params));
      const dataResult = unwrapResult(actionResult);
      if (dataResult.data) {
        setReturnOrder(dataResult.data.inforExportDetail);
        setAddressWarehouse(dataResult.data.addressWarehouse);
        setListConsignments(dataResult.data.productList);
      }
      console.log('Return Order Detail', dataResult);
    } catch (error) {
      console.log('Failed to fetch exportOrder detail: ', error);
    }
  };

  const handleConfirm = () => {};

  useEffect(() => {
    fetchReturnOrderDetail();
  }, []);

  return (
    <Box>
      {loading ? (
        <ProgressCircleLoading />
      ) : (
        <Box>
          {!!returnOrder && (
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
                        <strong>Phiếu trả hàng từ phiếu xuất hàng số:</strong>{' '}
                        {returnOrder.billRefernce}
                      </Typography>
                    </Box>
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
                      {!!listConsignments && listConsignments?.length > 0 ? (
                        <ReturnProductTable productList={listConsignments} />
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
                        <Typography variant="h6">Thông tin xác nhận</Typography>
                        <Typography>
                          Người tạo đơn: <i>{returnOrder.createBy}</i>
                        </Typography>
                        <Typography>Ngày tạo đơn:</Typography>
                        <Typography>
                          {returnOrder.createDate
                            ? FormatDataUtils.formatDateTime(returnOrder.createDate)
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
                        <Stack spacing={2}>
                          {addressWarehouse.length > 0 &&
                            addressWarehouse.map((address, index) => (
                              <Box
                                key={index}
                                className={classes.warehouseContainer}
                              >
                                <Typography>{address.warehouseName}</Typography>
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
                        <Typography>{returnOrder.description}</Typography>
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
    </Box>
  );
};

export default ReturnOrderDetail;
