import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import IconRequired from '@/components/Common/IconRequired';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import CategoryService from '@/services/categoryService';
import productService from '@/services/productService';
import { getManufacturerList } from '@/slices/ManufacturerSlice';
import {
  getProductDetail,
  saveProduct,
  updateImageProduct,
  uploadNewImageProduct,
} from '@/slices/ProductSlice';
import FormatDataUtils from '@/utils/formatData';
import { Close, CloudUpload, Done, Save } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  FormHelperText,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import axios from 'axios';
import { Form, Formik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
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
    // marginTop: '24px',
    minHeight: '255px',
    display: 'flex',
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
  preview: {
    width: '250px',
    height: '250px',
    border: '2px dashed black',
    borderRadius: '5px',
    display: 'block',
    fontSize: '28px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    cursor: 'pointer',
    position: 'relative',
  },
  iconUpload: {
    fontSize: '50px',
    marginBottom: '20px',
  },
  uploadContainer: {
    width: '100%',
    display: 'flex',
    margin: '0 auto',
  },
  imgPreview: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    // top: '0',
    // left: '0',
    objectFit: 'cover',
  },
}));

const subCategoryListTest = [
  { id: 1, name: 'Gạch 3x3' },
  { id: 2, name: 'Gạch Florentilo' },
];

function Dropzone(props) {
  const { imageUrl, setImageUrl, setFormData } = props;
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    const file = acceptedFiles[0];
    console.log(file);
    setImageUrl(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append('file', file);
    // console.log('inside',...formData)
    setFormData(formData);
    // axios
    //   .put(
    //     `http://localhost:8080/api/product/update/image/2`,
    //     formData,
    //     {
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     },
    //   )
    //   .then(() => {
    //     console.log('file uploaded successfully');
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });
  const classes = useStyles();

  return (
    <div
      {...getRootProps()}
      className={classes.preview}
    >
      <input {...getInputProps()} />
      {imageUrl && (
        <img
          className={classes.imgPreview}
          src={imageUrl}
        />
      )}
      <CloudUpload
        fontSize="large"
        className={classes.iconUpload}
      />

      {isDragActive ? <span>Thả ảnh vào đây</span> : <span>Tải ảnh lên</span>}
    </div>
  );
}

