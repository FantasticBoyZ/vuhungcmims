import CustomTablePagination from '@/components/Common/TablePagination';
import ConsignmentsTable from '@/pages/Transaction/ImportList/ImportOrderDetail/ConsignmentsTable';
import { getImportOrderById } from '@/slices/ImportOrderSlice';
import { getProductByImportOrderId } from '@/slices/ProductSlice';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Box, Button, Card, Container, Grid, TextField, Typography } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { unwrapResult } from '@reduxjs/toolkit';
import { vi } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './style.css';
const ImportOrderDetail = () => {
  const { importOrderId } = useParams();
  const [importOrder, setImportOrder] = useState();
  const [listConsignments, setListConsignments] = useState([]);
  const [createdDate] = useState(new Date().getTime());
  const [confirmedDate] = useState(new Date().getTime());
  const pages = [2, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
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

  useEffect(() => {
    const fetchImportOrderDetail = async () => {
      try {
        const params = {
          orderId: importOrderId,
        };
        const actionResult = await dispatch(getImportOrderById(params));
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

    fetchImportOrderDetail();
    fetchProductListByImportOrderId();
  }, [page, rowsPerPage]);

  return (
    <>
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          {importOrder && (
            <Container maxWidth="xl">
              <div className="title-container">
                <div className="title-order">
                  <div className="button-back">
                    <Button
                      variant="text"
                      startIcon={<ArrowBackIosNewIcon />}
                      color="inherit"
                    >
                      Quay trở lại
                    </Button>
                  </div>
                  <Box className="label-order-code">
                    <b>Phiếu nhập kho số: </b>
                    {importOrder.billRefernce}{' '}
                  </Box>
                </div>
                <div className="status-oder">{importOrder.statusName}</div>
              </div>
              <div className="container">
                <div className="left-panel">
                  <Card className="panel-information ">
                    <Typography>Thông tin nhà cung cấp</Typography>
                    <Box className="manufacturer-info">{importOrder.manufactorName}</Box>
                    <hr />

                    <Typography>
                      VỊ TRÍ NHẬP: <strong>{importOrder.wareHouseName}</strong>
                    </Typography>
                    <Box>ĐỊA CHỈ:</Box>
                    <Typography>
                      <strong>
                        {importOrder.wardName} - {importOrder.districtName} -{' '}
                        {importOrder.provinceName}
                      </strong>
                    </Typography>
                  </Card>
                  <Card className="panel-information">
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="stretch"
                      marginTop={1}
                      spacing={3}
                    >
                      <Grid
                        item
                        xs={12}
                      >
                        {listConsignments ? (
                          <Box>
                            <ConsignmentsTable listConsignments={listConsignments} />
                            <CustomTablePagination
                              page={page}
                              pages={pages}
                              rowsPerPage={rowsPerPage}
                              totalRecord={totalRecord}
                              handleChangePage={handleChangePage}
                              handleChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                          </Box>
                        ) : (
                          <Box> Phiếu nhập chưa có lô hàng nào </Box>
                        )}
                      </Grid>
                    </Grid>
                  </Card>
                </div>
                <div className="right-panel">
                  <Card className="panel-information">
                    <div className="panel-user-creates-order">
                      <Box>
                        Người tạo đơn: <i> {importOrder.createBy}</i>
                      </Box>
                      <LocalizationProvider
                        locale={vi}
                        dateAdapter={AdapterDateFns}
                      >
                        <Typography>Ngày tạo đơn</Typography>
                        <DateTimePicker
                          readOnly
                          value={importOrder.createDate}
                          renderInput={(params) => (
                            <TextField
                              variant="standard"
                              {...params}
                              helperText={null}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </div>
                    <div className="panel-user-confirms-order">
                      <Box>
                        Người xác nhận: <i> {dataTest.confirmUser}</i>
                      </Box>
                      <LocalizationProvider
                        locale={vi}
                        dateAdapter={AdapterDateFns}
                      >
                        <Typography>Ngày nhập kho</Typography>
                        <DateTimePicker
                          readOnly
                          value={confirmedDate}
                          renderInput={(params) => (
                            <TextField
                              variant="standard"
                              {...params}
                              helperText={null}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </div>
                  </Card>
                  <Card className="panel-information">
                    <Typography>GHI CHÚ</Typography>
                    <div>{importOrder.description}</div>
                  </Card>
                </div>
              </div>
            </Container>
          )}
        </>
      )}
    </>
  );
};

export default ImportOrderDetail;
