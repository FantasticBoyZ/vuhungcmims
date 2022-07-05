import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import FormatDataUtils from '@/utils/formatData';
import { Delete, Done } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
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
import { makeStyles } from '@mui/styles';
import { FieldArray, Form, Formik } from 'formik';
import { Fragment, useRef } from 'react';
import Select from 'react-select';
import * as Yup from 'yup';

const useStyles = makeStyles({
  cardInfo: { minHeight: '69vh' },
  cardTable: {
    minHeight: '90vh',
  },
  totalAmount: {
    marginBottom: '24px',
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
  rowConsignment: {
    backgroundColor: 'rgba(217, 217, 217, 0.5)',
    boxShadow: '15px',
  },
  tableCellConsignment: {
    padding: '0 !important',
  },
  tableCosignment: {
    // marginTop: '0',
    '& thead th': {
      // fontWeight: '600',
      // color: theme.palette.primary.main,
      backgroundColor: 'rgba(217, 217, 217, 0.5)',
    },
  },
  tableColumnIcon: {
    // maxWidth: '50px',
    padding: '15px 0 !important',
  },
  selectBoxUnitMeasure: {
    maxWidth: '90px',
  },
});

const productListDataTest = [
  {
    id: 1,
    productCode: 'GACH23',
    name: 'Gạch men 60x60',
    unitMeasure: 'Viên',
    quantity: 0,
    unitPrice: 100000,
    consignments: [
      {
        id: 1,
        warehouseId: 1,
        warehourseName: 'Kho 1',
        importDate: '16/07/2022',
        expirationDate: '30/12/2022',
        quantity: '0',
        quantityInstock: '500',
      },
      {
        id: 2,
        warehouseId: 1,
        warehourseName: 'Kho 1',
        importDate: '20/07/2022',
        expirationDate: '30/12/2022',
        quantity: '0',
        quantityInstock: '1000',
      },
    ],
  },
  {
    id: 2,
    productCode: 'GACH33',
    name: 'Gạch men 30x30',
    unitMeasure: 'Viên',
    quantity: 0,
    unitPrice: 100000,
    consignments: [
      {
        id: 1,
        warehouseId: 1,
        warehourseName: 'Kho 1',
        importDate: '16/07/2022',
        expirationDate: '30/12/2022',
        quantity: '0',
        quantityInstock: '500',
      },
    ],
  },
];

const ExportGoods = () => {
  const initialExportOrder = {
    billReferenceNumber: '',
    statusName: '',
    creatorId: '',
    createdDate: new Date(),
    description: '',
    productList: [
      {
        id: 1,
        productCode: 'GACH23',
        productName: 'Gạch men 60x60',
        unitMeasure: 'Viên',
        quantity: 0,
        unitPrice: 100000,
        consignments: [
          {
            id: 1,
            warehouseId: 1,
            warehourseName: 'Kho 1',
            importDate: '16/07/2022',
            expirationDate: '30/12/2022',
            quantity: '0',
            quantityInstock: '500',
          },
          {
            id: 2,
            warehouseId: 1,
            warehourseName: 'Kho 1',
            importDate: '20/07/2022',
            expirationDate: '30/12/2022',
            quantity: '0',
            quantityInstock: '1000',
          },
        ],
      },
      {
        id: 2,
        productCode: 'GACH23',
        productName: 'Gạch men 60x60',
        unitMeasure: 'Viên',
        quantity: 0,
        unitPrice: 100000,
        consignments: [
          {
            id: 1,
            warehouseId: 1,
            warehourseName: 'Kho 1',
            importDate: '16/07/2022',
            expirationDate: '30/12/2022',
            quantity: '0',
            quantityInstock: '500',
          },
        ],
      },
    ],
  };
  const FORM_VALIDATION = Yup.object().shape({
    manufactorId: Yup.string().required('Bạn chưa chọn nhà cung cấp'),
    wareHouseId: Yup.number().required('Bạn chưa chọn kho để nhập hàng'),
  });

  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();

  const classes = useStyles();

  const handleOnChangeProduct = (e) => {
    const isSelected = valueFormik.current.productList.some((element) => {
      // console.log('element 215',element)
      if (element.id === e.value.id) {
        return true;
      }

      return false;
    });

    const productSelected = {
      id: e.value.id,
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

  const calculateTotalQuantityOfProduct = (product) => {
    console.log(product);
    let totalQuantity = 0;
    if (product.consignments !== undefined && product.consignments?.length > 0) {
      product?.consignments.forEach((consignment) => {
        totalQuantity = +totalQuantity + +consignment.quantity;
      });
    }
    return totalQuantity;
  };

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    if (valueFormik.current !== undefined) {
      const productList = valueFormik.current.productList;

      if (productList?.length > 0) {
        productList.forEach((product) => {
          let totalQuantity = 0;
          if (product.consignments !== undefined && product.consignments?.length > 0) {
            product.consignments?.forEach((consignment) => {
              totalQuantity = +totalQuantity + +consignment.quantity;
            });
          }
          totalAmount = totalAmount + totalQuantity * product.unitPrice;
        });
      }
    }
    return totalAmount;
  };

  const handleSubmit = () => {};
  return (
    <Box>
      <Formik
        enableReinitialize={true}
        initialValues={initialExportOrder}
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
                xs={9}
                item
              >
                <Card className={classes.cardTable}>
                  <CardHeader title="Thông tin các sản phẩm" />
                  <CardContent>
                    {/* {!!productList && ( */}
                    <Select
                      classNamePrefix="select"
                      placeholder="Chọn sản phẩm của nhà cung cấp phía trên..."
                      noOptionsMessage={() => <>Không có tìm thấy sản phẩm nào</>}
                      isClearable={true}
                      isSearchable={true}
                      //   isLoading={loading}
                      loadingMessage={() => <>Đang tìm kiếm sản phẩm...</>}
                      name="product"
                      //   value={selectedProduct}
                      //   options={FormatDataUtils.getOption(productList)}
                      options={FormatDataUtils.getOption(productListDataTest)}
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      onChange={(e) => handleOnChangeProduct(e)}
                    />
                    {/* )} */}
                    <br />
                    <Divider />
                    <br />
                    <TableContainer>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableColumnIcon}></TableCell>
                            <TableCell>STT</TableCell>
                            <TableCell>Mã sản phẩm</TableCell>
                            <TableCell colSpan={2}>Tên sản phẩm</TableCell>
                            <TableCell>Đơn vị</TableCell>
                            <TableCell align="center">Số lượng</TableCell>
                            <TableCell align="center">Đơn giá</TableCell>
                            <TableCell align="center">Thành tiền</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <FieldArray
                            name="productList"
                            render={(arrayHelpers) => {
                              arrayHelpersRef.current = arrayHelpers;
                              valueFormik.current = values;
                              return (
                                <>
                                  {values.productList.map((product, index) => (
                                    <Fragment key={index}>
                                      <TableRow
                                        // hover
                                        //   selected={islistProductselected}
                                        selected={false}
                                      >
                                        <TableCell
                                          className={classes.tableColumnIcon}
                                          align="center"
                                        >
                                          <IconButton
                                            aria-label="delete"
                                            size="large"
                                            onClick={() => {
                                              arrayHelpers.remove(index);
                                            }}
                                          >
                                            <Delete fontSize="inherit" />
                                          </IconButton>
                                        </TableCell>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{product?.productCode}</TableCell>
                                        <TableCell colSpan={2}>
                                          {product?.productName}
                                        </TableCell>
                                        <TableCell>
                                          {product?.wrapUnitMeasure == null ? (
                                            product?.unitMeasure
                                          ) : (
                                            <Box className={classes.selectBoxUnitMeasure}>
                                              <Select
                                                classNamePrefix="select"
                                                defaultValue={
                                                  FormatDataUtils.getOption([
                                                    {
                                                      number: 1,
                                                      name: product?.unitMeasure,
                                                    },
                                                    {
                                                      number:
                                                        product?.numberOfWrapUnitMeasure,
                                                      name: product?.wrapUnitMeasure,
                                                    },
                                                  ])[0]
                                                }
                                                options={FormatDataUtils.getOption([
                                                  {
                                                    number: 1,
                                                    name: product?.unitMeasure,
                                                  },
                                                  {
                                                    number:
                                                      product?.numberOfWrapUnitMeasure,
                                                    name: product?.wrapUnitMeasure,
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
                                            </Box>
                                          )}
                                        </TableCell>
                                        <TableCell align="center">
                                          {calculateTotalQuantityOfProduct(product)}
                                          {/* {product?.quantity} */}
                                        </TableCell>
                                        <TableCell align="center">
                                          {FormatDataUtils.formatCurrency(
                                            product?.unitPrice || '0',
                                          )}
                                        </TableCell>
                                        <TableCell align="center">
                                          {FormatDataUtils.formatCurrency(
                                            calculateTotalQuantityOfProduct(product) *
                                              product?.unitPrice,
                                          )}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow className={classes.rowConsignment}>
                                        <TableCell
                                          className={classes.tableColumnIcon}
                                        ></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell
                                          colSpan={5}
                                          className={classes.tableCellConsignment}
                                        >
                                          <Table className={classes.tableCosignment}>
                                            {/* <TableHead> */}

                                            {/* </TableHead> */}
                                            <TableBody>
                                              <TableRow>
                                                <TableCell>Vị trí</TableCell>
                                                <TableCell>Ngày nhập</TableCell>
                                                <TableCell>Hạn lưu kho</TableCell>
                                                <TableCell align="center">
                                                  Số lượng
                                                </TableCell>
                                                <TableCell align="center">
                                                  Tồn kho
                                                </TableCell>
                                              </TableRow>
                                              {product?.consignments?.map(
                                                (consignment, indexConsignment) => (
                                                  <TableRow key={indexConsignment}>
                                                    <TableCell>
                                                      {consignment?.warehourseName}
                                                    </TableCell>
                                                    <TableCell>
                                                      {consignment?.importDate}
                                                    </TableCell>
                                                    <TableCell>
                                                      {consignment?.expirationDate}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      <TextfieldWrapper
                                                        name={`productList[${index}].consignments[${indexConsignment}].quantity`}
                                                        variant="standard"
                                                        className="text-field-quantity"
                                                        type={'number'}
                                                        InputProps={{
                                                          inputProps: {
                                                            min: 0,
                                                            max: consignment?.quantityInstock,
                                                          },
                                                        }}
                                                        // onChange={(e) => {
                                                        //   setFieldValue(
                                                        //     `productList[${index}].consignments[${indexConsignment}].quantity`,
                                                        //     e?.target.value,
                                                        //   );
                                                        // }}
                                                      />
                                                      {/* {consignment?.quantity} */}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      {consignment?.quantityInstock}
                                                    </TableCell>
                                                  </TableRow>
                                                ),
                                              )}
                                            </TableBody>
                                          </Table>
                                        </TableCell>
                                        <TableCell></TableCell>
                                        <TableCell
                                          className={classes.tableCellConsignment}
                                        ></TableCell>
                                      </TableRow>
                                    </Fragment>
                                  ))}
                                </>
                              );
                            }}
                          ></FieldArray>
                        </TableBody>
                      </Table>
                      <pre>{JSON.stringify(values, null, 2)}</pre>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid
                xs={3}
                item
              >
                <Card>
                  <CardHeader title="Thông tin đơn xuất hàng" />
                  <CardContent className={classes.cardInfo}>
                    <Typography>{FormatDataUtils.formatDateTime(new Date())}</Typography>
                    <br />
                    <Typography>
                      <strong>Tham chiếu</strong>
                    </Typography>
                    <TextfieldWrapper
                      id="referenceNumber"
                      name="billReferenceNumber"
                      variant="standard"
                      placeholder="Số mã phiếu..."
                      fullWidth
                    />
                    <br />
                    <br />
                    <Typography>
                      <strong>Ghi chú</strong>
                    </Typography>
                    <TextfieldWrapper
                      id="description"
                      name="description"
                      variant="outlined"
                      multiline
                      rows={10}
                      fullWidth
                    />
                  </CardContent>
                  <CardContent>
                    <Box className={classes.totalAmount}>
                      <Typography
                        variant="h5"
                        align="center"
                      >
                        Tổng tiền:{' '}
                        {FormatDataUtils.formatCurrency(calculateTotalAmount())}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<Done />}
                      color="success"
                      fullWidth
                    >
                      Hoàn thành
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ExportGoods;
