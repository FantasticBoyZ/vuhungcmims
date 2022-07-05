import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import IconRequired from '@/components/Common/IconRequired';
import CategoryService from '@/services/categoryService';
import { getManufacturerList } from '@/slices/ManufacturerSlice';
import { getProductDetail, saveProduct } from '@/slices/ProductSlice';
import FormatDataUtils from '@/utils/formatData';
import { Save } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormHelperText,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    padding: '24px',
    // marginBottom: '20px',
  },
  cardImage: {
    marginTop: '24px',
    height: '255px',
  },
  infoContainer: {
    display: 'flex',
    verticalAlign: 'center',
    justifyContent: 'center',
    padding: '12px',
  },
  wrapIcon: {
    verticalAlign: 'middle',
    display: 'inline-flex',
    width: '200px',
  },
  textfieldStyle: {
    flex: '5',
  },
  iconStyle: {
    fontSize: 'small',
    margin: '0 10px ',
    color: 'skyblue',
  },
}));

const subCategoryListTest = [
  { id: 1, name: 'Gạch 3x3' },
  { id: 2, name: 'Gạch Florentilo' },
];

const AddEditProductForm = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedManufacuter, setSelectedManufacturer] = useState('');
  const [loadingButton, setLoadingButton] = useState(false);
  const initialFormValue = {
    productCode: '',
    name: '',
    unitMeasure: '',
    wrapUnitMeasure: '',
    numberOfWrapUnitMeasure: '',
    color: '',
    description: '',
    categoryId: '',
    subCategoryId: '',
    manufactorId: '',
    imageUrl: '',
  };
  const [categoryList, setCategoryList] = useState([]);
  const [manufacturerList, setManufacturerList] = useState([]);
  const [isAdd, setIsAdd] = useState(true);
  const classes = useStyles();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, products } = useSelector((state) => ({ ...state.products }));

  const FORM_VALIDATION = Yup.object().shape({
    productCode: Yup.string().required('Chưa nhập mã sản phẩm'),
    name: Yup.string().required('Chưa nhập tên sản phẩm'),
    unitMeasure: Yup.string().required('Chưa nhập đơn vị'),
    categoryId: Yup.string().required('Chưa chọn danh mục'),
    manufactorId: Yup.string().required('Chưa chọn nhà cung cấp'),
  });

  const saveProductDetail = async (product) => {
    try {
      const actionResult = await dispatch(saveProduct(product));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);

      if (isAdd) {
        toast.success('Thêm sản phẩm thành công!');
        navigate('/product');
      } else {
        toast.success('Sửa sản phẩm thành công!');
        navigate(`/product/detail/${productId}`);
      }
    } catch (error) {
      console.log('Failed to save product: ', error);
      if (isAdd) {
        toast.error(error);
      } else {
        toast.error(error);
      }
    } finally {
      setLoadingButton(false);
    }
  };

  const handleSubmit = (values) => {
    setLoadingButton(true);
    const newProduct = {
      id: productId,
      name: values.name,
      productCode: values.productCode,
      unitMeasure: values.unitMeasure,
      wrapUnitMeasure: values.wrapUnitMeasure,
      numberOfWrapUnitMeasure: values.numberOfWrapUnitMeasure,
      color: values.color,
      description: values.description,
      categoryId: values.categoryId,
      manufactorId: values.manufactorId,
    };
    console.log(values);
    saveProductDetail(newProduct);
  };

  const handleOnClickExit = () => {
    // TODO: fix lỗi nút exit phần thêm mới
    navigate(isAdd ? '/product' : `/product/detail/${productId}`);
  };

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const params = {
          categoryName: '',
        };
        const response = await CategoryService.getCategoryList(params);
        console.log('response', response.data.category);
        const rawList = response.data.category;
        const result = rawList.reduce((obj, item) => {
          return {
            ...obj,
            [item.id]: item.name,
          };
        }, {});

        console.log('result', result);
        setCategoryList(response.data.category);
      } catch (error) {
        console.log('Failed to fetch category list: ', error);
      }
    };

    const fetchManufacturerList = async () => {
      try {
        const params = {
          // pageIndex: page + 1,
          // pageSize: rowsPerPage,
          // ...searchParams,
        };
        const actionResult = await dispatch(getManufacturerList(params));
        const dataResult = unwrapResult(actionResult);
        console.log('dataResult', dataResult);
        if (dataResult.data) {
          setManufacturerList(dataResult.data.manufacturer);
        }
      } catch (error) {
        console.log('Failed to fetch category list: ', error);
      }
    };

    const fetchProductDetail = async () => {
      try {
        const params = {
          productId: productId,
        };
        const actionResult = await dispatch(getProductDetail(params));
        const dataResult = unwrapResult(actionResult);
        if (dataResult.data) {
          setProduct(dataResult.data.product);
          setSelectedCategory(
            FormatDataUtils.getSelectedOption(
              categoryList,
              dataResult.data.product.categoryId,
            ),
          );
        }
        console.log('dataResult', dataResult);
      } catch (error) {
        console.log('Failed to fetch product detail: ', error);
      }
    };
    fetchCategoryList();
    fetchManufacturerList();
    if (!!productId) {
      setIsAdd(false);
      if (!!categoryList && !!manufacturerList) {
        fetchProductDetail();
      }
    }
  }, [productId]);
  return (
    <Box padding="20px">
      {/* Update Product */}
      {loading && !isAdd ? (
        <>Loading...</>
      ) : (
        <Box>
          {!!product && (
            <Formik
              initialValues={{ ...product }}
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
                      <Card>
                        <CardHeader
                          title={isAdd ? 'Thêm mới sản phẩm' : 'Sửa sản phẩm'}
                        />
                        <CardContent>
                          <Grid
                            container
                            spacing={2}
                          >
                            <Grid
                              xs={12}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                Tên sản phẩm: <IconRequired />
                                {/* <Info className={classes.iconStyle} /> */}
                              </Typography>
                              <TextfieldWrapper
                                name="name"
                                fullWidth
                                id="name"
                                autoComplete="name"
                                autoFocus
                              />
                            </Grid>
                            <Grid
                              xs={6}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                Mã sản phẩm: <IconRequired />
                                {/* <Info className={classes.iconStyle} /> */}
                              </Typography>
                              <TextfieldWrapper
                                name="productCode"
                                fullWidth
                                id="productCode"
                                autoComplete="productCode"
                              />
                            </Grid>
                            <Grid
                              xs={6}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                Đơn vị: <IconRequired />
                                {/* <Info className={classes.iconStyle} /> */}
                              </Typography>
                              <TextfieldWrapper
                                name="unitMeasure"
                                fullWidth
                                id="unitMeasure"
                                autoComplete="unitMeasure"
                              />
                            </Grid>
                            <Grid
                              xs={6}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                Đơn vị quy đổi:
                                {/* <Info className={classes.iconStyle} /> */}
                              </Typography>
                              <TextfieldWrapper
                                name="wrapUnitMeasure"
                                fullWidth
                                id="wrapUnitMeasure"
                                autoComplete="wrapUnitMeasure"
                              />
                            </Grid>

                            <Grid
                              xs={6}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                Số lượng đơn vị:
                                {/* <Info className={classes.iconStyle} /> */}
                              </Typography>
                              <TextfieldWrapper
                                name="numberOfWrapUnitMeasure"
                                fullWidth
                                id="numberOfWrapUnitMeasure"
                                autoComplete="numberOfWrapUnitMeasure"
                              />
                            </Grid>
                            <Grid
                              xs={6}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                Màu sắc:
                                {/* <Info className={classes.iconStyle} /> */}
                              </Typography>
                              <TextfieldWrapper
                                name="color"
                                fullWidth
                                id="color"
                                autoComplete="color"
                              />
                            </Grid>
                            <Grid
                              xs={12}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                Mô tả:
                                {/* <Info className={classes.iconStyle} /> */}
                              </Typography>
                              <TextfieldWrapper
                                name="description"
                                fullWidth
                                multiline
                                minRows={5}
                                id="description"
                                autoComplete="description"
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid
                      xs={3}
                      item
                    >
                      <Card>
                        <CardHeader title="Phân loại" />
                        <CardContent>
                          <Grid
                            container
                            spacing={2}
                          >
                            <Grid
                              xs={12}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                Danh mục: <IconRequired />
                              </Typography>
                              {!!categoryList && (
                                <Select
                                  classNamePrefix="select"
                                  placeholder="Chọn danh mục."
                                  noOptionsMessage={() => (
                                    <>Không có tìm thấy danh mục phù hợp</>
                                  )}
                                  isClearable={true}
                                  isSearchable={true}
                                  name="categoryId"
                                  value={selectedCategory}
                                  options={FormatDataUtils.getOptionWithIdandName(
                                    categoryList,
                                  )}
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    control: (base) => ({
                                      ...base,
                                      height: 56,
                                      minHeight: 56,
                                    }),
                                  }}
                                  onChange={(e) => {
                                    setFieldValue('categoryId', e?.value);
                                  }}
                                />
                              )}
                              <FormHelperText
                                error={true}
                                className={classes.errorTextHelper}
                              >
                                {errors.categoryId}
                              </FormHelperText>
                            </Grid>
                            <Grid
                              xs={12}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                Danh mục phụ:
                              </Typography>
                              {/* {selectedCategory && ( */}
                              <Select
                                classNamePrefix="select"
                                placeholder="Chọn danh mục phụ"
                                noOptionsMessage={() => (
                                  <>Không có tìm thấy danh mục phù hợp</>
                                )}
                                isClearable={true}
                                isSearchable={true}
                                name="subCategoryId"
                                // value={selectedSubCategory}
                                options={FormatDataUtils.getOptionWithIdandName(
                                  subCategoryListTest,
                                )}
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                  control: (base) => ({
                                    ...base,
                                    height: 56,
                                    minHeight: 56,
                                  }),
                                }}
                                onChange={(e) => {
                                  setFieldValue('subCategoryId', e?.value);
                                }}
                              />
                              {/* )} */}
                            </Grid>
                            <Grid
                              xs={12}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                Nhà cung cấp: <IconRequired />
                              </Typography>
                              {/* {selectedManufacturer && ( */}
                              <Select
                                classNamePrefix="select"
                                placeholder="Chọn nhà cung cấp"
                                noOptionsMessage={() => (
                                  <>Không có tìm thấy nhà cung cấp phù hợp</>
                                )}
                                isClearable={true}
                                isSearchable={true}
                                name="manufacturerId"
                                // value={selectedManufacturer}
                                options={FormatDataUtils.getOptionWithIdandName(
                                  manufacturerList,
                                )}
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                  control: (base) => ({
                                    ...base,
                                    height: 56,
                                    minHeight: 56,
                                  }),
                                }}
                                onChange={(e) => {
                                  setFieldValue('manufactorId', e?.value);
                                }}
                              />
                              {/* )} */}
                              <FormHelperText
                                error={true}
                                className={classes.errorTextHelper}
                              >
                                {errors.manufactorId}
                              </FormHelperText>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                      <Card className={classes.cardImage}>
                        <CardHeader title="Ảnh sản phẩm" />
                        <CardContent>Thêm ảnh</CardContent>
                      </Card>
                    </Grid>
                    {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                    <Grid
                      xs={12}
                      item
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                        padding="20px"
                      >
                        <LoadingButton
                          loading={loadingButton}
                          type="submit"
                          variant="contained"
                          loadingPosition="start"
                          startIcon={<Save />}
                        >
                          Lưu
                        </LoadingButton>
                        <Button
                          onClick={() => handleOnClickExit()}
                          variant="outlined"
                        >
                          Thoát
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          )}
        </Box>
      )}

      {/* Add new Product */}
      {!product && (
        <Formik
          initialValues={{ ...initialFormValue }}
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
                  <Card>
                    <CardHeader title={isAdd ? 'Thêm mới sản phẩm' : 'Sửa sản phẩmarm'} />
                    <CardContent>
                      <Grid
                        container
                        spacing={2}
                      >
                        <Grid
                          xs={12}
                          item
                        >
                          <Typography className={classes.wrapIcon}>
                            Tên sản phẩm: <IconRequired />
                            {/* <Info className={classes.iconStyle} /> */}
                          </Typography>
                          <TextfieldWrapper
                            name="name"
                            fullWidth
                            id="name"
                            autoComplete="name"
                            autoFocus
                          />
                        </Grid>
                        <Grid
                          xs={6}
                          item
                        >
                          <Typography className={classes.wrapIcon}>
                            Mã sản phẩm: <IconRequired />
                            {/* <Info className={classes.iconStyle} /> */}
                          </Typography>
                          <TextfieldWrapper
                            name="productCode"
                            fullWidth
                            id="productCode"
                            autoComplete="productCode"
                          />
                        </Grid>
                        <Grid
                          xs={6}
                          item
                        >
                          <Typography className={classes.wrapIcon}>
                            Đơn vị: <IconRequired />
                            {/* <Info className={classes.iconStyle} /> */}
                          </Typography>
                          <TextfieldWrapper
                            name="unitMeasure"
                            fullWidth
                            id="unitMeasure"
                            autoComplete="unitMeasure"
                          />
                        </Grid>
                        <Grid
                          xs={6}
                          item
                        >
                          <Typography className={classes.wrapIcon}>
                            Đơn vị quy đổi:
                            {/* <Info className={classes.iconStyle} /> */}
                          </Typography>
                          <TextfieldWrapper
                            name="wrapUnitMeasure"
                            fullWidth
                            id="wrapUnitMeasure"
                            autoComplete="wrapUnitMeasure"
                          />
                        </Grid>

                        <Grid
                          xs={6}
                          item
                        >
                          <Typography className={classes.wrapIcon}>
                            Số lượng đơn vị:
                            {/* <Info className={classes.iconStyle} /> */}
                          </Typography>
                          <TextfieldWrapper
                            name="numberOfWrapUnitMeasure"
                            fullWidth
                            id="numberOfWrapUnitMeasure"
                            autoComplete="numberOfWrapUnitMeasure"
                          />
                        </Grid>
                        <Grid
                          xs={6}
                          item
                        >
                          <Typography className={classes.wrapIcon}>
                            Màu sắc:
                            {/* <Info className={classes.iconStyle} /> */}
                          </Typography>
                          <TextfieldWrapper
                            name="color"
                            fullWidth
                            id="color"
                            autoComplete="color"
                          />
                        </Grid>
                        <Grid
                          xs={12}
                          item
                        >
                          <Typography className={classes.wrapIcon}>
                            Mô tả:
                            {/* <Info className={classes.iconStyle} /> */}
                          </Typography>
                          <TextfieldWrapper
                            name="description"
                            fullWidth
                            multiline
                            minRows={5}
                            id="description"
                            autoComplete="description"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid
                  xs={3}
                  item
                >
                  <Card>
                    <CardHeader title="Phân loại" />
                    <CardContent>
                      <Grid
                        container
                        spacing={2}
                      >
                        <Grid
                          xs={12}
                          item
                        >
                          <Typography className={classes.wrapIcon}>
                            Danh mục: <IconRequired />
                          </Typography>
                          {/* {selectedCategory && ( */}
                          <Select
                            classNamePrefix="select"
                            placeholder="Chọn danh mục."
                            noOptionsMessage={() => (
                              <>Không có tìm thấy danh mục phù hợp</>
                            )}
                            isClearable={true}
                            isSearchable={true}
                            name="categoryId"
                            // value={selectedCategory}
                            options={FormatDataUtils.getOptionWithIdandName(categoryList)}
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              control: (base) => ({
                                ...base,
                                height: 56,
                                minHeight: 56,
                              }),
                            }}
                            onChange={(e) => {
                              setFieldValue('categoryId', e?.value);
                            }}
                          />
                          {/* )} */}
                          <FormHelperText
                            error={true}
                            className={classes.errorTextHelper}
                          >
                            {errors.categoryId}
                          </FormHelperText>
                        </Grid>
                        <Grid
                          xs={12}
                          item
                        >
                          <Typography className={classes.wrapIcon}>
                            Danh mục phụ:
                          </Typography>
                          {/* {selectedCategory && ( */}
                          <Select
                            classNamePrefix="select"
                            placeholder="Chọn danh mục phụ"
                            noOptionsMessage={() => (
                              <>Không có tìm thấy danh mục phù hợp</>
                            )}
                            isClearable={true}
                            isSearchable={true}
                            name="subCategoryId"
                            // value={selectedSubCategory}
                            options={FormatDataUtils.getOptionWithIdandName(
                              subCategoryListTest,
                            )}
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              control: (base) => ({
                                ...base,
                                height: 56,
                                minHeight: 56,
                              }),
                            }}
                            onChange={(e) => {
                              setFieldValue('subCategoryId', e?.value);
                            }}
                          />
                          {/* )} */}
                        </Grid>
                        <Grid
                          xs={12}
                          item
                        >
                          <Typography className={classes.wrapIcon}>
                            Nhà cung cấp: <IconRequired />
                          </Typography>
                          {/* {selectedManufacturer && ( */}
                          <Select
                            classNamePrefix="select"
                            placeholder="Chọn nhà cung cấp"
                            noOptionsMessage={() => (
                              <>Không có tìm thấy nhà cung cấp phù hợp</>
                            )}
                            isClearable={true}
                            isSearchable={true}
                            name="manufacturerId"
                            // value={selectedManufacturer}
                            options={FormatDataUtils.getOptionWithIdandName(
                              manufacturerList,
                            )}
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              control: (base) => ({
                                ...base,
                                height: 56,
                                minHeight: 56,
                              }),
                            }}
                            onChange={(e) => {
                              setFieldValue('manufactorId', e?.value);
                            }}
                          />
                          {/* )} */}
                          <FormHelperText
                            error={true}
                            className={classes.errorTextHelper}
                          >
                            {errors.manufactorId}
                          </FormHelperText>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                  <Card className={classes.cardImage}>
                    <CardHeader title="Ảnh sản phẩm" />
                    <CardContent>Thêm ảnh</CardContent>
                  </Card>
                </Grid>
                {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                <Grid
                  xs={12}
                  item
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-end"
                    padding="20px"
                  >
                    {/* <ButtonWrapper variant="contained">Lưu</ButtonWrapper> */}
                    <LoadingButton
                      loading={loadingButton}
                      type="submit"
                      variant="contained"
                      loadingPosition="start"
                      startIcon={<Save />}
                    >
                      Lưu
                    </LoadingButton>
                    <Button
                      onClick={() => handleOnClickExit()}
                      variant="outlined"
                    >
                      Thoát
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      )}
    </Box>
  );
};

