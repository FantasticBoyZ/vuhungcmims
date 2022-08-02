import AlertPopup from '@/components/Common/AlertPopup';
import ButtonWrapper from '@/components/Common/FormsUI/Button';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import AuthService from '@/services/authService';
import importOrderService from '@/services/importOrderService';
import { getManufacturerList } from '@/slices/ManufacturerSlice';
import { getProductList } from '@/slices/ProductSlice';
import { getWarehouseList } from '@/slices/WarehouseSlice';
import FormatDataUtils from '@/utils/formatData';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormHelperText,
  Grid,
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
import LoadingButton from '@mui/lab/LoadingButton';
import { AddBoxOutlined, Done } from '@mui/icons-material';
import IconRequired from '@/components/Common/IconRequired';
import Popup from '@/components/Common/Popup';
import ProductForm from './ProductForm';
import { createTempInventoryReturn } from '@/slices/TempInventoryReturnSlice';

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
  cardTitle: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  cardTable: {
    minHeight: '75vh',
  },
  cardTitleTable: {
    fontSize: '24px',
  },
  comboboxProduct: {
    width: '80%',
  },
  buttonAddProduct: {
    width: '20%',
  },
  time: {
    color: '#6C5F5F',
    textDecoration: 'underline',
  },
  comboboxWarehouse: {
    padding: '8px 0px',
  },
  descriptionContainer: {
    padding: '8px 0',
  },
  infoReturn: {
    minHeight: '90vh',
  },
  totalAmount: {
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonCreate: {
    display: 'flex',
    justifyContent: 'center',
  },
});

