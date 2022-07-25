import AlertPopup from '@/components/Common/AlertPopup';
import ButtonWrapper from '@/components/Common/FormsUI/Button';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import AuthService from '@/services/authService';
import importOrderService from '@/services/importOrderService';
import { getManufacturerList } from '@/slices/ManufacturerSlice';
import { getProductList } from '@/slices/ProductSlice';
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
  const [manufacturerList, setManufacturerList] = useState();
  const [searchManufacturerParams, setSearchManufacturerParams] = useState();
  const [productList, setProductList] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const currentUser = AuthService.getCurrentUser();
  const today = new Date();
  const classes = useStyles();
  const [initialProductList, setInitialProductList] = useState({
    billReferenceNumber: '',
    createdDate: new Date(
      today.getTime() - today.getTimezoneOffset() * 60 * 1000,
    ).toJSON(),
    description: '',
    userId: currentUser.id,
    manufactorId: '',
    wareHouseId: '',
    consignmentRequests: [
      // {
      //   productId: '',
      //   productCode: '',
      //   importDate: null,
      //   name: '',
      //   expirationDate: '',
      //   quantity: '',
      //   unitPrice: '',
      // },
    ],
  });

  const FORM_VALIDATION = Yup.object().shape({
    manufactorId: Yup.string().required('Bạn chưa chọn nhà cung cấp'),
    wareHouseId: Yup.number().required('Bạn chưa chọn kho để nhập hàng'),
  });

  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => ({ ...state.products }));

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
    name: 'Gạch Gốm Đất Việt 50x50',
    unitMeasure: 'vien',
    wrapUnitMeasure: 'hop',
    numberOfWrapUnitMeasure: 4,
  };
  const testProductSelectedData2 = {
    id: 2,
    manufacturerId: 1,
    productCode: 'TEST002',
    name: 'Gạch Men Gốm Đất Việt 40x40',
    unitMeasure: 'vien',
    wrapUnitMeasure: null,
    numberOfWrapUnitMeasure: null,
  };

  const handleOnChangeManufacturer = (e) => {
    // console.log(e.value);
    if (e !== null) {
      getProductListByManufacturerId(e.value.id);
      setSelectedProduct(null);
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
      setErrorMessage(' Vui lòng chọn ít nhất 1 sản phẩm để nhập hàng');
      setOpenPopup(true);
      return;
    }
    for (let index = 0; index < consignments.length; index++) {
      if (consignments[index]?.quantity === '' || consignments[index]?.unitPrice === '') {
        setErrorMessage('Bạn có sản phẩm chưa nhập số lượng hoặc đơn giá');
        setOpenPopup(true);
        return;
      }
      if (consignments[index]?.quantity === 0) {
        setErrorMessage('Bạn không thể nhập sản phẩm với số lượng bằng 0');
        setOpenPopup(true);
        return;
      }
      console.log('timezone', (new Date().getTimezoneOffset()) / 60)
      consignmentRequests.push({
        productId: consignments[index]?.productId,
        expirationDate: new Date(consignments[index]?.expirationDate + (new Date().getTimezoneOffset()) / 60).toJSON(),
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
    console.log('test new', newImportOrder);
    importOrderService.createImportOrder(newImportOrder).then(
      (response) => {
        toast.success('Tạo phiếu nhập hàng thành công');
        console.log(response.data);
        navigate('/import/list');
      },
      (error) => {
        toast.error('Tạo phiếu nhập hàng thất bại');
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
      const actionResult = await dispatch(getManufacturerList(params));
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
      const params = {
        // pageIndex: page + 1,
        // pageSize: rowsPerPage,
        manufactorId: manufacturerId,
      };
      const actionResult = await dispatch(getProductList(params));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setProductList(dataResult.data.product);
      }
    } catch (error) {
      console.log('Failed to fetch product list: ', error);
    }
  };

  useEffect(() => {
    fetchManufacturerList();
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
                  <div className="label">Thông tin nhà cung cấp</div>
                  {manufacturerList && (
                    <Select
                      classNamePrefix="select"
                      placeholder="Chọn nhà cung cấp..."
                      noOptionsMessage={() => <>Không có tìm thấy nhà cung cấp nào</>}
                      isClearable={true}
                      isSearchable={true}
                      name="manufacturer"
                      options={getOption(manufacturerList)}
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      onChange={(e) => {
                        setFieldValue('manufactorId', e?.value.id || '');
                        setFieldValue('consignmentRequests', []);
                        handleOnChangeManufacturer(e);
                      }}
                    />
                  )}
                  <FormHelperText
                    error={true}
                    className="error-text-helper"
                  >
                    {errors.manufactorId}
                  </FormHelperText>
                  {/* <pre>{JSON.stringify(errors, null, 2)}</pre> */}
                </Card>
                <Card className="product-list-container">
                  <div className="label">Thông tin các sản phẩm</div>
                  {!!productList && !!values.manufactorId && (
                    <Select
                      classNamePrefix="select"
                      placeholder="Chọn sản phẩm của nhà cung cấp phía trên..."
                      noOptionsMessage={() => <>Không có tìm thấy sản phẩm nào</>}
                      isClearable={true}
                      isSearchable={true}
                      isLoading={loading}
                      loadingMessage={() => <>Đang tìm kiếm sản phẩm...</>}
                      name="product"
                      value={selectedProduct}
                      options={getOption(productList)}
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      onChange={(e) => handleOnChangeProduct(e)}
                    />
                  )}

                  <hr />
                  <TableContainer>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell>STT</TableCell>
                          <TableCell>Mã sản phẩm</TableCell>
                          <TableCell>Tên sản phẩm</TableCell>
                          <TableCell>Ngày hết hạn</TableCell>
                          <TableCell>Đơn vị tính</TableCell>
                          <TableCell>Số lượng</TableCell>
                          <TableCell>Đơn giá</TableCell>
                          <TableCell>Thành tiền</TableCell>
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
                                    placeholder="Ngày hết hạn"
                                    name={`consignmentRequests[${index}].expirationDate`}
                                  /> */}
                                    </TableCell>
                                    <TableCell>
                                      {item.wrapUnitMeasure == null ? (
                                        item.unitMeasure
                                      ) : (
                                        <Select
                                          className={classes.unitMeasureSelect}
                                          classNamePrefix="select"
                                          // value={getOption([
                                          //   {
                                          //     number: 1,
                                          //     name: item.unitMeasure,
                                          //   },
                                          //   {
                                          //     number: item.numberOfWrapUnitMeasure,
                                          //     name: item.wrapUnitMeasure,
                                          //   },
                                          // ]).filter((option) => {
                                          //   return (
                                          //     option.label === item.selectedUnitMeasure
                                          //   );
                                          // })}
                                          onChange={(e) => {
                                            setFieldValue(
                                              `consignmentRequests[${index}].selectedUnitMeasure`,
                                              e.value.name,
                                            );
                                            // change quantity when change unitMeasure
                                            if (
                                              values.consignmentRequests[index].quantity >
                                                0 &&
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
                  <div className="label">Thông tin đơn hàng</div>
                  <div className="time">
                    {/* chỗ này là createdDate */}
                    {FormatDataUtils.formatDate(today)}
                  </div>
                  <div className="label-field">Vị trí lưu kho</div>
                  <Box className="selectbox-warehouse">
                    <Select
                      classNamePrefix="select"
                      placeholder="Chọn kho hàng..."
                      noOptionsMessage={() => <>Không có tìm thấy kho nào</>}
                      isClearable={true}
                      isSearchable={true}
                      name="warehouse"
                      options={getOption(warehouseData)}
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      onChange={(e) => {
                        setFieldValue('wareHouseId', e?.value.id);
                      }}
                    />
                    <FormHelperText
                      error={true}
                      className="error-text-helper"
                    >
                      {errors.wareHouseId}
                    </FormHelperText>
                  </Box>
                  <div className="label-field">Tham chiếu</div>
                  <div className="margin-bottom-16">
                    <TextfieldWrapper
                      id="referenceNumber"
                      name="billReferenceNumber"
                      variant="standard"
                      fullWidth
                    />
                  </div>
                  <div className="label-field">Ghi chú</div>
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
                      <div>Tổng tiền:</div>
                      <div>{FormatDataUtils.formatCurrency(calculateTotalAmount())}</div>
                    </div>
                    <div className="button-import">
                      <ButtonWrapper
                        type="button"
                        variant="contained"
                        size="large"
                        startIcon={<CheckIcon />}
                        color="success"
                      >
                        Tạo phiếu nhập kho
                      </ButtonWrapper>
                    </div>
                  </Stack>
                </Card>
              </div>
              <AlertPopup
                title="Chú ý"
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
