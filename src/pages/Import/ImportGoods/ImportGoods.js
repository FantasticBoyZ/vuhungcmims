import AlertPopup from '@/components/Common/AlertPopup';
import ButtonWrapper from '@/components/Common/FormsUI/Button';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import AuthService from '@/services/authService';
import importOrderService from '@/services/importOrderService';
import { getAllManufacturer, getManufacturerList } from '@/slices/ManufacturerSlice';
import { getAllProductNotPaging, getProductList } from '@/slices/ProductSlice';
import { getAllWarehouseNotPaging, getWarehouseList } from '@/slices/WarehouseSlice';
import FormatDataUtils from '@/utils/formatData';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Card,
  FormHelperText,
  IconButton,
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
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { unwrapResult } from '@reduxjs/toolkit';
import { vi } from 'date-fns/locale';
import { FieldArray, Form, Formik, useField, useFormikContext } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import './style.css';
import LoadingButton from '@mui/lab/LoadingButton';
import TooltipUnitMeasure from '@/components/Common/TooltipUnitMeasure';
import IconRequired from '@/components/Common/IconRequired';

const useStyles = makeStyles({
  unitMeasureSelect: {
    width: '100px',
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
});

const DependentField = ({ name, ...otherProps }) => {
  const { values, touched, setFieldValue } = useFormikContext(); // get Formik state and helpers via React Context
  const [field, meta] = useField(name); // get the props/info necessary for a Formik <Field> (vs just an <input>)

  const configTextfield = {
    ...field,
    ...otherProps,
    // fullWidth: true,
    // variant: 'outlined'
  };

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }

  useEffect(() => {
    // set the values for this field based on those of another
    switch (values.country) {
      case 'USA':
        setFieldValue(name, 'Asia');
        break;
      case 'Kenya':
        setFieldValue(name, 'Africa');
        break;
      default:
        setFieldValue(name, 'Earth');
        break;
    }
  }, [values.country, touched, setFieldValue, name]); // make sure the component will update based on relevant changes

  return <TextField {...configTextfield} />;
};

