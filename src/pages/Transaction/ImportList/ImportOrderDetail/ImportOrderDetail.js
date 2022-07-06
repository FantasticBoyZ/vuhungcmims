import AlertPopup from '@/components/Common/AlertPopup';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import CustomTablePagination from '@/components/Common/TablePagination';
import importOrderService from '@/services/importOrderService';
import { confirmImportOrder, getImportOrderById } from '@/slices/ImportOrderSlice';
import { getProductByImportOrderId } from '@/slices/ProductSlice';
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
import ConsignmentsTable from './ConsignmentsTable';
import './style.css';

const useStyles = makeStyles((theme) => ({
  billReferenceContainer: {
    fontSize: '24px',
  },
  buttonAction: {},
  cardTable: {
    padding: theme.spacing(2),
    minHeight: '50vh',
  },
  confirmInfo: {},
  warehourseInfo: {},
  orderNote: {
    minHeight: '20vh',
  },
  totalAmount: {},
  popupMessageContainer: {
    width: '500px',
    textAlign: 'center',
  },
}));

const ImportOrderDetail = () => {
  const classes = useStyles();
  const { importOrderId } = useParams();
  const [importOrder, setImportOrder] = useState();
  const [listConsignments, setListConsignments] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isConfirm, setIsConfirm] = useState(false);
  const [createdDate] = useState(new Date().getTime());
  const [confirmedDate] = useState(new Date().getTime());
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
  const navigate = useNavigate();
  const dataTest = {
    id: 1,
    orderCode: 'Test001',
    createUser: 'tui',
    confirmUser: null,
    manufacturer: 'Công ty A',
    createdDate: new Date().getTime,
    confirmDate: null,
    status: 'pending',
    inventory: 'kho 1',
    note: 'vai dong description nao do',
    listConsignments: [
      {
        id: '1',
        createDate: new Date().getTime(),
        billRefernce: '1234',
        manufactorName: 'Trong',
        statusName: 'pending',
      },
      {
        id: '2',
        createDate: new Date().getTime(),
        billRefernce: '1234',
        manufactorName: 'Trong',
        statusName: 'pending',
      },
      {
        id: '3',
        createDate: new Date().getTime(),
        billRefernce: '1234',
        manufactorName: 'Trong',
        statusName: 'pending',
      },
    ],
  };

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.importOrders }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOnClickBack = () => {
    navigate('/import');
  };

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    if (listConsignments !== undefined && listConsignments?.length > 0) {
      console.log(listConsignments);
      for (let index = 0; index < listConsignments.length; index++) {
        totalAmount =
          totalAmount +
          +listConsignments[index]?.quantity * +listConsignments[index]?.price;
      }
    }

    return totalAmount;
  };

  const handleOnClickConfirm = () => {
    setTitle('Bạn có chắc chắn muốn xác nhận rằng nhập kho thành công?');
    setMessage('Hãy kiểm tra kỹ hàng hóa trước khi xác nhận.');
    setIsConfirm(true);
    setOpenPopup(true);
  };

  const handleOnClickEdit = () => {
    navigate(`/import/edit/${importOrderId}`)
  }

  const handleOnClickCancel = () => {
    setTitle('Bạn có chắc chắn muốn hủy phiếu nhập này không?');
    setMessage('');
    setIsConfirm(false);
    setOpenPopup(true);
  };


  const handleConfirm = async () => {  
    if (isConfirm) {
      console.log('Xác nhận');
      try {
        const actionResult = await dispatch(confirmImportOrder(importOrderId));
        const result = unwrapResult(actionResult);
        if (!!result) {
          if (!!result.message) {
            toast.success(result.message);
          } else {
            toast.success('Xác nhận nhập kho thành công!');
          }
          fetchImportOrderDetail();
          fetchProductListByImportOrderId();
          setOpenPopup(false);
        }
      } catch (error) {
        console.log('Failed to confirm importOder: ', error);
      }
    } else {
      console.log('Huỷ');
    }
  };

  const fetchImportOrderDetail = async () => {
    try {
      // const params = {
      //   orderId: importOrderId,
      // };
      const actionResult = await dispatch(getImportOrderById(importOrderId));
      const dataResult = unwrapResult(actionResult);
      if (dataResult.data) {
        setImportOrder(dataResult.data.inforDetail);
      }
      console.log('Import Order Detail', dataResult);
    } catch (error) {
      console.log('Failed to fetch importOrder detail: ', error);
    }
  };

  const fetchProductListByImportOrderId = async () => {
    try {
      const params = {
        pageIndex: page,
        pageSize: rowsPerPage,
        orderId: importOrderId,
      };
      const actionResult = await dispatch(getProductByImportOrderId(params));
      const dataResult = unwrapResult(actionResult);
      if (dataResult.data) {
        setListConsignments(dataResult.data.listProduct);
        setTotalRecord(dataResult.data.totalRecord);
        console.log('totalRecord', dataResult.data.totalRecord);
      }
      console.log('Product List', dataResult);
    } catch (error) {
      console.log('Failed to fetch product list by importOder: ', error);
    }
  };

  useEffect(() => {
    fetchImportOrderDetail();
    fetchProductListByImportOrderId();
  }, [page, rowsPerPage]);

  return (
    <>
      {loading ? (
        <ProgressCircleLoading/>
      ) : (
        <>
          {importOrder && (
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
              >
                <Card>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    p={2}
                  >
                    <Box className={classes.billReferenceContainer}>
                      <Typography variant="span">
                        <strong>Phiếu nhập kho số:</strong> {importOrder.billRefernce}
                      </Typography>{' '}
                      <span>
                        {FormatDataUtils.getStatusLabel(importOrder.statusName)}
                      </span>
                    </Box>
                    {importOrder.statusName === 'pending' && (
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                        className={classes.buttonAction}
                      >
                        <Button
                          variant="contained"
                          startIcon={<Done />}
                          color="success"
                          onClick={() => handleOnClickConfirm()}
                        >
                          Xác nhận nhập kho
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<Edit />}
                          color="warning"
                          onClick={() => handleOnClickEdit()}
                        >
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<Close />}
                          color="error"
                          onClick={() => handleOnClickCancel()}
                        >
                          Huỷ phiếu nhập kho
                        </Button>
                      </Stack>
                    )}
                    {importOrder.statusName === 'completed' && (
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
                  <Grid
                    xs={12}
                    item
                  >
                    <Card>
                      <CardContent>
                        <Typography variant="h6">Thông tin nhà cung cấp</Typography>
                        <Box className="manufacturer-info">
                          {importOrder.manufactorName}
                        </Box>
                        <br />
                        <Divider />
                        <br />
                        <Typography variant="h6">Thông tin lưu kho</Typography>
                        <Typography>Vị trí: {importOrder.wareHouseName}</Typography>
                        <Typography>
                          Địa chỉ: {importOrder.wardName} - {importOrder.districtName} -{' '}
                          {importOrder.provinceName}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid
                    xs={12}
                    item
                  >
                    <Card className={classes.cardTable}>
                      {!!listConsignments && listConsignments.length > 0 ? (
                        <Box>
                          <ConsignmentsTable listConsignments={listConsignments} />
                          {totalRecord > 10 && (
                            <CustomTablePagination
                              page={page}
                              pages={pages}
                              rowsPerPage={rowsPerPage}
                              totalRecord={totalRecord}
                              handleChangePage={handleChangePage}
                              handleChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                          )}
                        </Box>
                      ) : (
                        <Box> Phiếu nhập chưa có lô hàng nào </Box>
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
                        <br />
                        <Typography>
                          Người tạo đơn: <i>{importOrder.createBy}</i>
                        </Typography>
                        <Typography>Ngày tạo đơn:</Typography>
                        <Typography>
                          {FormatDataUtils.formatDateTime(importOrder.createDate)}
                        </Typography>
                        <br />
                        {importOrder.confirmDate && (
                          <Box>
                            <Typography>
                              Người xác nhận: <i>{importOrder.confirmBy}</i>
                            </Typography>
                            <Typography>Ngày xác nhận:</Typography>
                            <Typography>
                              {FormatDataUtils.formatDateTime(importOrder.confirmDate)}
                            </Typography>
                          </Box>
                        )}
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
                        <Typography>{importOrder.description}</Typography>
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
            // <Container maxWidth="xl">
            //   <div className="title-container">
            //     <div className="title-order">
            //       <div className="button-back">
            //         <Button
            //           variant="text"
            //           startIcon={<ArrowBackIosNewIcon />}
            //           color="inherit"
            //           onClick={handleOnClickBack}
            //         >
            //           Quay trở lại
            //         </Button>
            //       </div>
            //       <Box className="label-order-code">
            //         <b>Phiếu nhập kho số: </b>
            //         {importOrder.billRefernce}{' '}
            //       </Box>
            //     </div>
            //     <div className="status-oder">
            //       {getStatusLabel(importOrder.statusName)}
            //     </div>
            //   </div>
            //   <div className="container">
            //     <div className="left-panel">
            //       <Card className="panel-information ">
            //         <Typography>Thông tin nhà cung cấp</Typography>
            //         <Box className="manufacturer-info">{importOrder.manufactorName}</Box>
            //         <hr />

            //         <Typography>
            //           VỊ TRÍ NHẬP: <strong>{importOrder.wareHouseName}</strong>
            //         </Typography>
            //         <Box>ĐỊA CHỈ:</Box>
            //         <Typography>
            //           <strong>
            //             {importOrder.wardName} - {importOrder.districtName} -{' '}
            //             {importOrder.provinceName}
            //           </strong>
            //         </Typography>
            //       </Card>
            //       <Card className="panel-information">
            //         <Grid
            //           container
            //           direction="row"
            //           justifyContent="center"
            //           alignItems="stretch"
            //           marginTop={1}
            //           spacing={3}
            //         >
            //           <Grid
            //             item
            //             xs={12}
            //           >
            //             {!!listConsignments && listConsignments.length > 0 ? (
            //               <Box>
            //                 <ConsignmentsTable listConsignments={listConsignments} />
            //                 <CustomTablePagination
            //                   page={page}
            //                   pages={pages}
            //                   rowsPerPage={rowsPerPage}
            //                   totalRecord={totalRecord}
            //                   handleChangePage={handleChangePage}
            //                   handleChangeRowsPerPage={handleChangeRowsPerPage}
            //                 />
            //               </Box>
            //             ) : (
            //               <Box> Phiếu nhập chưa có lô hàng nào </Box>
            //             )}
            //           </Grid>
            //         </Grid>
            //       </Card>
            //     </div>
            //     <div className="right-panel">
            //       <Card className="panel-information">
            //         <div className="panel-user-creates-order">
            //           <Box>
            //             Người tạo đơn: <i> {importOrder.createBy}</i>
            //           </Box>
            //           <LocalizationProvider
            //             locale={vi}
            //             dateAdapter={AdapterDateFns}
            //           >
            //             <Typography>Ngày tạo đơn</Typography>
            //             <DateTimePicker
            //               readOnly
            //               value={importOrder.createDate}
            //               renderInput={(params) => (
            //                 <TextField
            //                   variant="standard"
            //                   {...params}
            //                   helperText={null}
            //                 />
            //               )}
            //             />
            //           </LocalizationProvider>
            //         </div>
            //         <div className="panel-user-confirms-order">
            //           <Box>
            //             Người xác nhận: <i> {dataTest.confirmUser}</i>
            //           </Box>
            //           {importOrder.confirmDate && (
            //             <LocalizationProvider
            //               locale={vi}
            //               dateAdapter={AdapterDateFns}
            //             >
            //               <Typography>Ngày nhập kho</Typography>
            //               <DateTimePicker
            //                 readOnly
            //                 value={importOrder.confirmDate}
            //                 renderInput={(params) => (
            //                   <TextField
            //                     variant="standard"
            //                     {...params}
            //                     helperText={null}
            //                   />
            //                 )}
            //               />
            //             </LocalizationProvider>
            //           )}
            //         </div>
            //       </Card>
            //       <Card className="panel-information">
            //         <Typography>GHI CHÚ</Typography>
            //         <div>{importOrder.description}</div>
            //       </Card>
            //     </div>
            //   </div>
            // </Container>
          )}
        </>
      )}
    </>
  );
};

export default ImportOrderDetail;