export default AddEditProductForm;
// {isAdd && (
//   <Grid
//     container
//     direction="row"
//     justifyContent="center"
//     alignItems="stretch"
//   >
//     <Grid
//       xs={12}
//       item
//     >
//       <Formik
//         initialValues={{
//           initialFormValue,
//         }}
//         validationSchema={FORM_VALIDATION}
//         onSubmit={(values) => handleSubmit(values)}
//       >
//         <Form>
//           <Grid
//             container
//             direction="row"
//             justifyContent="center"
//             alignItems="stretch"
//           >
//             <Grid
//               xs={6}
//               item
//               className={classes.leftContainer}
//             >
//               <Box className={classes.infoContainer}>
//                 <Typography className={classes.wrapIcon}>
//                   Mã sản phẩm <InfoOutlined className={classes.iconStyle} />
//                 </Typography>
//                 <TextfieldWrapper
//                   name="productCode"
//                   fullWidth
//                   id="productCode"
//                   autoComplete="productCode"
//                   autoFocus
//                 />
//               </Box>

//               <Box className={classes.infoContainer}>
//                 <Typography className={classes.wrapIcon}>
//                   Tên sản phẩm <Info className={classes.iconStyle} />
//                 </Typography>
//                 <TextfieldWrapper
//                   name="name"
//                   fullWidth
//                   id="name"
//                   autoComplete="name"
//                   autoFocus
//                 />
//               </Box>
//               <Box className={classes.infoContainer}>
//                 <Typography className={classes.wrapIcon}>
//                   Danh mục <Info className={classes.iconStyle} />
//                 </Typography>
//                 {!!categoryList && (
//                   <SelectWrapper
//                     name="categoryId"
//                     fullWidth
//                     options={categoryList}
//                     id="categoryId"
//                     autoFocus
//                   />
//                 )}
//               </Box>
//               {/* <Box sx={{ display: 'flex', width: '100%' }}>
//               <Typography>Danh mục phụ</Typography>
//               {!!categoryList && (
//                 <SelectWrapper
//                   name="subCategoryId"
//                   margin="normal"
//                   fullWidth
//                   options={categoryList}
//                   id="subCategoryId"
//                 />
//               )}
//             </Box> */}
//               <Box className={classes.infoContainer}>
//                 <Typography className={classes.wrapIcon}>
//                   Đơn vị tính <Info className={classes.iconStyle} />
//                 </Typography>
//                 <TextfieldWrapper
//                   name="unitMeasure"
//                   fullWidth
//                   id="unitMeasure"
//                   autoComplete="unitMeasure"
//                   autoFocus
//                 />
//               </Box>
//             </Grid>
//             <Grid
//               xs={6}
//               item
//               className={classes.rightContainer}
//             >
//               {/* {!isAdd && (
//                   <Box className={classes.infoContainer}>
//                     <Typography className={classes.wrapIcon}>
//                       Tồn kho <Info className={classes.iconStyle} />
//                     </Typography>
//                     <TextField
//                       defaultValue={product.quantity}
//                       fullWidth
//                       InputProps={{
//                         readOnly: true,
//                       }}
//                     />
//                   </Box>
//                 )} */}
//               <Box className={classes.infoContainer}>
//                 <Typography className={classes.wrapIcon}>
//                   Màu sắc <Info className={classes.iconStyle} />
//                 </Typography>
//                 <TextfieldWrapper
//                   name="color"
//                   fullWidth
//                   id="color"
//                   autoComplete="color"
//                   autoFocus
//                 />
//               </Box>
//               <Box className={classes.infoContainer}>
//                 <Typography className={classes.wrapIcon}>
//                   Mô tả <Info className={classes.iconStyle} />
//                 </Typography>
//                 <TextfieldWrapper
//                   name="description"
//                   fullWidth
//                   multiline
//                   rows={4}
//                   id="description"
//                   autoFocus
//                 />
//               </Box>
//             </Grid>
//           </Grid>
//           <Stack
//             direction="row"
//             spacing={2}
//             justifyContent="flex-end"
//             padding="20px"
//           >
//             <ButtonWrapper variant="contained">Lưu</ButtonWrapper>
//             <Button
//               onClick={() => handleOnClickExit()}
//               variant="outlined"
//             >
//               Thoát
//             </Button>
//           </Stack>
//         </Form>
//       </Formik>
//     </Grid>
//   </Grid>
// )}