const ImportGoods = () => {
  const [manufacturerList, setManufacturerList] = useState([]);
  const [searchManufacturerParams, setSearchManufacturerParams] = useState();
  const [warehouseList, setWarehouseList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const currentUser = AuthService.getCurrentUser();
  const [loadingButton, setLoadingButton] = useState(false);
  const today = new Date();
  const classes = useStyles();
  const [initialProductList, setInitialProductList] = useState({
    billReferenceNumber: '',
    createdDate: new Date(
      today.getTime() - today.getTimezoneOffset() * 60 * 1000,
    ).toJSON(),
    description: '',
    userId: currentUser?.id,
    manufactorId: '',
    wareHouseId: '',
    consignmentRequests: [],
  });

  const FORM_VALIDATION = Yup.object().shape({
    wareHouseId: Yup.number().required('B???n ch??a ch???n kho ????? nh???p h??ng'),
    manufactorId: Yup.number().required('B???n ch??a ch???n nh?? cung c???p'),
    description: Yup.string().max(255, 'M?? t??? kh??ng th??? d??i qu?? 255 k?? t???')
  });

  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => ({ ...state.products }));
  const manufacturerState = useSelector((state) => ({ ...state.manufacturers }));

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
  const getOption = (listData) => {
    return listData.map((data) => {
      return {
        value: data,
        label: data.name,
      };
    });
  };
  // const formatDate = (date) => {
  //   return format(new Date(date), 'dd/MM/yyyy HH:mm');
  // };

  const convertUTCDateToLocalDate = (date) => {
    var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    return newDate;
  };

  const testProductSelectedData = {
    id: 1,
    manufacturerId: 1,
    productCode: 'TEST001',
    name: 'G???ch G???m ?????t Vi???t 50x50',
    unitMeasure: 'vien',
    wrapUnitMeasure: 'hop',
    numberOfWrapUnitMeasure: 4,
  };
  const testProductSelectedData2 = {
    id: 2,
    manufacturerId: 1,
    productCode: 'TEST002',
    name: 'G???ch Men G???m ?????t Vi???t 40x40',
    unitMeasure: 'vien',
    wrapUnitMeasure: null,
    numberOfWrapUnitMeasure: null,
  };

  const handleOnChangeManufacturer = (e) => {
    console.log(e);
    setProductList([]);
    setSelectedProduct(null);
    if (e) {
      getProductListByManufacturerId(e);
    }
  };

  const handleOnChangeProduct = (e) => {
    console.log(e);
    setSelectedProduct(e);
    // console.log('value 211',e.value);
    // console.log(valueFormik.current);
    // check selected Product
    const isSelected = valueFormik.current.consignmentRequests.some((element) => {
      // console.log('element 215',element)
      if (element.productId === e.value.id) {
        return true;
      }

      return false;
    });

    const productSelected = {
      productId: e.value.id,
      name: e.value.name,
      productCode: e.value.productCode,
      unitMeasure: e.value.unitMeasure,
      wrapUnitMeasure: e.value.wrapUnitMeasure,
      selectedUnitMeasure: e.value.unitMeasure,
      numberOfWrapUnitMeasure: e.value.numberOfWrapUnitMeasure,
      expirationDate: null,
      quantity: '',
      unitPrice: '',
    };
    if (isSelected) {
      return;
    } else {
      arrayHelpersRef.current.push(productSelected);
      // console.log('productList', valueFormik.current);
    }
  };

  const handleSubmit = (values) => {
    // TODO: convert UTCDate to LocalDate before request to back-end

    let consignmentRequests = [];
    let consignments = values.consignmentRequests;
    if (consignments.length === 0) {
      setErrorMessage(' Vui l??ng ch???n ??t nh???t 1 s???n ph???m ????? nh???p h??ng');
      setOpenPopup(true);
      return;
    }
    for (let index = 0; index < consignments.length; index++) {
      if (consignments[index]?.quantity === '' || consignments[index]?.unitPrice === '') {
        setErrorMessage('B???n c?? s???n ph???m ch??a nh???p s??? l?????ng ho???c ????n gi??');
        setOpenPopup(true);
        return;
      }
      if (consignments[index]?.quantity === 0) {
        setErrorMessage('B???n kh??ng th??? nh???p s???n ph???m v???i s??? l?????ng b???ng 0');
        setOpenPopup(true);
        return;
      }

      if (!Number.isInteger(consignments[index]?.quantity)) {
        setErrorMessage('Vui l??ng nh???p s??? l?????ng s???n ph???m l?? s??? nguy??n');
        setOpenPopup(true);
        return;
      }

      if (!Number.isInteger(consignments[index]?.unitPrice)) {
        setErrorMessage('Vui l??ng nh???p ????n gi?? c???a s???n ph???m l?? s??? nguy??n');
        setOpenPopup(true);
        return;
      }

      console.log('timezone', new Date().getTimezoneOffset() / 60);
      consignmentRequests.push({
        productId: consignments[index]?.productId,
        expirationDate: consignments[index]?.expirationDate
          ? new Date(
              consignments[index]?.expirationDate + new Date().getTimezoneOffset() / 60,
            ).toJSON()
          : null,
        // expirationDate: new Date(FormatDataUtils.convertUTCDateToLocalDate(consignments[index]?.expirationDate)).toJSON(),
        unitPrice: Math.round(
          consignments[index]?.selectedUnitMeasure ===
            consignments[index]?.wrapUnitMeasure
            ? consignments[index]?.unitPrice /
                consignments[index]?.numberOfWrapUnitMeasure
            : consignments[index]?.unitPrice,
        ),
        quantity: Math.round(
          consignments[index]?.selectedUnitMeasure ===
            consignments[index]?.wrapUnitMeasure
            ? consignments[index]?.quantity * consignments[index]?.numberOfWrapUnitMeasure
            : consignments[index]?.quantity,
        ),
      });
    }
    const newImportOrder = {
      billReferenceNumber: values.billReferenceNumber,
      createdDate: values.createdDate,
      description: values.description,
      userId: values.userId,
      manufactorId: values.manufactorId,
      wareHouseId: values.wareHouseId,
      consignmentRequests: consignmentRequests,
    };
    // console.log('test new', newImportOrder);
    setLoadingButton(true);
    importOrderService.createImportOrder(newImportOrder).then(
      (response) => {
        console.log(response.data);
        if (response.data.status === 200) {
          toast.success('T???o phi???u nh???p h??ng th??nh c??ng');
          setLoadingButton(false);
          console.log(response.data);
          navigate('/import/list');
        } else {
          toast.error(response.data.message);
        }
      },
      (error) => {
        if (error.response.data.message) {
          toast.error(error.response.data.message);
          if (error.response.data.status === 405) {
            localStorage.clear();
            navigate('/');
          }
        } else {
          toast.error('T???o phi???u nh???p h??ng th???t b???i');
        }
        setLoadingButton(false);
        console.log(error);
      },
    );
  };

  const calculateTotalAmount = () => {
    let totalAmout = 0;
    if (valueFormik.current !== undefined) {
      const consignments = valueFormik.current.consignmentRequests;
      // console.log(valueFormik.current);
      for (let index = 0; index < consignments.length; index++) {
        totalAmout =
          totalAmout + consignments[index].quantity * consignments[index].unitPrice;
      }
    }

    return totalAmout;
  };

  const fetchManufacturerList = async () => {
    try {
      const params = {
        // pageIndex: page + 1,
        // pageSize: rowsPerPage,
        ...searchManufacturerParams,
      };
      const actionResult = await dispatch(getAllManufacturer(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        // setTotalRecord(dataResult.data.totalRecord);
        setManufacturerList(dataResult.data.manufacturer);
      }
    } catch (error) {
      console.log('Failed to fetch manufacturer list: ', error);
    }
  };

  const getProductListByManufacturerId = async (manufacturerId) => {
    try {
      const actionResult = await dispatch(getAllProductNotPaging(manufacturerId));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        if (dataResult.data.product === null) {
          setProductList([]);
        } else {
          setProductList(dataResult.data.product);
        }
      }
    } catch (error) {
      console.log('Failed to fetch product list: ', error);
    }
  };

  const getAllWarehouse = async () => {
    try {
      const actionResult = await dispatch(getAllWarehouseNotPaging());
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
    fetchManufacturerList();
    getAllWarehouse();
  }, []);

  return (
    <Box>
      <Formik
        enableReinitialize={true}
        initialValues={initialProductList}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ values, errors, setFieldValue }) => (
          <Form>
            <div className="container">
              <div className="left-container">
                <Card className="card-container">
                  <div className="label">
                    Th??ng tin nh?? cung c???p
                    <IconRequired />
                  </div>
                  {/* {manufacturerList && ( */}
                  <Box>
                    <Select
                      classNamePrefix="select"
                      placeholder="Ch???n nh?? cung c???p..."
                      noOptionsMessage={() => <>Kh??ng c?? t??m th???y nh?? cung c???p n??o</>}
                      isClearable={true}
                      isSearchable={true}
                      isLoading={manufacturerState.loading}
                      name="manufacturer"
                      options={FormatDataUtils.getOptionWithIdandName(manufacturerList)}
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      onChange={(e) => {
                        setFieldValue('manufactorId', e?.value);
                        setFieldValue('consignmentRequests', [], false);
                        handleOnChangeManufacturer(e?.value);
                      }}
                    />
                    <FormHelperText
                      error={true}
                      className="error-text-helper"
                    >
                      {errors.manufactorId}
                    </FormHelperText>
                  </Box>
                  {/* )} */}

                  {/* <pre>{JSON.stringify(errors, null, 2)}</pre> */}
                </Card>
                <Card className="product-list-container">
                  <div className="label">Th??ng tin c??c s???n ph???m</div>
                  {/* {!!productList && !!values.manufactorId && ( */}
                  <Select
                    classNamePrefix="select"
                    placeholder="Ch???n s???n ph???m c???a nh?? cung c???p ph??a tr??n..."
                    noOptionsMessage={() => <>Kh??ng c?? t??m th???y s???n ph???m n??o</>}
                    isClearable={true}
                    isSearchable={true}
                    isLoading={loading}
                    loadingMessage={() => <>??ang t??m ki???m s???n ph???m...</>}
                    name="product"
                    value={null}
                    options={getOption(productList)}
                    menuPortalTarget={document.body}
                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                    onChange={(e) => handleOnChangeProduct(e)}
                  />
                  {/* )} */}

                  <hr />
                  <TableContainer>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell>STT</TableCell>
                          <TableCell>M?? s???n ph???m</TableCell>
                          <TableCell>T??n s???n ph???m</TableCell>
                          <TableCell>Ng??y h???t h???n</TableCell>
                          <TableCell>????n v??? t??nh</TableCell>
                          <TableCell>S??? l?????ng</TableCell>
                          <TableCell>????n gi??</TableCell>
                          <TableCell>Th??nh ti???n</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <FieldArray
                          name="consignmentRequests"
                          render={(arrayHelpers) => {
                            arrayHelpersRef.current = arrayHelpers;
                            valueFormik.current = values;
                            return (
                              <>
                                {values.consignmentRequests.map((item, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      <IconButton
                                        aria-label="delete"
                                        size="large"
                                        onClick={() => {
                                          arrayHelpers.remove(index);
                                        }}
                                      >
                                        <DeleteIcon fontSize="inherit" />
                                      </IconButton>
                                    </TableCell>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{item.productCode}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>
                                      <LocalizationProvider
                                        className="date-picker"
                                        locale={vi}
                                        dateAdapter={AdapterDateFns}
                                      >
                                        <DatePicker
                                          onChange={(value) => {
                                            // setFieldValue(`consignmentRequests[${index}].expirationDate`, convertUTCDateToLocalDate(value).toISOString(), false)
                                            // fix bug date
                                            setFieldValue(
                                              `consignmentRequests[${index}].expirationDate`,
                                              value,
                                              false,
                                            );
                                            // console.log(value);
                                          }}
                                          minDate={today}
                                          value={
                                            values.consignmentRequests[index]
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
                                      {/* <DateTimePicker
                                    placeholder="Ng??y h???t h???n"
                                    name={`consignmentRequests[${index}].expirationDate`}
                                  /> */}
                                    </TableCell>
                                    <TableCell>
                                      {item.wrapUnitMeasure == null ? (
                                        item.unitMeasure
                                      ) : (
                                        <Stack
                                          direction="row"
                                          justifyContent="center"
                                        >
                                          <Select
                                            className={classes.unitMeasureSelect}
                                            classNamePrefix="select"
                                            onChange={(e) => {
                                              setFieldValue(
                                                `consignmentRequests[${index}].selectedUnitMeasure`,
                                                e.value.name,
                                              );
                                              // change quantity when change unitMeasure
                                              if (
                                                values.consignmentRequests[index]
                                                  .quantity > 0 &&
                                                e.value.name !==
                                                  values.consignmentRequests[index]
                                                    .selectedUnitMeasure
                                              ) {
                                                if (
                                                  e.value.name ===
                                                  values.consignmentRequests[index]
                                                    .wrapUnitMeasure
                                                ) {
                                                  setFieldValue(
                                                    `consignmentRequests[${index}].quantity`,
                                                    Math.round(
                                                      values.consignmentRequests[index]
                                                        .quantity / e.value.number,
                                                    ),
                                                  );
                                                }

                                                if (
                                                  e.value.name ===
                                                  values.consignmentRequests[index]
                                                    .unitMeasure
                                                ) {
                                                  setFieldValue(
                                                    `consignmentRequests[${index}].quantity`,
                                                    Math.round(
                                                      values.consignmentRequests[index]
                                                        .quantity *
                                                        values.consignmentRequests[index]
                                                          .numberOfWrapUnitMeasure,
                                                    ),
                                                  );
                                                }
                                              }
                                              // change unitPrice when change unitMeasure
                                              if (
                                                values.consignmentRequests[index]
                                                  .unitPrice > 0 &&
                                                e.value.name !==
                                                  values.consignmentRequests[index]
                                                    .selectedUnitMeasure
                                              ) {
                                                if (
                                                  e.value.name ===
                                                  values.consignmentRequests[index]
                                                    .wrapUnitMeasure
                                                ) {
                                                  setFieldValue(
                                                    `consignmentRequests[${index}].unitPrice`,
                                                    Math.round(
                                                      values.consignmentRequests[index]
                                                        .unitPrice * e.value.number,
                                                    ),
                                                  );
                                                }

                                                if (
                                                  e.value.name ===
                                                  values.consignmentRequests[index]
                                                    .unitMeasure
                                                ) {
                                                  setFieldValue(
                                                    `consignmentRequests[${index}].unitPrice`,
                                                    Math.round(
                                                      values.consignmentRequests[index]
                                                        .unitPrice /
                                                        values.consignmentRequests[index]
                                                          .numberOfWrapUnitMeasure,
                                                    ),
                                                  );
                                                }
                                              }
                                            }}
                                            defaultValue={
                                              getOption([
                                                {
                                                  number: 1,
                                                  name: item.unitMeasure,
                                                },
                                                {
                                                  number: item.numberOfWrapUnitMeasure,
                                                  name: item.wrapUnitMeasure,
                                                },
                                              ])[0]
                                            }
                                            options={getOption([
                                              {
                                                number: 1,
                                                name: item.unitMeasure,
                                              },
                                              {
                                                number: item.numberOfWrapUnitMeasure,
                                                name: item.wrapUnitMeasure,
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
                                          {values.consignmentRequests[index]
                                            .selectedUnitMeasure ===
                                            item.wrapUnitMeasure && (
                                            <TooltipUnitMeasure
                                              wrapUnitMeasure={item.wrapUnitMeasure}
                                              numberOfWrapUnitMeasure={
                                                item.numberOfWrapUnitMeasure
                                              }
                                              unitMeasure={item.unitMeasure}
                                              isConvert={false}
                                            />
                                          )}
                                        </Stack>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <TextfieldWrapper
                                        name={`consignmentRequests[${index}].quantity`}
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
                                        name={`consignmentRequests[${index}].unitPrice`}
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
                                        values.consignmentRequests[index].quantity *
                                          values.consignmentRequests[index].unitPrice,
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </>
                            );
                          }}
                        ></FieldArray>
                      </TableBody>
                    </Table>
                    {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                  </TableContainer>
                </Card>
              </div>
              <div className="right-container">
                <Card className="order-detail-container">
                  <div className="label">Th??ng tin ????n h??ng</div>
                  <div className="time">
                    {/* ch??? n??y l?? createdDate */}
                    {FormatDataUtils.formatDate(today)}
                  </div>
                  <div className="label-field">
                    V??? tr?? nh???p h??ng
                    <IconRequired />
                  </div>
                  {warehouseList && (
                    <Box className="selectbox-warehouse">
                      <Select
                        classNamePrefix="select"
                        placeholder="Ch???n kho h??ng..."
                        noOptionsMessage={() => <>Kh??ng c?? t??m th???y kho n??o</>}
                        isClearable={true}
                        isSearchable={true}
                        name="warehouse"
                        options={FormatDataUtils.getOptionWithIdandName(warehouseList)}
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        onChange={(e) => {
                          setFieldValue('wareHouseId', e?.value);
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
                  <div className="label-field">Tham chi???u</div>
                  <div className="margin-bottom-16">
                    <TextfieldWrapper
                      id="referenceNumber"
                      name="billReferenceNumber"
                      placeholder='S??? m?? phi???u...'
                      variant="standard"
                      fullWidth
                    />
                  </div>
                  <div className="label-field">Ghi ch??</div>
                  <TextfieldWrapper
                    id="description"
                    className="text-area-note"
                    name="description"
                    variant="outlined"
                    rows={6}
                    multiline
                  />
                  <Stack
                    mt={25}
                    justifyContent="flex-end"
                  >
                    <div className="total-amount">
                      <div>T???ng ti???n:</div>
                      <div>{FormatDataUtils.formatCurrency(calculateTotalAmount())}</div>
                    </div>
                    <div className="button-import">
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        size="large"
                        loading={loadingButton}
                        loadingPosition="start"
                        startIcon={<CheckIcon />}
                        color="success"
                      >
                        T???o phi???u nh???p kho
                      </LoadingButton>
                    </div>
                  </Stack>
                </Card>
              </div>
              <AlertPopup
                title="Ch?? ??"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
              >
                <Box
                  component={'span'}
                  className="popup-message-container"
                >
                  {errorMessage}
                </Box>
              </AlertPopup>
            </div>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ImportGoods;