const localhost = 'http://localhost:8080';
const deployUrl = 'http://ec2-52-221-240-240.ap-southeast-1.compute.amazonaws.com:8080';

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
  const [imageUrl, setImageUrl] = useState();
  const [formData, setFormData] = useState(new FormData());
  const [isAdd, setIsAdd] = useState(true);
  const [isUseWrapUnitMeasure, setIsUseWrapUnitMeasure] = useState(true);
  const classes = useStyles();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, uploadImage } = useSelector((state) => ({ ...state.products }));

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
      if (!!formData) {
        if (!productId) {
          const uploadNewImage = await dispatch(uploadNewImageProduct(formData));
          toast.success('Thêm sản phẩm thành công!');
          navigate('/product');
        } else {
          const uploadNewImage = productService.updateImage(productId, formData).then(
            (res) => {
              console.log(res.data.message);
              toast.success('Sửa sản phẩm thành công!');
              navigate(`/product/detail/${productId}`);
            },
            (err) => {
              console.err(err);
            },
          );
        }
      }
      console.log('outside', ...formData);
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

  const handleOnClickCheckboxWrapUnitMeasure = () => {
    setIsUseWrapUnitMeasure(!isUseWrapUnitMeasure);
  };

  const handleSubmit = (values) => {
    setLoadingButton(true);
    const newProduct = {
      id: productId,
      name: values.name,
      productCode: values.productCode,
      unitMeasure: values.unitMeasure,
      wrapUnitMeasure: isUseWrapUnitMeasure ? values.wrapUnitMeasure : '',
      numberOfWrapUnitMeasure: isUseWrapUnitMeasure ? values.numberOfWrapUnitMeasure : '',
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
          console.log(dataResult.data);
          setProduct(dataResult.data.product);
          setSelectedCategory(
            FormatDataUtils.getSelectedOption(
              categoryList,
              dataResult.data.product.categoryId,
            ),
          );
          // TODO: đổi sang api deploy khi push code lên nhánh master
          if (dataResult.data.product.image) {
            setImageUrl(localhost + '/' + dataResult.data.product.image);
          }
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
        <ProgressCircleLoading/>
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
                      <Grid
                        container
                        spacing={2}
                      >
                        <Grid
                          xs={12}
                          item
                        >
                          <Card>
                            {/* <CardHeader
                          title={isAdd ? 'Thêm mới sản phẩm' : 'Sửa sản phẩm'}
                        /> */}
                            <CardContent>
                              <Typography variant="h6">Thông tin sản phẩm</Typography>
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
                          xs={12}
                          item
                        >
                          <Card>
                            <CardContent>
                              <Typography variant="h6">
                                Đơn vị quy đổi{' '}
                                <Checkbox
                                  checked={isUseWrapUnitMeasure}
                                  onClick={() => {
                                    handleOnClickCheckboxWrapUnitMeasure();
                                    // setFieldValue('wrapUnitMeasure', '');
                                    // setFieldValue('numberOfWrapUnitMeasure', '');
                                  }}
                                />
                              </Typography>
                              {isUseWrapUnitMeasure && (
                                <Grid
                                  container
                                  spacing={2}
                                >
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
                                </Grid>
                              )}
                            </CardContent>
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
                            {/* <CardHeader title="Phân loại" /> */}
                            <CardContent>
                              <Typography variant="h6">Phân loại</Typography>
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
                        </Grid>
                        <Grid
                          xs={12}
                          item
                        >
                          <Card className={classes.cardImage}>
                            {/* <CardHeader title="Ảnh sản phẩm" /> */}
                            <CardContent sx={{ width: '100%' }}>
                              <Typography variant="h6">Ảnh sản phẩm</Typography>
                              {/* <Box className={classes.uploadContainer}>
                            
                          </Box> */}
                              <Grid
                                container
                                spacing={0}
                                direction="column"
                                alignItems="center"
                                justify="center"
                              >
                                <Grid
                                  xs={12}
                                  item
                                >
                                  <Dropzone
                                    // {...userProfile}
                                    imageUrl={imageUrl}
                                    setImageUrl={setImageUrl}
                                    setFormData={setFormData}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid
                          xs={12}
                          item
                        >
                          <Card>
                            <CardContent>
                              <Grid
                                container
                                spacing={2}
                              >
                                <Grid
                                  xs={6}
                                  item
                                >
                                  <LoadingButton
                                    loading={loadingButton}
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    loadingPosition="start"
                                    startIcon={<Done />}
                                    color="warning"
                                  >
                                    Lưu chỉnh sửa
                                  </LoadingButton>
                                  {/* <Button
                                onClick={() => console.log('outside',...formData)}
                                variant="contained"
                                fullWidth
                                startIcon={<Close />}
                                color="error"
                              >
                                Test
                              </Button> */}
                                </Grid>
                                <Grid
                                  xs={6}
                                  item
                                >
                                  <Button
                                    onClick={() => handleOnClickExit()}
                                    variant="contained"
                                    fullWidth
                                    startIcon={<Close />}
                                    color="error"
                                  >
                                    Huỷ chỉnh sửa
                                  </Button>
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>
                    {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                  </Grid>
                </Form>
              )}
            </Formik>
          )}
        </Box>
      )}

      {/* Add new Product */}
      {!product && isAdd && (
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
                  <Grid
                    container
                    spacing={2}
                  >
                    <Grid
                      xs={12}
                      item
                    >
                      <Card>
                        {/* <CardHeader
                          title={isAdd ? 'Thêm mới sản phẩm' : 'Sửa sản phẩm'}
                        /> */}
                        <CardContent>
                          <Typography variant="h6">Thông tin sản phẩm</Typography>
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
                      xs={12}
                      item
                    >
                      <Card>
                        <CardContent>
                          <Typography variant="h6">
                            Đơn vị quy đổi{' '}
                            <Checkbox
                              checked={isUseWrapUnitMeasure}
                              onClick={() => {
                                handleOnClickCheckboxWrapUnitMeasure();
                                // setFieldValue('wrapUnitMeasure', '');
                                // setFieldValue('numberOfWrapUnitMeasure', '');
                              }}
                            />
                          </Typography>
                          {isUseWrapUnitMeasure && (
                            <Grid
                              container
                              spacing={2}
                            >
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
                            </Grid>
                          )}
                        </CardContent>
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
                        {/* <CardHeader title="Phân loại" /> */}
                        <CardContent>
                          <Typography variant="h6">Phân loại</Typography>
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
                    </Grid>
                    <Grid
                      xs={12}
                      item
                    >
                      <Card className={classes.cardImage}>
                        {/* <CardHeader title="Ảnh sản phẩm" /> */}
                        <CardContent sx={{ width: '100%' }}>
                          <Typography variant="h6">Ảnh sản phẩm</Typography>
                          {/* <Box className={classes.uploadContainer}>
                            
                          </Box> */}
                          <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                          >
                            <Grid
                              xs={12}
                              item
                            >
                              <Dropzone
                                // {...userProfile}
                                imageUrl={imageUrl}
                                setImageUrl={setImageUrl}
                                setFormData={setFormData}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid
                      xs={12}
                      item
                    >
                      <Card>
                        <CardContent>
                          <Grid
                            container
                            spacing={2}
                          >
                            <Grid
                              xs={8}
                              item
                            >
                              <LoadingButton
                                loading={loadingButton}
                                type="submit"
                                variant="contained"
                                fullWidth
                                loadingPosition="start"
                                startIcon={<Done />}
                                color="success"
                              >
                                Thêm sản phẩm
                              </LoadingButton>
                              {/* <Button
                                onClick={() => console.log('outside',...formData)}
                                variant="contained"
                                fullWidth
                                startIcon={<Close />}
                                color="error"
                              >
                                Test
                              </Button> */}
                            </Grid>
                            <Grid
                              xs={4}
                              item
                            >
                              <Button
                                onClick={() => handleOnClickExit()}
                                variant="contained"
                                fullWidth
                                startIcon={<Close />}
                                color="error"
                              >
                                Huỷ
                              </Button>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
                {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                <Grid
                  xs={12}
                  item
                ></Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      )}
    </Box>
  );
};

export default AddEditProductForm;
