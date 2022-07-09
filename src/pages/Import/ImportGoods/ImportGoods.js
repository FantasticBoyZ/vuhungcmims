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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { unwrapResult } from '@reduxjs/toolkit';
import { vi } from 'date-fns/locale';
import { FieldArray, Form, Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import './style.css';

const ImportGoods = () => {
  const [manufacturerList, setManufacturerList] = useState();
  const [searchManufacturerParams, setSearchManufacturerParams] = useState();
  const [productList, setProductList] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const currentUser = AuthService.getCurrentUser();
  const today = new Date();
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
  const manufacturerData = [
    {
      id: 1,
      name: 'Vu Hung',
    },
    {
      id: 2,
      name: 'Ha Long',
    },
    {
      id: 3,
      name: 'Ngoc Sang',
    },
    {
      id: 4,
      name: 'Gom Dat Viet',
    },
  ];

  const productData = [
    {
      id: 1,
      manufacturerId: 1,
      productCode: 'TEST001',
      name: 'Gạch Gốm Đất Việt 50x50',
      unitMeasure: 'vien',
      wrapUnitMeasure: 'Hop',
      numberOfWrapUnitMeasure: 4,
    },
    {
      id: 2,
      manufacturerId: 1,
      productCode: 'TEST002',
      name: 'Gạch Gốm Đất Việt 50x50',
      unitMeasure: 'vien',
      wrapUnitMeasure: 'Hop',
      numberOfWrapUnitMeasure: 4,
    },
    {
      id: 3,
      manufacturerId: 1,
      productCode: 'TEST003',
      name: 'Gạch Gốm Đất Việt 50x50',
      unitMeasure: 'vien',
      wrapUnitMeasure: 'Hop',
      numberOfWrapUnitMeasure: 4,
    },
    {
      id: 4,
      manufacturerId: 1,
      productCode: 'TEST004',
      name: 'Gạch Gốm Đất Việt 50x50',
      unitMeasure: 'vien',
      wrapUnitMeasure: 'Hop',
      numberOfWrapUnitMeasure: 4,
    },
    {
      id: 5,
      manufacturerId: 1,
      productCode: 'TEST005',
      name: 'Gạch Gốm Đất Việt 50x50',
      unitMeasure: 'vien',
      wrapUnitMeasure: null,
      numberOfWrapUnitMeasure: null,
    },
  ];

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
      if (consignments[index]?.quantity === 0 ) {
        setErrorMessage('Bạn không thể nhập sản phẩm với số lượng bằng 0');
        setOpenPopup(true);
        return;
      }
    }
    importOrderService.createImportOrder(values).then(
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

    console.log(values);
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
                <Card className="card-container">
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
                    <Table>
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
                                    <TableCell>{index+1}</TableCell>
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
                                          classNamePrefix="select"
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
                <Card className="card-container">
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
                    />
                  </div>
                  <div className="label-field">Ghi chú</div>
                  <TextfieldWrapper
                    id="description"
                    className="text-area-note"
                    name="description"
                    variant="filled"
                    maxRows={6}
                    multiline
                  />
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
                    >
                      Nhập hàng
                    </ButtonWrapper>
                  </div>
                </Card>
              </div>
              <AlertPopup
                title="Chú ý"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
              >
                <Box component={'span'} className="popup-message-container">{errorMessage}</Box>
              </AlertPopup>
            </div>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ImportGoods;
