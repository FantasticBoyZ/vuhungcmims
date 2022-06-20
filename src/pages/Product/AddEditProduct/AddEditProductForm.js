import ButtonWrapper from '@/components/Common/FormsUI/Button';
import SelectWrapper from '@/components/Common/FormsUI/Select';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import CategoryService from '@/services/categoryService';
import { getProductDetail, saveProduct } from '@/slices/ProductSlice';
import { Info } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    padding: '30px 20px',
    marginBottom: '20px',
  },
  leftContainer: {
    padding: '20px',
  },
  rightContainer: {
    padding: '20px',
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
  },
}));

const AddEditProductForm = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const { initialFormValue, setInitialFormValue } = useState({
    productCode: '',
    name: '',
    categoryId: '',
    subCategoryId: '',
    unitMeasure: '',
    quantity: '',
    color: '',
    description: '',
    imageUrl: '',
  });
  const [categoryList, setCategoryList] = useState([]);
  const [isAdd, setIsAdd] = useState(true);
  const classes = useStyles();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading, products } = useSelector((state) => ({ ...state.products }));

  const FORM_VALIDATION = Yup.object().shape({
    productCode: Yup.string().required('Chưa nhập mã sản phẩm'),
    name: Yup.string().required('Chưa nhập tên sản phẩm'),
  });

  const saveProductDetail = async (product) => {
    try {
      const actionResult = await dispatch(saveProduct(product));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
    } catch (error) {
      console.log('Failed to save product: ', error);
    }
  };

  const handleSubmit = (values) => {
    const newProduct = {
      id: productId,
      name: values.name,
      productCode: values.productCode,
      unitMeasure: values.unitMeasure,
      // wrapUnitMeasure: values.wrapUnitMeasure,
      // numberOfWrapUnitMeasure: values.numberOfWrapUnitMeasure,
      wrapUnitMeasure: 'hop',
      numberOfWrapUnitMeasure: '2',
      color: values.color,
      description: values.description,
      categoryId: values.categoryId,
      // manufactorId: values.manufactorId,
      manufactorId: '1',
    };
    console.log(values);
    saveProductDetail(newProduct);

    if (isAdd) {
      toast.success('Thêm sản phẩm thành công!');
      navigate('/product');
    } else {
      toast.success('Sửa sản phẩm thành công!');
      navigate(`/product/${productId}`);
    }
  };

  const handleOnClickExit = () => {
    // TODO: fix lỗi nút exit phần thêm mới
    navigate(isAdd ? '/product' : `/product/${productId}`);
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
        setCategoryList(result);
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
        }
        console.log('dataResult', dataResult);
        console.log('product', dataResult.data.product);
        console.log(dataResult);
        console.log('products', products);
      } catch (error) {
        console.log('Failed to fetch product detail: ', error);
      }
    };
    if (!!productId) {
      setIsAdd(false);
      fetchProductDetail();
    }
    fetchCategoryList();
  }, [productId]);
  return (
    <Container maxWidth="xl">
      <Card className={classes.cardHeader}>
        <Typography variant="h4">{isAdd ? 'Thêm ' : 'Sửa '}sản phẩm</Typography>
      </Card>
      <Card>
        {loading && !isAdd ? (
          <>Loading...</>
        ) : (
          <>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
            >
              {product && (
                <Grid
                  xs={12}
                  item
                >
                  <Formik
                    initialValues={{
                      ...product,
                    }}
                    validationSchema={FORM_VALIDATION}
                    onSubmit={(values) => handleSubmit(values)}
                  >
                    <Form>
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="stretch"
                      >
                        <Grid
                          xs={6}
                          item
                          className={classes.leftContainer}
                        >
                          <Box className={classes.infoContainer}>
                            <Typography className={classes.wrapIcon}>
                              Mã sản phẩm <Info className={classes.iconStyle} />
                            </Typography>
                            <TextfieldWrapper
                              name="productCode"
                              fullWidth
                              id="productCode"
                              autoComplete="productCode"
                              autoFocus
                            />
                          </Box>

                          <Box className={classes.infoContainer}>
                            <Typography className={classes.wrapIcon}>
                              Tên sản phẩm <Info className={classes.iconStyle} />
                            </Typography>
                            <TextfieldWrapper
                              name="name"
                              fullWidth
                              id="name"
                              autoComplete="name"
                              autoFocus
                            />
                          </Box>
                          <Box className={classes.infoContainer}>
                            <Typography className={classes.wrapIcon}>
                              Danh mục <Info className={classes.iconStyle} />
                            </Typography>
                            {!!categoryList && (
                              <SelectWrapper
                                name="categoryId"
                                fullWidth
                                options={categoryList}
                                id="categoryId"
                                autoFocus
                              />
                            )}
                          </Box>
                          {/* <Box sx={{ display: 'flex', width: '100%' }}>
                    <Typography>Danh mục phụ</Typography>
                    {!!categoryList && (
                      <SelectWrapper
                        name="subCategoryId"
                        margin="normal"
                        fullWidth
                        options={categoryList}
                        id="subCategoryId"
                      />
                    )}
                  </Box> */}
                          <Box className={classes.infoContainer}>
                            <Typography className={classes.wrapIcon}>
                              Đơn vị tính <Info className={classes.iconStyle} />
                            </Typography>
                            <TextfieldWrapper
                              name="unitMeasure"
                              fullWidth
                              id="unitMeasure"
                              autoComplete="unitMeasure"
                              autoFocus
                            />
                          </Box>
                        </Grid>
                        <Grid
                          xs={6}
                          item
                          className={classes.rightContainer}
                        >
                          {!isAdd && (
                            <Box className={classes.infoContainer}>
                              <Typography className={classes.wrapIcon}>
                                Tồn kho <Info className={classes.iconStyle} />
                              </Typography>
                              <TextField
                                defaultValue={product.quantity}
                                fullWidth
                                InputProps={{
                                  readOnly: true,
                                }}
                              />
                            </Box>
                          )}
                          <Box className={classes.infoContainer}>
                            <Typography className={classes.wrapIcon}>
                              Màu sắc <Info className={classes.iconStyle} />
                            </Typography>
                            <TextfieldWrapper
                              name="color"
                              fullWidth
                              id="color"
                              autoComplete="color"
                              autoFocus
                            />
                          </Box>
                          <Box className={classes.infoContainer}>
                            <Typography className={classes.wrapIcon}>
                              Mô tả <Info className={classes.iconStyle} />
                            </Typography>
                            <TextfieldWrapper
                              name="description"
                              fullWidth
                              multiline
                              rows={4}
                              id="description"
                              autoFocus
                            />
                          </Box>
                        </Grid>
                      </Grid>
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="flex-end"
                        padding="20px"
                      >
                        <ButtonWrapper variant="contained">Lưu</ButtonWrapper>
                        <Button
                          variant="outlined"
                          onClick={() => handleOnClickExit()}
                        >
                          Thoát
                        </Button>
                      </Stack>
                    </Form>
                  </Formik>
                </Grid>
              )}
            </Grid>
          </>
        )}
        {/* TODO: tối ưu code */}
        {isAdd && (
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
          >
            <Grid
              xs={12}
              item
            >
              <Formik
                initialValues={{
                  initialFormValue,
                }}
                validationSchema={FORM_VALIDATION}
                onSubmit={(values) => handleSubmit(values)}
              >
                <Form>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                  >
                    <Grid
                      xs={6}
                      item
                      className={classes.leftContainer}
                    >
                      <Box className={classes.infoContainer}>
                        <Typography className={classes.wrapIcon}>
                          Mã sản phẩm <Info className={classes.iconStyle} />
                        </Typography>
                        <TextfieldWrapper
                          name="productCode"
                          fullWidth
                          id="productCode"
                          autoComplete="productCode"
                          autoFocus
                        />
                      </Box>

                      <Box className={classes.infoContainer}>
                        <Typography className={classes.wrapIcon}>
                          Tên sản phẩm <Info className={classes.iconStyle} />
                        </Typography>
                        <TextfieldWrapper
                          name="name"
                          fullWidth
                          id="name"
                          autoComplete="name"
                          autoFocus
                        />
                      </Box>
                      <Box className={classes.infoContainer}>
                        <Typography className={classes.wrapIcon}>
                          Danh mục <Info className={classes.iconStyle} />
                        </Typography>
                        {!!categoryList && (
                          <SelectWrapper
                            name="categoryId"
                            fullWidth
                            options={categoryList}
                            id="categoryId"
                            autoFocus
                          />
                        )}
                      </Box>
                      {/* <Box sx={{ display: 'flex', width: '100%' }}>
                    <Typography>Danh mục phụ</Typography>
                    {!!categoryList && (
                      <SelectWrapper
                        name="subCategoryId"
                        margin="normal"
                        fullWidth
                        options={categoryList}
                        id="subCategoryId"
                      />
                    )}
                  </Box> */}
                      <Box className={classes.infoContainer}>
                        <Typography className={classes.wrapIcon}>
                          Đơn vị tính <Info className={classes.iconStyle} />
                        </Typography>
                        <TextfieldWrapper
                          name="unitMeasure"
                          fullWidth
                          id="unitMeasure"
                          autoComplete="unitMeasure"
                          autoFocus
                        />
                      </Box>
                    </Grid>
                    <Grid
                      xs={6}
                      item
                      className={classes.rightContainer}
                    >
                      {/* {!isAdd && (
                        <Box className={classes.infoContainer}>
                          <Typography className={classes.wrapIcon}>
                            Tồn kho <Info className={classes.iconStyle} />
                          </Typography>
                          <TextField
                            defaultValue={product.quantity}
                            fullWidth
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Box>
                      )} */}
                      <Box className={classes.infoContainer}>
                        <Typography className={classes.wrapIcon}>
                          Màu sắc <Info className={classes.iconStyle} />
                        </Typography>
                        <TextfieldWrapper
                          name="color"
                          fullWidth
                          id="color"
                          autoComplete="color"
                          autoFocus
                        />
                      </Box>
                      <Box className={classes.infoContainer}>
                        <Typography className={classes.wrapIcon}>
                          Mô tả <Info className={classes.iconStyle} />
                        </Typography>
                        <TextfieldWrapper
                          name="description"
                          fullWidth
                          multiline
                          rows={4}
                          id="description"
                          autoFocus
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-end"
                    padding="20px"
                  >
                    <ButtonWrapper variant="contained">Lưu</ButtonWrapper>
                    <Button
                      onClick={() => handleOnClickExit()}
                      variant="outlined"
                    >
                      Thoát
                    </Button>
                  </Stack>
                </Form>
              </Formik>
            </Grid>
          </Grid>
        )}
      </Card>
    </Container>
  );
};

export default AddEditProductForm;
