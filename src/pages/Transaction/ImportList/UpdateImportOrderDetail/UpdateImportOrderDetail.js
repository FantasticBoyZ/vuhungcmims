import AlertPopup from '@/components/Common/AlertPopup';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import {
  confirmImportOrder,
  getImportOrderById,
  updateImportOrder,
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
  FormHelperText,
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
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import { FieldArray, Form, Formik } from 'formik';
import * as Yup from 'yup';
import ButtonWrapper from '@/components/Common/FormsUI/Button';
import { getWarehouseList } from '@/slices/WarehouseSlice';
import TooltipUnitMeasure from '@/components/Common/TooltipUnitMeasure';
import IconRequired from '@/components/Common/IconRequired';

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
  table: {
    textAlign: 'center',
    '& thead th': {
      backgroundColor: '#DCF4FC',
    },
    '& tbody tr:hover': {
      // cursor: 'pointer',
    },
  },
}));

const warehouseData = [
  {
    id: 1,
    name: 'Kho 1',
  },
  {
    id: 2,
    name: 'Kho 2',
  },
  {
    id: 3,
    name: 'Kho 3',
  },
  {
    id: 4,
    name: 'Kho 4',
  },
];

const UpdateImportOrderDetail = () => {
  const classes = useStyles();
  const { importOrderId } = useParams();
  const [importOrder, setImportOrder] = useState();
  const [listConsignments, setListConsignments] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isConfirm, setIsConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [createdDate] = useState(new Date().getTime());
  const [confirmedDate] = useState(new Date().getTime());
  const [selectedWarehouse, setSelectedWarehouse] = useState();
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [warehouseList, setWarehouseList] = useState([]);
  const navigate = useNavigate();
  const today = new Date();
  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();
  const errorFormik = useRef();

  const FORM_VALIDATION = Yup.object().shape({
    // manufactorId: Yup.string().required('B???n ch??a ch???n nh?? cung c???p'),
    wareHouseId: Yup.number().required('B???n ch??a ch???n kho ????? nh???p h??ng'),
    description: Yup.string().max(255, 'M?? t??? kh??ng th??? d??i qu?? 255 k?? t???'),
  });

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
    const listConsignments = valueFormik.current?.consignments;
    if (listConsignments !== undefined && listConsignments?.length > 0) {
      for (let index = 0; index < listConsignments.length; index++) {
        totalAmount =
          totalAmount +
          +listConsignments[index]?.quantity * +listConsignments[index]?.unitPrice;
      }
    }

    return totalAmount;
  };

  const handleOnClickConfirm = () => {
    setErrorMessage('');
    setTitle('B???n c?? ch???c ch???n mu???n l??u l???i ch???nh s???a kh??ng?');
    setMessage('H??y ki???m tra k??? th??ng tin tr?????c khi x??c nh???n.');
    setIsConfirm(true);
    if (FormatDataUtils.isEmptyObject(errorFormik.current)) {
      setOpenPopup(true);
    }
  };

  const handleOnClickCancel = () => {
    setTitle('B???n c?? ch???c ch???n mu???n h???y t???t c??? nh???ng ch???nh s???a kh??ng?');
    setMessage('');
    setIsConfirm(false);
    setOpenPopup(true);
  };

  const handleConfirm = async () => {
    if (isConfirm) {
      const values = valueFormik.current;
      let consignmentRequests = [];
      if (values.consignments) {
        for (let index = 0; index < values.consignments.length; index++) {
          const consignment = values.consignments[index];
          if (consignment.quantity === '' || consignment.unitPrice === '') {
            setErrorMessage('B???n c?? s???n ph???m ch??a nh???p s??? l?????ng ho???c ????n gi??');
            setOpenPopup(true);
            return;
          }
          if (consignment.quantity <= 0) {
            setErrorMessage('Vui l??ng nh???p s???n ph???m v???i s??? l?????ng l???n h??n 0');
            setOpenPopup(true);
            return;
          }

          if (!Number.isInteger(consignment.quantity)) {
            setErrorMessage('Vui l??ng nh???p s??? l?????ng s???n ph???m l?? s??? nguy??n');
            setOpenPopup(true);
            return;
          }

          if (!Number.isInteger(consignment.unitPrice)) {
            setErrorMessage('Vui l??ng nh???p ????n gi?? c???a s???n ph???m l?? s??? nguy??n');
            setOpenPopup(true);
            return;
          }

          if (consignment.unitPrice < 0) {
            setErrorMessage('Vui l??ng nh???p ????n gi?? l???n h??n ho???c b???ng 0');
            setOpenPopup(true);
            return;
          }

          if (
            new Date(consignment.expirationDate) < new Date() &&
            !!consignment.expirationDate
          ) {
            setErrorMessage('Vui l??ng nh???p h???n l??u kho trong t????ng lai');
            setOpenPopup(true);
            return;
          }

          if (consignment.quantity > 0) {
            const expirationDate = new Date(consignment.expirationDate);
            consignmentRequests.push({
              consignmentId: consignment.consignmentId,
              productId: consignment.productId,
              expirationDate: !!consignment.expirationDate
                ? new Date(
                    expirationDate.getTime() -
                      expirationDate.getTimezoneOffset() * 60 * 1000,
                  ).toJSON()
                : null,
              importDate: new Date(consignment.importDate).toJSON(),
              unitPrice: Math.round(
                consignment.selectedUnitMeasure === consignment.wrapUnitMeasure
                  ? consignment.unitPrice / consignment.numberOfWrapUnitMeasure
                  : consignment.unitPrice,
              ),
              quantity: Math.round(
                consignment.selectedUnitMeasure === consignment.wrapUnitMeasure
                  ? consignment.quantity * consignment.numberOfWrapUnitMeasure
                  : consignment.quantity,
              ),
            });
          }
        }
      }
      if (consignmentRequests.length > 0) {
        console.log('X??c nh???n');
        const editedImportOrder = {
          orderId: importOrderId,
          billReferenceNumber: values.billRefernce,
          createDate: values.createDate,
          description: values.description,
          userId: values.userId,
          manufactorId: values.manufactorId,
          wareHouseId: values.wareHouseId,
          consignmentRequests: consignmentRequests,
        };
        console.log(editedImportOrder);
        try {
          const actionResult = await dispatch(updateImportOrder(editedImportOrder));
          const result = unwrapResult(actionResult);
          if (!!result) {
            if (!!result.data.status && result.data.status === 200) {
              toast.success(result.data.message);
            } else {
              toast.success('S???a ????n nh???p kho th??nh c??ng!');
            }
            // fetchImportOrderDetail();
            // fetchProductListByImportOrderId();
            setOpenPopup(false);
            navigate(`/import/detail/${importOrderId}`);
          }
        } catch (error) {
          console.log('Failed to update importOder: ', error);
          if (error.message) {
            toast.error(error.message);
          } else {
            toast.error('S???a phi???u nh???p kho th???t b???i');
          }
        }
      } else {
        // TODO: in ra l???i v?? kh??ng c?? s???n ph???m h???p l???
        console.log('Vui l??ng nh???p s??? l?????ng s???n ph???m tr?????c khi l??u ????n nh???p kho');
        setErrorMessage('Vui l??ng nh???p s??? l?????ng s???n ph???m tr?????c khi l??u ????n nh???p kho');
        setOpenPopup(true);
        return;
      }
    } else {
      console.log('Hu???');
      navigate(`/import/detail/${importOrderId}`);
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
        dataResult.data &&
        !FormatDataUtils.isEmptyObject(dataResult.data.inforDetail)
      ) {
        if (dataResult.data.inforDetail.statusName !== 'pending') {
          navigate(`/import/detail/${importOrderId}`);
        }
        setImportOrder(dataResult.data.inforDetail);
        setSelectedWarehouse(dataResult.data.inforDetail.wareHouseId);
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
        pageIndex: page,
        pageSize: rowsPerPage,
        orderId: importOrderId,
      };
      const actionResult = await dispatch(getProductByImportOrderId(params));
      const dataResult = unwrapResult(actionResult);
      if (dataResult.data) {
        setListConsignments(dataResult.data.listProduct);
        // dataResult.data.listProduct?.forEach((consignment) => {
        //   arrayHelpersRef.current?.push(consignment);
        // });

        // setTotalRecord(dataResult.data.totalRecord);
        // console.log('totalRecord', dataResult.data.totalRecord);
      }
      console.log('Product List', dataResult);
    } catch (error) {
      console.log('Failed to fetch product list by importOder: ', error);
    }
  };

  const getAllWarehouse = async () => {
    try {
      const actionResult = await dispatch(getWarehouseList());
      const dataResult = unwrapResult(actionResult);
      console.log('warehouse list', dataResult.data);
      if (dataResult.data) {
        setWarehouseList(dataResult.data.warehouse);
      }
    } catch (error) {
      console.log('Failed to fetch warehouse list: ', error);
    }
  };

  useEffect(() => {
    if (isNaN(importOrderId)) {
      navigate('/404');
    } else {
      getAllWarehouse();
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
          {importOrder && listConsignments && (
            <Formik
              enableReinitialize={true}
              initialValues={{ ...importOrder, consignments: [...listConsignments] }}
              validationSchema={FORM_VALIDATION}
              onSubmit={(values) => handleConfirm(values)}
            >
              {({ values, errors, setFieldValue }) => (
                <Form>
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
                              <Button
                                variant="contained"
                                startIcon={<Edit />}
                                color="warning"
                                onClick={() => handleOnClickConfirm()}
                              >
                                L??u ch???nh s???a
                              </Button>
                              <Button
                                variant="contained"
                                startIcon={<Close />}
                                color="error"
                                onClick={() => handleOnClickCancel()}
                              >
                                Hu??? ch???nh s???a
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
                              <Typography variant="h6">Th??ng tin nh?? cung c???p</Typography>
                              <Box className="manufacturer-info">
                                {importOrder.manufactorName}
                              </Box>
                              <br />
                              <Divider />
                              <br />
                              <Typography variant="h6">
                                Th??ng tin l??u kho
                                <IconRequired />
                              </Typography>
                              <br />
                              {!!warehouseData && (
                                <Box className="selectbox-warehouse">
                                  <Select
                                    classNamePrefix="select"
                                    placeholder="Ch???n kho h??ng..."
                                    noOptionsMessage={() => (
                                      <>Kh??ng c?? t??m th???y kho n??o</>
                                    )}
                                    isClearable={true}
                                    isSearchable={true}
                                    name="warehouse"
                                    value={FormatDataUtils.getSelectedOption(
                                      warehouseList,
                                      selectedWarehouse,
                                    )}
                                    options={FormatDataUtils.getOptionWithIdandName(
                                      warehouseList,
                                    )}
                                    menuPortalTarget={document.body}
                                    styles={{
                                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    }}
                                    onChange={(e) => {
                                      setFieldValue('wareHouseId', e?.value);
                                      setSelectedWarehouse(e?.value);
                                    }}
                                  />
                                  <FormHelperText
                                    error={true}
                                    className="error-text-helper"
                                  >
                                    {errors.wareHouseId}
                                  </FormHelperText>
                                </Box>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid
                          xs={12}
                          item
                        >
                          <Card className={classes.cardTable}>
                            {!!listConsignments && listConsignments?.length > 0 ? (
                              <Box>
                                <TableContainer>
                                  <Table className={classes.table}>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>STT</TableCell>
                                        <TableCell>M?? s???n ph???m</TableCell>
                                        <TableCell>T??n s???n ph???m</TableCell>
                                        <TableCell>H???n l??u kho</TableCell>
                                        <TableCell>????n v???</TableCell>
                                        <TableCell>S??? l?????ng</TableCell>
                                        <TableCell>????n gi??</TableCell>
                                        <TableCell>Th??nh ti???n</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      <FieldArray
                                        name="consignments"
                                        render={(arrayHelpers) => {
                                          arrayHelpersRef.current = arrayHelpers;
                                          valueFormik.current = values;
                                          errorFormik.current = errors;
                                          return (
                                            <>
                                              {values.consignments.map(
                                                (consignment, index) => (
                                                  <TableRow
                                                    hover
                                                    key={index}
                                                    //   selected={islistConsignmentselected}
                                                    selected={false}
                                                  >
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>
                                                      {consignment?.productCode}
                                                    </TableCell>
                                                    <TableCell>
                                                      {consignment?.productName}
                                                    </TableCell>
                                                    <TableCell>
                                                      <LocalizationProvider
                                                        className="date-picker"
                                                        locale={vi}
                                                        dateAdapter={AdapterDateFns}
                                                      >
                                                        <DatePicker
                                                          onChange={(value) => {
                                                            setFieldValue(
                                                              `consignments[${index}].expirationDate`,
                                                              value,
                                                              false,
                                                            );
                                                          }}
                                                          minDate={today}
                                                          value={
                                                            values.consignments[index]
                                                              .expirationDate
                                                          }
                                                          renderInput={(params) => (
                                                            <TextField
                                                              variant="standard"
                                                              {...params}
                                                              helperText={null}
                                                            />
                                                          )}
                                                        />
                                                      </LocalizationProvider>
                                                    </TableCell>
                                                    <TableCell>
                                                      {consignment?.wrapUnitMeasure ==
                                                      null ? (
                                                        consignment?.unitMeasure
                                                      ) : (
                                                        <Stack
                                                          direction="row"
                                                          className={
                                                            classes.selectBoxUnitMeasure
                                                          }
                                                        >
                                                          <Select
                                                            classNamePrefix="select"
                                                            defaultValue={
                                                              FormatDataUtils.getOption([
                                                                {
                                                                  number: 1,
                                                                  name: consignment?.unitMeasure,
                                                                },
                                                                {
                                                                  number:
                                                                    consignment?.numberOfWrapUnitMeasure,
                                                                  name: consignment?.wrapUnitMeasure,
                                                                },
                                                              ])[0]
                                                            }
                                                            options={FormatDataUtils.getOption(
                                                              [
                                                                {
                                                                  number: 1,
                                                                  name: consignment?.unitMeasure,
                                                                },
                                                                {
                                                                  number:
                                                                    consignment?.numberOfWrapUnitMeasure,
                                                                  name: consignment?.wrapUnitMeasure,
                                                                },
                                                              ],
                                                            )}
                                                            menuPortalTarget={
                                                              document.body
                                                            }
                                                            styles={{
                                                              menuPortal: (base) => ({
                                                                ...base,
                                                                zIndex: 9999,
                                                              }),
                                                            }}
                                                            onChange={(e) => {
                                                              setFieldValue(
                                                                `consignments[${index}].selectedUnitMeasure`,
                                                                e.value.name,
                                                              );
                                                              // change quantity when change unitMeasure
                                                              if (
                                                                values.consignments[index]
                                                                  .quantity > 0 &&
                                                                e.value.name !==
                                                                  values.consignments[
                                                                    index
                                                                  ].selectedUnitMeasure
                                                              ) {
                                                                if (
                                                                  e.value.name ===
                                                                  values.consignments[
                                                                    index
                                                                  ].wrapUnitMeasure
                                                                ) {
                                                                  setFieldValue(
                                                                    `consignments[${index}].quantity`,
                                                                    Math.round(
                                                                      values.consignments[
                                                                        index
                                                                      ].quantity /
                                                                        e.value.number,
                                                                    ),
                                                                  );
                                                                }

                                                                if (
                                                                  e.value.name ===
                                                                  values.consignments[
                                                                    index
                                                                  ].unitMeasure
                                                                ) {
                                                                  setFieldValue(
                                                                    `consignments[${index}].quantity`,
                                                                    Math.round(
                                                                      values.consignments[
                                                                        index
                                                                      ].quantity *
                                                                        values
                                                                          .consignments[
                                                                          index
                                                                        ]
                                                                          .numberOfWrapUnitMeasure,
                                                                    ),
                                                                  );
                                                                }
                                                              }
                                                              // change unitPrice when change unitMeasure
                                                              if (
                                                                values.consignments[index]
                                                                  .unitPrice > 0 &&
                                                                e.value.name !==
                                                                  values.consignments[
                                                                    index
                                                                  ].selectedUnitMeasure
                                                              ) {
                                                                if (
                                                                  e.value.name ===
                                                                  values.consignments[
                                                                    index
                                                                  ].wrapUnitMeasure
                                                                ) {
                                                                  setFieldValue(
                                                                    `consignments[${index}].unitPrice`,
                                                                    Math.round(
                                                                      values.consignments[
                                                                        index
                                                                      ].unitPrice *
                                                                        e.value.number,
                                                                    ),
                                                                  );
                                                                }

                                                                if (
                                                                  e.value.name ===
                                                                  values.consignments[
                                                                    index
                                                                  ].unitMeasure
                                                                ) {
                                                                  setFieldValue(
                                                                    `consignments[${index}].unitPrice`,
                                                                    Math.round(
                                                                      values.consignments[
                                                                        index
                                                                      ].unitPrice /
                                                                        values
                                                                          .consignments[
                                                                          index
                                                                        ]
                                                                          .numberOfWrapUnitMeasure,
                                                                    ),
                                                                  );
                                                                }
                                                              }
                                                            }}
                                                          />
                                                          {values.consignments[index]
                                                            .selectedUnitMeasure ===
                                                            consignment.wrapUnitMeasure && (
                                                            <TooltipUnitMeasure
                                                              wrapUnitMeasure={
                                                                consignment.wrapUnitMeasure
                                                              }
                                                              numberOfWrapUnitMeasure={
                                                                consignment.numberOfWrapUnitMeasure
                                                              }
                                                              unitMeasure={
                                                                consignment.unitMeasure
                                                              }
                                                              isConvert={false}
                                                            />
                                                          )}
                                                        </Stack>
                                                      )}
                                                    </TableCell>
                                                    <TableCell>
                                                      <TextfieldWrapper
                                                        name={`consignments[${index}].quantity`}
                                                        variant="standard"
                                                        className="text-field-quantity"
                                                        type={'number'}
                                                        InputProps={{
                                                          inputProps: {
                                                            min: 0,
                                                          },
                                                        }}
                                                      />
                                                    </TableCell>
                                                    <TableCell>
                                                      <TextfieldWrapper
                                                        name={`consignments[${index}].unitPrice`}
                                                        variant="standard"
                                                        className="text-field-unit-price"
                                                        type={'number'}
                                                        InputProps={{
                                                          inputProps: {
                                                            min: 0,
                                                          },
                                                        }}
                                                      />
                                                    </TableCell>
                                                    <TableCell>
                                                      {FormatDataUtils.formatCurrency(
                                                        values.consignments[index]
                                                          .quantity *
                                                          values.consignments[index]
                                                            .unitPrice,
                                                      )}
                                                    </TableCell>
                                                  </TableRow>
                                                ),
                                              )}
                                            </>
                                          );
                                        }}
                                      />
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </Box>
                            ) : (
                              <Box> Phi???u nh???p ch??a c?? l?? h??ng n??o </Box>
                            )}
                          </Card>
                          {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
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
                              <br />
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
                              <br />
                              {importOrder.confirmDate && (
                                <Box>
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
                                    {FormatDataUtils.formatDateTime(
                                      importOrder.confirmDate,
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
                              <Typography variant="h6">Ghi ch??</Typography>
                              <TextfieldWrapper
                                id="description"
                                className="text-area-note"
                                name="description"
                                variant="outlined"
                                rows={6}
                                // maxRows={6}
                                multiline
                              />
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
                  title="T???ng gi?? tr??? ????n h??ng"
                /> */}
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
                      title={errorMessage ? 'Ch?? ??' : title}
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
                </Form>
              )}
            </Formik>
          )}
        </>
      )}
    </>
  );
};

export default UpdateImportOrderDetail;