// <Container maxWidth="xl">
//   <Box className={classes.cardHeader}>
//     <Typography variant="h4">{isAdd ? 'Thêm ' : 'Sửa '}sản phẩm</Typography>
//   </Box>
//   <Card>
//     {loading && !isAdd ? (
//       <>Loading...</>
//     ) : (
//       <>
//         <Grid
//           container
//           direction="row"
//           justifyContent="center"
//           alignItems="stretch"
//         >
//           {product && (
//             <Grid
//               xs={12}
//               item
//             >
//               <Formik
//                 initialValues={{
//                   ...product,
//                 }}
//                 validationSchema={FORM_VALIDATION}
//                 onSubmit={(values) => handleSubmit(values)}
//               >
//                 <Form>
//                   <Grid
//                     container
//                     direction="row"
//                     justifyContent="center"
//                     alignItems="stretch"
//                   >
//                     <Grid
//                       xs={6}
//                       item
//                       className={classes.leftContainer}
//                     >
//                       <Box className={classes.infoContainer}>
//                         <Typography className={classes.wrapIcon}>
//                           Mã sản phẩm <InfoOutlined className={classes.iconStyle} />
//                         </Typography>
//                         <TextfieldWrapper
//                           name="productCode"
//                           fullWidth
//                           id="productCode"
//                           autoComplete="productCode"
//                           autoFocus
//                         />
//                       </Box>

