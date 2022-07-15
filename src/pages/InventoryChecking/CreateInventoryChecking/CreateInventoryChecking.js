import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import FormatDataUtils from '@/utils/formatData';
import { CloudUpload, Delete, FileDownload, Input } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { FieldArray, Form, Formik } from 'formik';
import { Fragment, useState } from 'react';
import Select from 'react-select';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  searchField: {
    width: '35%',
  },
  selectBox: {
    width: '50%',
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
  cardTable: {
    minHeight: '70vh',
    position: 'relative',
  },
  totalDifferentContainer: {
    width: '35%',
    position: 'absolute',
    right: 10,
    bottom: 0,
  },
}));

const warehouseList = [
  { id: 1, name: 'Kho 1' },
  { id: 2, name: 'Kho 2' },
  { id: 3, name: 'Kho 3' },
  { id: 4, name: 'Kho 4' },
  { id: 5, name: 'Kho 5' },
];

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

const CreateInventoryChecking = () => {
  const [warehouseId, setWarehouseId] = useState('');
  const classes = useStyles();

  const FORM_VALIDATION = Yup.object().shape({
    billReferenceNumber: Yup.string().required('Bạn chưa nhập mã phiếu tham chiếu'),
  });

  const handleChangeWarehouse = (event) => {
    setWarehouseId(event.target.value);
  };

  const handleSubmit = (values) => {
    console.log(values);
  };
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
                xs={6}
                item
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6">Chọn kho kiểm</Typography>
                    <Stack
                      direction="row"
                      py={2}
                      justifyContent="space-between"
                    >
                      <Box className={classes.selectBox}>
                        <Select
                          classNamePrefix="select"
                          placeholder="Chọn kho"
                          noOptionsMessage={() => <>Không có tìm thấy kho nào</>}
                          isClearable={true}
                          isSearchable={true}
                          //   isLoading={loading}
                          loadingMessage={() => <>Đang tìm kiếm kho...</>}
                          name="product"
                          //   value={selectedProduct}
                          options={FormatDataUtils.getOption(warehouseList)}
                          // options={FormatDataUtils.getOption(productListDataTest)}
                          menuPortalTarget={document.body}
                          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                          onChange={(e) => handleChangeWarehouse(e)}
                        />
                      </Box>
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<FileDownload />}
                      >
                        Xuất phiếu
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid
                xs={6}
                item
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      Nhập phiếu kiểm kho bằng bảng tính (file excel)
                    </Typography>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      py={2}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                      >
                        <Button
                          variant="outlined"
                          color="success"
                          startIcon={<CloudUpload />}
                        >
                          Nhập bảng tính
                        </Button>
                        <Typography>file.xls</Typography>
                      </Stack>

                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<Input />}
                      >
                        Nhập phiếu
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid
                xs={12}
                item
              >
                <Card>
                  <CardContent className={classes.cardTable}>
                    <Typography>Các sản phẩm kiểm kho</Typography>
                    <br />
                    <Select
                      classNamePrefix="select"
                      placeholder="Chọn sản phẩm từ kho trên"
                      noOptionsMessage={() => <>Không có tìm thấy sản phẩm nào</>}
                      isClearable={true}
                      isSearchable={true}
                      //   isLoading={loading}
                      loadingMessage={() => <>Đang tìm kiếm sản phẩm...</>}
                      name="product"
                      //   value={selectedProduct}
                      options={FormatDataUtils.getOption(warehouseList)}
                      // options={FormatDataUtils.getOption(productListDataTest)}
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      onChange={(e) => handleChangeWarehouse(e)}
                    />
                    <br />
                    <Divider />
                    <br />
                    <TableContainer>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              className={classes.tableColumnIcon}
                              align="center"
                            ></TableCell>
                            <TableCell align="center">STT</TableCell>
                            <TableCell>Mã sản phẩm</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Đơn vị</TableCell>
                            {/* <TableCell align="center">Số lượng</TableCell> */}
                            <TableCell align="center">Đơn giá</TableCell>
                            {/* <TableCell align="center">Thành tiền</TableCell> */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <FieldArray
                            name="productList"
                            render={(arrayHelpers) => {
                              //   arrayHelpersRef.current = arrayHelpers;
                              //   valueFormik.current = values;
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
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell>{product?.productCode}</TableCell>
                                        <TableCell>{product?.productName}</TableCell>
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
                                          {FormatDataUtils.formatCurrency(
                                            product?.unitPrice || '0',
                                          )}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow className={classes.rowConsignment}>
                                        <TableCell
                                          className={classes.tableColumnIcon}
                                        ></TableCell>
                                        <TableCell
                                          colSpan={5}
                                          className={classes.tableCellConsignment}
                                        >
                                          <Table className={classes.tableCosignment}>
                                            {/* <TableHead> */}

                                            {/* </TableHead> */}
                                            <TableBody>
                                              <TableRow>
                                                <TableCell align="center">
                                                  STT lô hàng
                                                </TableCell>
                                                <TableCell>Ngày nhập</TableCell>
                                                <TableCell>Hạn lưu kho</TableCell>
                                                <TableCell align="center">
                                                  Số lượng đầu
                                                </TableCell>
                                                <TableCell align="center">
                                                  Số lượng thực tế
                                                </TableCell>
                                                <TableCell align="center">
                                                  Giá trị chênh lệch
                                                </TableCell>
                                              </TableRow>
                                              {product?.consignments?.map(
                                                (consignment, indexConsignment) => (
                                                  <TableRow key={indexConsignment}>
                                                    <TableCell align="center">
                                                      {indexConsignment + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                      {FormatDataUtils.formatDate(
                                                        consignment?.importDate,
                                                      )}
                                                    </TableCell>
                                                    <TableCell>
                                                      {consignment?.expirationDate}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      {consignment?.quantityInstock}
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
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      {FormatDataUtils.formatCurrency(
                                                        (values.productList[index]
                                                          .consignments[indexConsignment]
                                                          .quantity -
                                                          values.productList[index]
                                                            .consignments[
                                                            indexConsignment
                                                          ].quantityInstock) *
                                                          values.productList[index]
                                                            .unitPrice,
                                                      )}
                                                    </TableCell>
                                                  </TableRow>
                                                ),
                                              )}
                                            </TableBody>
                                          </Table>
                                        </TableCell>
                                      </TableRow>
                                    </Fragment>
                                  ))}
                                </>
                              );
                            }}
                          ></FieldArray>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box className={classes.totalDifferentContainer}>
                      <Divider />
                      <Stack
                        direction="row"
                        p={2}
                        justifyContent="space-between"
                      >
                        <Typography className={classes.labelTotalDifferent}>
                          Tổng chênh lệch:
                        </Typography>
                        <Typography className={classes.totalDifferent}>
                          <b>{FormatDataUtils.formatCurrency(-1400000)}</b>
                        </Typography>
                      </Stack>
                    </Box>
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

export default CreateInventoryChecking;
