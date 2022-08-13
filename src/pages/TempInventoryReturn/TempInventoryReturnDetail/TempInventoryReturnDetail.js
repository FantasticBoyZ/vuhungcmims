import AlertPopup from '@/components/Common/AlertPopup';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import CustomTablePagination from '@/components/Common/TablePagination';
import AuthService from '@/services/authService';
import {
  cancelTempInventoryReturn,
  confirmTempInventoryReturn,
  getTempInventoryReturnById,
} from '@/slices/TempInventoryReturnSlice';
import FormatDataUtils from '@/utils/formatData';
import { Close, Done, Edit } from '@mui/icons-material';
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
import TempReturnTable from './TempReturnTable';

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

const TempInventoryReturnDetail = () => {
  const classes = useStyles();
  const { tempInventoryReturnId } = useParams();
  const [tempInventoryReturn, setTempInventoryReturn] = useState();
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
  const { loading } = useSelector((state) => ({ ...state.tempInventoryReturn }));

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
    setTitle('Bạn có chắc chắn muốn xác nhận trả hàng không?');
    setMessage('Hãy kiểm tra kỹ hàng hóa trước khi xác nhận.');
    setIsConfirm(true);
    setOpenPopup(true);
  };

  const handleOnClickEdit = () => {
    navigate(`/term-inventory/return/edit/${tempInventoryReturnId}`);
  };

  const handleOnClickCancel = () => {
    setTitle('Bạn có chắc chắn muốn hủy phiếu lưu kho này không?');
    setMessage('');
    setIsConfirm(false);
    setOpenPopup(true);
  };

  const handleConfirm = async () => {
    if (isConfirm) {
      console.log('Xác nhận');
      try {
        const userConfirmedId = AuthService.getCurrentUser().id;
        const params = { tempInventoryReturnId, userConfirmedId };
        const actionResult = await dispatch(confirmTempInventoryReturn(params));
        const result = unwrapResult(actionResult);
        if (!!result) {
          if (!!result.message) {
            toast.success(result.message);
          } else {
            toast.success('Xác nhận trả hàng thành công!');
          }
          fetchTempInventoryReturnDetail();
          setOpenPopup(false);
        }
      } catch (error) {
        console.log('Failed to confirm tempInventoryReturn: ', error);
      }
    } else {
      console.log('Huỷ');
      try {
        const userDeleteId = AuthService.getCurrentUser().id;
        const params = { tempInventoryReturnId, userDeleteId };
        const actionResult = await dispatch(cancelTempInventoryReturn(params));
        const result = unwrapResult(actionResult);
        if (!!result) {
          if (!!result.message) {
            toast.success(result.message);
          } else {
            toast.success('Huỷ lưu kho thành công!');
          }
          fetchTempInventoryReturnDetail();
          setOpenPopup(false);
        }
      } catch (error) {
        console.log('Failed to cancel importOder: ', error);
      }
    }
  };

  const fetchTempInventoryReturnDetail = async () => {
    try {
      // const params = {
      //   orderId: tempInventoryReturnId,
      // };
      const actionResult = await dispatch(
        getTempInventoryReturnById(tempInventoryReturnId),
      );
      const dataResult = unwrapResult(actionResult);
      if (dataResult.data) {
        setTempInventoryReturn(dataResult.data.returnToManufacturerDetail);
        setListConsignments(
          dataResult.data.returnToManufacturerDetail.listReturnToManufacturerDetail,
        );
      } else {
        navigate('/404');
      }
      console.log('tempInventory Detail', dataResult);
    } catch (error) {
      console.log('Failed to fetch tempInventory detail: ', error);
    }
  };

  useEffect(() => {
    if (isNaN(tempInventoryReturnId)) {
      navigate('/404');
    } else {
      fetchTempInventoryReturnDetail();
    }
  }, [page, rowsPerPage]);

  return (
    <>
      {loading ? (
        <ProgressCircleLoading />
      ) : (
        <>
          {tempInventoryReturn && (
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
                        <strong>Phiếu lưu kho số:</strong>{' '}
                        {'LUUKHO' + tempInventoryReturnId}
                      </Typography>{' '}
                      <span>
                        {FormatDataUtils.getStatusLabel(tempInventoryReturn.statusName)}
                      </span>
                    </Box>
                    {tempInventoryReturn.statusName === 'pending' && (
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
                            Xác nhận trả hàng
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
                            Chỉnh sửa
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          startIcon={<Close />}
                          color="error"
                          onClick={() => handleOnClickCancel()}
                        >
                          Huỷ phiếu trả hàng
                        </Button>
                      </Stack>
                    )}
                    {/* {tempInventoryReturn.statusName === 'completed' && (
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
                        <Typography variant="h6">Thông tin trả hàng</Typography>
                        <Stack py={1}>
                          <Stack
                            direction="row"
                            spacing={2}
                          >
                            <Stack flex={2}>
                              <Typography>Nhà cung cấp:</Typography>
                            </Stack>
                            <Stack flex={8}>
                              <Link
                                href={`/manufacturer/detail/${tempInventoryReturn.manufacturerId}`}
                                underline="none"
                              >
                                {tempInventoryReturn.manufacturerName}
                              </Link>
                            </Stack>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={2}
                          >
                            <Stack flex={2}>
                              <Typography>Ngày dự kiến trả:</Typography>
                            </Stack>
                            <Stack flex={8}>
                              <Typography>
                                {tempInventoryReturn.expectedReturnDate
                                  ? FormatDataUtils.formatDate(
                                      tempInventoryReturn.expectedReturnDate,
                                    )
                                  : tempInventoryReturn.expectedReturnDate}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Stack>

                        <Divider />

                        <Stack py={1}>
                          <Typography variant="h6">Thông tin lưu kho</Typography>
                          <Typography>
                            Vị trí: {tempInventoryReturn.wareHouseName}
                          </Typography>
                          <Typography>
                            Địa chỉ: {tempInventoryReturn.wareHouseAddress}
                          </Typography>
                        </Stack>
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
                          <TempReturnTable listConsignments={listConsignments} />
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
                        {/* <br /> */}
                        <Typography>
                          Người tạo đơn:{' '}
                          <i>
                            {tempInventoryReturn.fullNameCreate +
                              '(' +
                              tempInventoryReturn.userCreateName +
                              ')'}
                          </i>
                        </Typography>
                        <Typography>Ngày tạo đơn:</Typography>
                        <Typography>
                          {FormatDataUtils.formatDateTime(tempInventoryReturn.createDate)}
                        </Typography>

                        {tempInventoryReturn.confirmedDate && (
                          <Box>
                            <br />
                            <Typography>
                              Người xác nhận:{' '}
                              <i>{tempInventoryReturn.userConfirmedName}</i>
                            </Typography>
                            <Typography>Ngày xác nhận:</Typography>
                            <Typography>
                              {FormatDataUtils.formatDateTime(
                                tempInventoryReturn.confirmedDate,
                              )}
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
                      <CardContent className={classes.orderNote}>
                        <Typography variant="h6">Ghi chú</Typography>
                        <Typography>{tempInventoryReturn.description}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid
                    xs={12}
                    item
                  >
                    <Card>
                      <CardContent className={classes.totalAmount}>
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
        </>
      )}
    </>
  );
};

export default TempInventoryReturnDetail;