//                       <Box className={classes.infoContainer}>
//                         <Typography className={classes.wrapIcon}>
//                           Tên sản phẩm <InfoOutlined className={classes.iconStyle} />
//                         </Typography>
//                         <TextfieldWrapper
//                           name="name"
//                           fullWidth
//                           id="name"
//                           autoComplete="name"
//                           autoFocus
//                         />
//                       </Box>
//                       <Box className={classes.infoContainer}>
//                         <Typography className={classes.wrapIcon}>
//                           Danh mục <InfoOutlined className={classes.iconStyle} />
//                         </Typography>
//                         {!!categoryList && (
//                           <SelectWrapper
//                             name="categoryId"
//                             fullWidth
//                             options={categoryList}
//                             id="categoryId"
//                             autoFocus
//                           />
//                         )}
//                       </Box>
//                       {/* <Box sx={{ display: 'flex', width: '100%' }}>
//                 <Typography>Danh mục phụ</Typography>
//                 {!!categoryList && (
//                   <SelectWrapper
//                     name="subCategoryId"
//                     margin="normal"
//                     fullWidth
//                     options={categoryList}
//                     id="subCategoryId"
//                   />
//                 )}
//               </Box> */}
//                       <Box className={classes.infoContainer}>
//                         <Typography className={classes.wrapIcon}>
//                           Đơn vị tính <InfoOutlined className={classes.iconStyle} />
//                         </Typography>
//                         <TextfieldWrapper
//                           name="unitMeasure"
//                           fullWidth
//                           id="unitMeasure"
//                           autoComplete="unitMeasure"
//                           autoFocus
//                         />
//                       </Box>
//                     </Grid>
//                     <Grid
//                       xs={6}
//                       item
//                       className={classes.rightContainer}
//                     >
//                       {!isAdd && (
//                         <Box className={classes.infoContainer}>
//                           <Typography className={classes.wrapIcon}>
//                             Tồn kho <InfoOutlined className={classes.iconStyle} />
//                           </Typography>
//                           <TextField
//                             defaultValue={product.quantity}
//                             fullWidth
//                             InputProps={{
//                               readOnly: true,
//                             }}
//                           />
//                         </Box>
//                       )}
//                       <Box className={classes.infoContainer}>
//                         <Typography className={classes.wrapIcon}>
//                           Màu sắc <InfoOutlined className={classes.iconStyle} />
//                         </Typography>
//                         <TextfieldWrapper
//                           name="color"
//                           fullWidth
//                           id="color"
//                           autoComplete="color"
//                           autoFocus
//                         />
//                       </Box>
//                       <Box className={classes.infoContainer}>
//                         <Typography className={classes.wrapIcon}>
//                           Mô tả <InfoOutlined className={classes.iconStyle} />
//                         </Typography>
//                         <TextfieldWrapper
//                           name="description"
//                           fullWidth
//                           multiline
//                           rows={4}
//                           id="description"
//                           autoFocus
//                         />
//                       </Box>
//                     </Grid>
//                   </Grid>
//                   <Stack
//                     direction="row"
//                     spacing={2}
//                     justifyContent="flex-end"
//                     padding="20px"
//                   >
//                     <ButtonWrapper variant="contained">Lưu</ButtonWrapper>
//                     <Button
//                       variant="outlined"
//                       onClick={() => handleOnClickExit()}
//                     >
//                       Thoát
//                     </Button>
//                   </Stack>
//                 </Form>
//               </Formik>
//             </Grid>
//           )}
//         </Grid>
//       </>
//     )}
//   </Card>
//   {/* TODO: tối ưu code */}

// </Container>
