import AlertPopup from '@/components/Common/AlertPopup';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import CustomTablePagination from '@/components/Common/TablePagination';
import AuthService from '@/services/authService';
import importOrderService from '@/services/importOrderService';
import {
  cancelImportOrder,
  confirmImportOrder,
  getImportOrderById,
} from '@/slices/ImportOrderSlice';
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
  Link,
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
    maxWidth: '25vw',
    minHeight: '20vh',
    wordBreak: 'break-word',
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
  const currentUserRole = AuthService.getCurrentUser().roles[0];
  const dataTest = {
    id: 1,
    orderCode: 'Test001',
    createUser: 'tui',
    confirmUser: null,
    manufacturer: 'C??ng ty A',
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
    navigate('/import/list');
  };

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    if (listConsignments !== undefined && listConsignments?.length > 0) {
      console.log(listConsignments);
      for (let index = 0; index < listConsignments.length; index++) {
        totalAmount =
          totalAmount +
          +listConsignments[index]?.quantity * +listConsignments[index]?.unitPrice;
      }
    }

    return totalAmount;
  };

  const handleOnClickConfirm = () => {
    setTitle('B???n c?? ch???c ch???n mu???n x??c nh???n r???ng nh???p kho th??nh c??ng?');
    setMessage('H??y ki???m tra k??? h??ng h??a tr?????c khi x??c nh???n.');
    setIsConfirm(true);
    setOpenPopup(true);
  };

  const handleOnClickEdit = () => {
    navigate(`/import/edit/${importOrderId}`);
  };

  const handleOnClickCancel = () => {
    setTitle('B???n c?? ch???c ch???n mu???n h???y phi???u nh???p n??y kh??ng?');
    setMessage('');
    setIsConfirm(false);
    setOpenPopup(true);
  };

  const handleConfirm = async () => {
    if (isConfirm) {
      console.log('X??c nh???n');
      try {
        const confirmUserId = AuthService.getCurrentUser().id;
        const params = { importOrderId, confirmUserId };
        const actionResult = await dispatch(confirmImportOrder(params));
        const result = unwrapResult(actionResult);
        if (!!result) {
          if (!!result.message) {
            toast.success(result.message);
          } else {
            toast.success('X??c nh???n nh???p kho th??nh c??ng!');
          }
          fetchImportOrderDetail();
          fetchProductListByImportOrderId();
          setOpenPopup(false);
        }
      } catch (error) {
        console.log('Failed to confirm importOder: ', error);
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error('L???i! X??c nh???n nh???p kho th???t b???i!');
        }
      }
    } else {
      console.log('Hu???');
      try {
        const confirmUserId = AuthService.getCurrentUser().id;
        const params = { importOrderId, confirmUserId };
        const actionResult = await dispatch(cancelImportOrder(params));
        const result = unwrapResult(actionResult);
        if (!!result) {
          if (!!result.message) {
            toast.success(result.message);
          } else {
            toast.success('Hu??? nh???p kho th??nh c??ng!');
          }
          fetchImportOrderDetail();
          fetchProductListByImportOrderId();
          setOpenPopup(false);
        }
      } catch (error) {
        console.log('Failed to cancel importOder: ', error);
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error('L???i! Hu??? nh???p kho th???t b???i!');
        }
      }
    }
  };

  const fetchImportOrderDetail = async () => {
    try {
      // const params = {
      //   orderId: importOrderId,
      // };
      const actionResult = await dispatch(getImportOrderById(importOrderId));
      const dataResult = unwrapResult(actionResult);
      if (
        dataResult.data.inforDetail &&
        !FormatDataUtils.isEmptyObject(dataResult.data.inforDetail)
      ) {
        setImportOrder(dataResult.data.inforDetail);
      } else {
        navigate('/404');
      }
      console.log('Import Order Detail', dataResult);
    } catch (error) {
      console.log('Failed to fetch importOrder detail: ', error);
    }
  };

  const fetchProductListByImportOrderId = async () => {
    try {
      const params = {
        // pageIndex: page,
        // pageSize: rowsPerPage,
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
    if (isNaN(importOrderId)) {
      navigate('/404');
    } else {
      fetchImportOrderDetail();
      fetchProductListByImportOrderId();
    }
  }, [page, rowsPerPage]);

  return (
    <>
      {loading ? (
        <ProgressCircleLoading />
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
                        <strong>Phi???u nh???p kho s???:</strong> {'NHAP' + importOrderId}
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
                        {(currentUserRole === 'ROLE_OWNER' ||
                          currentUserRole === 'ROLE_STOREKEEPER') && (
                          <Button
                            variant="contained"
                            startIcon={<Done />}
                            color="success"
                            onClick={() => handleOnClickConfirm()}
                          >
                            X??c nh???n nh???p kho
                          </Button>
                        )}
                        {(currentUserRole === 'ROLE_OWNER' ||
                          currentUserRole === 'ROLE_STOREKEEPER') && (
                          <Button
                            variant="contained"
                            startIcon={<Edit />}
                            color="warning"
                            onClick={() => handleOnClickEdit()}
                          >
                            Ch???nh s???a
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          startIcon={<Close />}
                          color="error"
                          onClick={() => handleOnClickCancel()}
                        >
                          Hu??? phi???u nh???p kho
                        </Button>
                      </Stack>
                    )}
                    {/* {importOrder.statusName === 'completed' && (
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
                          Tr??? h??ng
                        </Button>
                      </Stack>
                    )} */}
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
                        <Typography variant="h6">Th??ng tin nh?? cung c???p</Typography>
                        <Box className="manufacturer-info">
                          <Link
                            href={`/manufacturer/detail/${importOrder.manufactorId}`}
                            underline="none"
                          >
                            {importOrder.manufactorName}
                          </Link>
                        </Box>
                        <br />
                        <Divider />
                        <br />
                        <Typography variant="h6">Th??ng tin l??u kho</Typography>
                        <Typography>V??? tr??: {importOrder.wareHouseName}</Typography>
                        <Typography>
                          ?????a ch???: {importOrder.wardName} - {importOrder.districtName} -{' '}
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
                        <Box> Phi???u nh???p ch??a c?? l?? h??ng n??o </Box>
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
                        <Typography variant="h6">Th??ng tin x??c nh???n</Typography>
                        {/* <br /> */}
                        <Typography>
                          Ng?????i t???o ????n:{' '}
                          <i>
                            {importOrder.createdFullName +
                              '(' +
                              importOrder.createBy +
                              ')'}
                          </i>
                        </Typography>
                        <Typography>Ng??y t???o ????n:</Typography>
                        <Typography>
                          {FormatDataUtils.formatDateTime(importOrder.createDate)}
                        </Typography>

                        {importOrder.confirmDate && (
                          <Box>
                            <br />
                            <Typography>
                              Ng?????i x??c nh???n:{' '}
                              <i>
                                {importOrder.confirmByFullName +
                                  '(' +
                                  importOrder.confirmBy +
                                  ')'}
                              </i>
                            </Typography>
                            <Typography>Ng??y x??c nh???n:</Typography>
                            <Typography>
                              {FormatDataUtils.formatDateTime(importOrder.confirmDate)}
                            </Typography>
                          </Box>
                        )}
                        <br />
                        <Typography>
                          Tham chi???u: <i>{importOrder.billRefernce}</i>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid
                    xs={12}
                    item
                  >
                    <Card>
                      <CardContent className={classes.orderNote}>
                        <Typography variant="h6">Ghi ch??</Typography>
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
                        <Typography variant="h6">T???ng gi?? tr??? ????n h??ng</Typography>
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
        </>
      )}
    </>
  );
};

export default ImportOrderDetail;
