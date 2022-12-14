import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import IconRequired from '@/components/Common/IconRequired';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import { API_URL_IMAGE } from '@/constants/apiUrl';
import CategoryService from '@/services/categoryService';
import productService from '@/services/productService';
import { getSubCategoryByCategoryId } from '@/slices/CategorySlice';
import { getAllManufacturer, getManufacturerList } from '@/slices/ManufacturerSlice';
import {
  getProductDetail,
  saveProduct,
  updateImageProduct,
  updateProduct,
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
    aspectRatio: '1/1',
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
  { id: 1, name: 'G???ch 3x3' },
  { id: 2, name: 'G???ch Florentilo' },
];

function Dropzone(props) {
  const { imageUrl, setImageUrl, setFormData } = props;
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    // console.log(fileRejections[0]);
    if (!!fileRejections[0]) {
      //   console.log(fileRejections[0].errors);
      if (fileRejections[0].errors[0].code === 'file-invalid-type') {
        console.log('B???n vui l??ng ch???n file ??u??i .jpg, .png ????? t???i l??n');
        return;
      }
      if (fileRejections[0].errors[0].code === 'file-too-large') {
        console.log('B???n vui l??ng ch???n file ???nh d?????i 5MB ????? t???i l??n');
      }
    } else {
      // Do something with the files
      const file = acceptedFiles[0];
      console.log(file);

      setImageUrl(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append('file', file);
      // console.log('inside',...formData)
      setFormData(formData);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
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

      {isDragActive ? <span>Th??? ???nh v??o ????y</span> : <span>T???i ???nh l??n</span>}
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
    isUseWrapUnitMeasure: false,
  };
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [manufacturerList, setManufacturerList] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const [formData, setFormData] = useState(new FormData());
  const [isAdd, setIsAdd] = useState(true);
  const [isUseWrapUnitMeasure, setIsUseWrapUnitMeasure] = useState(false);
  const classes = useStyles();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, uploadImage } = useSelector((state) => ({ ...state.products }));

  const FORM_VALIDATION = Yup.object().shape({
    productCode: Yup.string()
      .trim()
      .max(255, 'M?? s???n ph???m kh??ng th??? d??i qu?? 255 k?? t???')
      .required('Ch??a nh???p m?? s???n ph???m')
      .test('productCode', 'Vui l??ng xo?? c??c kho???ng tr???ng', function (value) {
        if (value) {
          return !value.includes(' ');
        }
      }),
    name: Yup.string()
      .trim()
      .max(255, 'T??n s???n ph???m kh??ng th??? d??i qu?? 255 k?? t???')
      .required('Ch??a nh???p t??n s???n ph???m'),
    unitMeasure: Yup.string()
      .trim()
      .max(255, '????n v??? kh??ng th??? d??i qu?? 255 k?? t???')
      .required('Ch??a nh???p ????n v???'),
    color: Yup.string().max(50, 'M??u s???c kh??ng th??? d??i qu?? 50 k?? t???'),
    description: Yup.string().max(255, 'M?? t??? kh??ng th??? d??i qu?? 255 k?? t???'),
    categoryId: Yup.string().required('Ch??a ch???n danh m???c'),
    manufactorId: Yup.string().required('Ch??a ch???n nh?? cung c???p'),
    isUseWrapUnitMeasure: Yup.boolean(),
    wrapUnitMeasure: Yup.string()
      .max(255, '????n v??? kh??ng th??? d??i qu?? 255 k?? t???')
      .when('isUseWrapUnitMeasure', {
        is: true,
        then: Yup.string().trim().required('Ch??a nh???p ????n v??? quy ?????i').nullable(),
      })
      .nullable(),
    numberOfWrapUnitMeasure: Yup.number()
      .max(1000, 'S??? l?????ng ????n v??? quy ?????i kh??ng th??? l???n h??n 1000')
      .when('isUseWrapUnitMeasure', {
        is: true,
        then: Yup.number().required('Ch??a nh???p s??? l?????ng quy ?????i').nullable(),
      })
      .nullable(),
  });

  const onChangeCategory = (event) => {
    setSelectedSubCategory(null);
    setSelectedCategory(event);
    fetchSubCategoryByCategoryId(event.value);
  };

  const saveProductDetail = async (product) => {
    try {
      if (!productId) {
        const actionResult = await dispatch(saveProduct(product));
        const dataResult = unwrapResult(actionResult);
        if (dataResult.status === 200) {
          if (formData.has('file')) {
            const uploadNewImage = await dispatch(uploadNewImageProduct(formData));
            toast.success('Th??m s???n ph???m th??nh c??ng!');
            navigate('/product');
          } else {
            navigate('/product');
            toast.success('Th??m s???n ph???m th??nh c??ng!');
          }
        }
      } else {
        const actionResult = await dispatch(updateProduct(product));
        const dataResult = unwrapResult(actionResult);
        if (dataResult.status === 200) {
          if (formData.has('file')) {
            const uploadNewImage = productService.updateImage(productId, formData).then(
              (res) => {
                toast.success('S???a s???n ph???m th??nh c??ng!');
                navigate(`/product/detail/${productId}`);
              },
              (err) => {
                console.log(err);
              },
            );
          } else {
            navigate(`/product/detail/${productId}`);
            toast.success('S???a s???n ph???m th??nh c??ng!');
          }
        }
      }
    } catch (error) {
      console.log('Failed to save product: ', error);
      if (error.message) {
        toast.error(error.message);
      } else {
        if (isAdd) {
          toast.error('Th??m s???n ph???m th???t b???i');
        } else {
          toast.error('S???a s???n ph???m th???t b???i');
        }
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
      name: FormatDataUtils.removeExtraSpace(values.name),
      productCode: FormatDataUtils.removeExtraSpace(values.productCode),
      unitMeasure: FormatDataUtils.removeExtraSpace(values.unitMeasure),
      wrapUnitMeasure: isUseWrapUnitMeasure
        ? FormatDataUtils.removeExtraSpace(values.wrapUnitMeasure)
        : null,
      numberOfWrapUnitMeasure: isUseWrapUnitMeasure
        ? values.numberOfWrapUnitMeasure
        : null,
      color: FormatDataUtils.removeExtraSpace(values.color),
      description: FormatDataUtils.removeExtraSpace(values.description),
      categoryId: values.categoryId,
      manufactorId: values.manufactorId,
      subCategoryId: values.subCategoryId,
    };
    // console.log(values);
    saveProductDetail(newProduct);
  };

  const handleOnClickExit = () => {
    // TODO: fix l???i n??t exit ph???n th??m m???i
    navigate(isAdd ? '/product' : `/product/detail/${productId}`);
  };

  const fetchSubCategoryByCategoryId = async (categoryId) => {
    try {
      const params = {
        categoryId: categoryId,
      };
      const actionResult = await dispatch(getSubCategoryByCategoryId(params));
      const dataResult = unwrapResult(actionResult);
      if (dataResult.data) {
        console.log(dataResult.data);
        setSubCategoryList(dataResult.data.subCategory);
      }
    } catch (error) {
      console.log('Failed to fetch subCategory list: ', error);
    }
  };

  useEffect(() => {
    const fetchCategoryList = async () => {
      try {
        const params = {
          categoryName: '',
        };
        const response = await CategoryService.getAllCategoryList(params);
        // console.log('response', response.data.category);
        const rawList = response.data.category;
        const result = rawList.reduce((obj, item) => {
          return {
            ...obj,
            [item.id]: item.name,
          };
        }, {});

        // console.log('result', result);
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
        const actionResult = await dispatch(getAllManufacturer(params));
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
          console.log(dataResult);
          setProduct(dataResult.data.product);
          setSelectedCategory(dataResult.data.product.categoryId);
          setSelectedSubCategory(dataResult.data.product.subCategoryId);
          setSelectedManufacturer(dataResult.data.product.manufactorId);
          setIsUseWrapUnitMeasure(
            !!dataResult.data.product.wrapUnitMeasure &&
              !!dataResult.data.product.numberOfWrapUnitMeasure,
          );
          fetchSubCategoryByCategoryId(dataResult.data.product.categoryId);
          // TODO: ?????i sang api deploy khi push code l??n nh??nh master
          if (dataResult.data.product.image) {
            setImageUrl(API_URL_IMAGE + '/' + dataResult.data.product.image);
          }
        } else {
          navigate('/404');
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
        if (isNaN(productId)) {
          navigate('/404');
        } else {
          fetchProductDetail();
        }
      }
    }
  }, [productId]);
  return (
    <Box padding="20px">
      {/* Update Product */}
      {loading && !isAdd ? (
        <ProgressCircleLoading />
      ) : (
        <Box>
          {!!product && (
            <Formik
              initialValues={{ ...product, isUseWrapUnitMeasure: false }}
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
                          title={isAdd ? 'Th??m m???i s???n ph???m' : 'S???a s???n ph???m'}
                        /> */}
                            <CardContent>
                              <Typography variant="h6">Th??ng tin s???n ph???m</Typography>
                              <Grid
                                container
                                spacing={2}
                              >
                                <Grid
                                  xs={12}
                                  item
                                >
                                  <Typography className={classes.wrapIcon}>
                                    T??n s???n ph???m: <IconRequired />
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
                                    M?? s???n ph???m: <IconRequired />
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
                                    ????n v???: <IconRequired />
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
                                    M??u s???c:
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
                                    M?? t???:
                                    {/* <Info className={classes.iconStyle} /> */}
                                  </Typography>
                                  <TextfieldWrapper
                                    name="description"
                                    fullWidth
                                    multiline
                                    minRows={4}
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
                                ????n v??? quy ?????i{' '}
                                <Checkbox
                                  checked={isUseWrapUnitMeasure}
                                  onClick={() => {
                                    handleOnClickCheckboxWrapUnitMeasure();
                                    setFieldValue(
                                      'isUseWrapUnitMeasure',
                                      !isUseWrapUnitMeasure,
                                    );
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
                                      ????n v??? quy ?????i:
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
                                      S??? l?????ng ????n v???:
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
                            {/* <CardHeader title="Ph??n lo???i" /> */}
                            <CardContent>
                              <Typography variant="h6">Ph??n lo???i</Typography>
                              <Grid
                                container
                                spacing={2}
                              >
                                <Grid
                                  xs={12}
                                  item
                                >
                                  <Typography className={classes.wrapIcon}>
                                    Danh m???c: <IconRequired />
                                  </Typography>
                                  {!!categoryList && selectedCategory && (
                                    <Select
                                      classNamePrefix="select"
                                      placeholder="Ch???n danh m???c."
                                      noOptionsMessage={() => (
                                        <>Kh??ng c?? t??m th???y danh m???c ph?? h???p</>
                                      )}
                                      isClearable={true}
                                      isSearchable={true}
                                      name="categoryId"
                                      value={FormatDataUtils.getSelectedOption(
                                        categoryList,
                                        selectedCategory,
                                      )}
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
                                        onChangeCategory(e);
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
                                    Danh m???c ph???:
                                  </Typography>
                                  {!!subCategoryList && (
                                    <Select
                                      classNamePrefix="select"
                                      placeholder="Ch???n danh m???c ph???"
                                      noOptionsMessage={() => (
                                        <>Kh??ng c?? t??m th???y danh m???c ph?? h???p</>
                                      )}
                                      isClearable={true}
                                      isSearchable={true}
                                      name="subCategoryId"
                                      value={selectedSubCategory}
                                      options={FormatDataUtils.getOptionWithIdandName(
                                        subCategoryList,
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
                                        setSelectedSubCategory(e);
                                      }}
                                    />
                                  )}
                                </Grid>
                                <Grid
                                  xs={12}
                                  item
                                >
                                  <Typography className={classes.wrapIcon}>
                                    Nh?? cung c???p: <IconRequired />
                                  </Typography>
                                  {manufacturerList && selectedManufacuter && (
                                    <Select
                                      classNamePrefix="select"
                                      placeholder="Ch???n nh?? cung c???p"
                                      noOptionsMessage={() => (
                                        <>Kh??ng c?? t??m th???y nh?? cung c???p ph?? h???p</>
                                      )}
                                      isClearable={true}
                                      isSearchable={true}
                                      name="manufacturerId"
                                      value={FormatDataUtils.getSelectedOption(
                                        manufacturerList,
                                        selectedManufacuter,
                                      )}
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
                                  )}
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
                            {/* <CardHeader title="???nh s???n ph???m" /> */}
                            <CardContent sx={{ width: '100%' }}>
                              <Typography variant="h6">???nh s???n ph???m</Typography>
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
                                    L??u ch???nh s???a
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
                                    Hu??? ch???nh s???a
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
                          title={isAdd ? 'Th??m m???i s???n ph???m' : 'S???a s???n ph???m'}
                        /> */}
                        <CardContent>
                          <Typography variant="h6">Th??ng tin s???n ph???m</Typography>
                          <Grid
                            container
                            spacing={2}
                          >
                            <Grid
                              xs={12}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                T??n s???n ph???m: <IconRequired />
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
                                M?? s???n ph???m: <IconRequired />
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
                                ????n v???: <IconRequired />
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
                                M??u s???c:
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
                                M?? t???:
                                {/* <Info className={classes.iconStyle} /> */}
                              </Typography>
                              <TextfieldWrapper
                                id="description"
                                className="text-area-note"
                                name="description"
                                variant="outlined"
                                rows={4}
                                multiline
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
                            ????n v??? quy ?????i{' '}
                            <Checkbox
                              checked={isUseWrapUnitMeasure}
                              onClick={() => {
                                handleOnClickCheckboxWrapUnitMeasure();
                                setFieldValue(
                                  'isUseWrapUnitMeasure',
                                  !isUseWrapUnitMeasure,
                                );
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
                                  ????n v??? quy ?????i:
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
                                  S??? l?????ng ????n v???:
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
                        {/* <CardHeader title="Ph??n lo???i" /> */}
                        <CardContent>
                          <Typography variant="h6">Ph??n lo???i</Typography>
                          <Grid
                            container
                            spacing={2}
                          >
                            <Grid
                              xs={12}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                Danh m???c: <IconRequired />
                              </Typography>
                              {/* {selectedCategory && ( */}
                              <Select
                                classNamePrefix="select"
                                placeholder="Ch???n danh m???c."
                                noOptionsMessage={() => (
                                  <>Kh??ng c?? t??m th???y danh m???c ph?? h???p</>
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
                                  onChangeCategory(e);
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
                                Danh m???c ph???:
                              </Typography>
                              {/* {selectedCategory && ( */}
                              {!!subCategoryList && (
                                <Select
                                  classNamePrefix="select"
                                  placeholder="Ch???n danh m???c ph???"
                                  noOptionsMessage={() => (
                                    <>Kh??ng c?? t??m th???y danh m???c ph?? h???p</>
                                  )}
                                  isClearable={true}
                                  isSearchable={true}
                                  name="subCategoryId"
                                  value={selectedSubCategory}
                                  options={FormatDataUtils.getOptionWithIdandName(
                                    subCategoryList,
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
                                    setSelectedSubCategory(e);
                                  }}
                                />
                              )}
                              {/* )} */}
                            </Grid>
                            <Grid
                              xs={12}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                Nh?? cung c???p: <IconRequired />
                              </Typography>
                              {/* {selectedManufacturer && ( */}
                              <Select
                                classNamePrefix="select"
                                placeholder="Ch???n nh?? cung c???p"
                                noOptionsMessage={() => (
                                  <>Kh??ng c?? t??m th???y nh?? cung c???p ph?? h???p</>
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
                        {/* <CardHeader title="???nh s???n ph???m" /> */}
                        <CardContent sx={{ width: '100%' }}>
                          <Typography variant="h6">???nh s???n ph???m</Typography>
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
                                Th??m s???n ph???m
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
                                Hu???
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