const TempInventoryReturnCreate = () => {
  const [manufacturerList, setManufacturerList] = useState([]);
  const [searchManufacturerParams, setSearchManufacturerParams] = useState();
  const [warehouseList, setWarehouseList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupAddProduct, setOpenPopupAddProduct] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const currentUser = AuthService.getCurrentUser();
  const [loadingButton, setLoadingButton] = useState(false);
  const today = new Date();
  const classes = useStyles();
  const [expectedReturnDate, setExpectedReturnDate] = useState(today);
  const [initialProductList, setInitialProductList] = useState({
    expectedReturnDate: '',
    totalAmout: '',
    description: '',
    userCreateId: currentUser.id,
    manufacturerId: '',
    warehouseId: '',
    consignmentRequests: [],
  });

  const FORM_VALIDATION = Yup.object().shape({
    warehouseId: Yup.number().required('Bạn chưa chọn kho để nhập hàng'),
    manufacturerId: Yup.number().required('Bạn chưa chọn nhà cung cấp'),
  });

  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => ({ ...state.products }));
  const manufacturerState = useSelector((state) => ({ ...state.manufacturers }));

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

  const handleAddProduct = (product) => {
    // console.log('product', product);
    const isSelected = valueFormik.current.consignmentRequests.some((element) => {
      // console.log('element 215',element)
      if (element.name === product.name && element.unitMeasure === product.unitMeasure) {
        return true;
      }

      return false;
    });
    const newProduct = {
      name: product.name,
      unitMeasure: product.unitMeasure,
      quantity: '',
      unitPrice: '',
    };
    if (!isSelected) {
      setErrorMessage('');
      arrayHelpersRef.current.push(newProduct);
      setOpenPopupAddProduct(false);
    } else {
      setErrorMessage('Sản phẩm này đã được thêm vào bảng');
    }
  };

  const handleSubmit = async (values) => {
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

      if (!Number.isInteger(consignments[index]?.quantity)) {
        setErrorMessage('Vui lòng nhập số lượng sản phẩm là số nguyên');
        setOpenPopup(true);
        return;
      }

      if (!Number.isInteger(consignments[index]?.unitPrice)) {
        setErrorMessage('Vui lòng nhập đơn giá của sản phẩm là số nguyên');
        setOpenPopup(true);
        return;
      }

      consignmentRequests.push({
        productId: consignments[index]?.productId,
        productName: consignments[index]?.name,
        unitMeasure: consignments[index]?.unitMeasure,
        unitPrice: consignments[index]?.selectedUnitMeasure
          ? Math.round(
              consignments[index]?.selectedUnitMeasure ===
                consignments[index]?.wrapUnitMeasure
                ? consignments[index]?.unitPrice /
                    consignments[index]?.numberOfWrapUnitMeasure
                : consignments[index]?.unitPrice,
            )
          : consignments[index]?.unitPrice,
        quantity: consignments[index]?.selectedUnitMeasure
          ? Math.round(
              consignments[index]?.selectedUnitMeasure ===
                consignments[index]?.wrapUnitMeasure
                ? consignments[index]?.quantity *
                    consignments[index]?.numberOfWrapUnitMeasure
                : consignments[index]?.quantity,
            )
          : consignments[index]?.quantity,
      });
    }
    const expectedReturnDate = new Date(values.expectedReturnDate);
    const tempReturnOrder = {
      // expectedReturnDate: new Date(
      //   values.expectedReturnDate + new Date().getTimezoneOffset() / 60,
      // ).toJSON(),
      expectedReturnDate: new Date(
        expectedReturnDate.getTime() - expectedReturnDate.getTimezoneOffset() * 60 * 1000,
      ).toJSON(),
      totalAmout: calculateTotalAmount(),
      description: values.description,
      userCreateId: values.userCreateId,
      manufacturerId: values.manufacturerId,
      warehouseId: values.warehouseId,
      listReturnToManufacturerDetailRequest: consignmentRequests,
    };
    console.log('test new', tempReturnOrder);
    setLoadingButton(true);

    if (consignmentRequests.length > 0) {
      try {
        const response = await dispatch(createTempInventoryReturn(tempReturnOrder));
        const resultResponse = unwrapResult(response);
        if (resultResponse) {
          toast.success('Tạo phiếu lưu kho thành công');
          console.log(resultResponse);
          setLoadingButton(false);
          navigate('/term-inventory/return/list');
        }
      } catch (error) {
        console.log('Failed to save temp inventory order: ', error);
        setLoadingButton(false);
        toast.error('Tạo phiếu lưu kho thất bại');
      }
    } else {
      setErrorMessage('Bạn không có lô hàng nào thoả mãn điều kiện lưu kho');
      setLoadingButton(false);
      setOpenPopup(true);
      return;
    }
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
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={9}
              >
                <Stack spacing={2}>
                  <Card>
                    <Stack p={2}>
                      <Box className={classes.cardTitle}>
                        <Typography variant="p">Trả về nhà cung cấp</Typography>
                        <IconRequired />
                      </Box>
                      <Box>
                        <Select
                          classNamePrefix="select"
                          placeholder="Chọn nhà cung cấp..."
                          noOptionsMessage={() => <>Không có tìm thấy nhà cung cấp nào</>}
                          isClearable={true}
                          isSearchable={true}
                          isLoading={manufacturerState.loading}
                          name="manufacturer"
                          options={FormatDataUtils.getOptionWithIdandName(
                            manufacturerList,
                          )}
                          menuPortalTarget={document.body}
                          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                          onChange={(e) => {
                            setFieldValue('manufacturerId', e?.value);
                            setFieldValue('consignmentRequests', [], false);
                            handleOnChangeManufacturer(e?.value);
                          }}
                        />
                        <FormHelperText
                          error={true}
                          className="error-text-helper"
                        >
                          {errors.manufacturerId}
                        </FormHelperText>
                      </Box>
                    </Stack>
                  </Card>
                  <Card className={classes.cardTable}>
                    <Stack
                      p={2}
                      spacing={2}
                    >
                      <Box className={classes.cardTitleTable}>
                        <Typography variant="p">Danh sách lưu kho</Typography>
                      </Box>
                      <Stack
                        direction="row"
                        spacing={2}
                      >
                        <Select
                          className={classes.comboboxProduct}
                          classNamePrefix="select"
                          placeholder="Chọn sản phẩm của nhà cung cấp phía trên..."
                          noOptionsMessage={() => <>Không có tìm thấy sản phẩm nào</>}
                          isClearable={true}
                          isSearchable={true}
                          isLoading={loading}
                          loadingMessage={() => <>Đang tìm kiếm sản phẩm...</>}
                          name="product"
                          value={selectedProduct}
                          options={FormatDataUtils.getOption(productList)}
                          menuPortalTarget={document.body}
                          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                          onChange={(e) => handleOnChangeProduct(e)}
                        />
                        <Button
                          className={classes.buttonAddProduct}
                          variant="outlined"
                          startIcon={<AddBoxOutlined />}
                          onClick={() => {
                            setErrorMessage('');
                            setOpenPopupAddProduct(true);
                          }}
                        >
                          Thêm sản phẩm
                        </Button>
                      </Stack>
                      <Divider />
                      <TableContainer>
                        <Table className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell></TableCell>
                              <TableCell>STT</TableCell>
                              <TableCell>Tên sản phẩm</TableCell>

                              <TableCell>Đơn vị</TableCell>
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

                                        <TableCell>{item.name}</TableCell>

                                        <TableCell>
                                          {item.wrapUnitMeasure == null ? (
                                            item.unitMeasure
                                          ) : (
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
                                                          values.consignmentRequests[
                                                            index
                                                          ].numberOfWrapUnitMeasure,
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
                                                          values.consignmentRequests[
                                                            index
                                                          ].numberOfWrapUnitMeasure,
                                                      ),
                                                    );
                                                  }
                                                }
                                              }}
                                              defaultValue={
                                                FormatDataUtils.getOption([
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
                                              options={FormatDataUtils.getOption([
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
                    </Stack>
                  </Card>
                </Stack>
              </Grid>
              <Grid
                item
                xs={3}
              >
                <Card className={classes.infoReturn}>
                  <Stack
                    p={2}
                    spacing={2}
                  >
                    <Box mb={2}>
                      <Typography
                        variant="p"
                        className={classes.cardTitle}
                      >
                        Thông tin lưu hàng
                      </Typography>
                      <Typography className={classes.time}>
                        {FormatDataUtils.formatDate(new Date())}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="p">
                        <strong>Vị trí lưu kho</strong>
                        <IconRequired />
                      </Typography>
                      <Box className={classes.comboboxWarehouse}>
                        <Select
                          classNamePrefix="select"
                          placeholder="Chọn kho hàng..."
                          noOptionsMessage={() => <>Không có tìm thấy kho nào</>}
                          isClearable={true}
                          isSearchable={true}
                          name="warehouse"
                          options={FormatDataUtils.getOptionWithIdandName(warehouseList)}
                          menuPortalTarget={document.body}
                          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                          onChange={(e) => {
                            setFieldValue('warehouseId', e?.value);
                          }}
                        />
                        <FormHelperText
                          error={true}
                          className="error-text-helper"
                        >
                          {errors.warehouseId}
                        </FormHelperText>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="p">
                        <strong>Ngày trả hàng dự kiến</strong>
                      </Typography>
                      <LocalizationProvider
                        // locale={vi}
                        dateAdapter={AdapterDateFns}
                      >
                        <DatePicker
                          value={expectedReturnDate}
                          onChange={(value) => {
                            // fix bug date
                            setFieldValue(`expectedReturnDate`, value);
                            setExpectedReturnDate(value);
                          }}
                          inputFormat="dd/MM/yyyy"
                          minDate={today}
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              variant="standard"
                              {...params}
                              helperText={null}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Box>
                    <Box className={classes.descriptionContainer}>
                      <Typography variant="p">
                        <strong>Ghi chú</strong>
                      </Typography>
                      <TextfieldWrapper
                        id="description"
                        className="text-area-note"
                        name="description"
                        variant="outlined"
                        rows={6}
                        multiline
                      />
                    </Box>
                  </Stack>
                  <Stack
                    p={2}
                    mt={25}
                  >
                    <Box className={classes.totalAmount}>
                      <Typography
                        variant="h5"
                        align="center"
                      >
                        Tổng tiền:
                      </Typography>
                      <Typography variant="h5">
                        {FormatDataUtils.formatCurrency(calculateTotalAmount())}
                      </Typography>
                    </Box>
                    <Box className={classes.buttonCreate}>
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        size="large"
                        loading={loadingButton}
                        loadingPosition="start"
                        startIcon={<Done />}
                        color="success"
                      >
                        Tạo phiếu lưu kho
                      </LoadingButton>
                    </Box>
                  </Stack>
                </Card>
              </Grid>
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
              <Popup
                title="Thêm sản phẩm"
                openPopup={openPopupAddProduct}
                setOpenPopup={setOpenPopupAddProduct}
              >
                <ProductForm
                  handleAddProduct={handleAddProduct}
                  setOpenPopupAddProduct={setOpenPopupAddProduct}
                  errorMessage={errorMessage}
                />
              </Popup>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default TempInventoryReturnCreate;
