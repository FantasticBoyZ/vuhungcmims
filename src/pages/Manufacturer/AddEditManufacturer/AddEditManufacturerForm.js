import ButtonWrapper from '@/components/Common/FormsUI/Button';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import { getManufacturerById, saveManufacturer } from '@/slices/ManufacturerSlice';
import { Info } from '@mui/icons-material';
import { Box, Button, Card, Container, Grid, Stack, Typography } from '@mui/material';
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

const AddEditManufacturerForm = () => {
  const { manufacturerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.manufacturers }));
  const [manufacturer, setManufacturer] = useState();
  const classes = useStyles();
  const isAdd = !manufacturerId;
  console.log(isAdd);
  const { initialFormValue, setInitialFormValue } = useState({
    name: '',
    email: '',
    phone: '',
  });
  const initialManufacturerValue = isAdd
    ? {
        name: '',
        email: '',
        phone: '',
      }
    : manufacturer;
  // const phoneRegExp =
  //   '(84|0[3|5|7|8|9])+([0-9]{8})\b';

  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string()
      .max(200, 'Tên nhà cung cấp không thể dài quá 200 kí tự')
      .required('Chưa nhập tên nhà cung cấp'),
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Chưa nhập email nhà cung cấp'),

    phone: Yup.number().required('Chưa nhập số điện thoại nhà cung cấp'),
    // .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
  });

  const saveManufacturerDetail = async (manufacturer) => {
    try {
      const actionResult = await dispatch(saveManufacturer(manufacturer));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
    } catch (error) {
      console.log('Failed to save manufacturer: ', error);
    }
  };

  const handleSubmit = (values) => {
    const newManufacturer = {
      id: manufacturerId,
      name: values.name,
      email: values.email,
      phone: values.phone,
    };
    console.log(values);
    saveManufacturerDetail(newManufacturer);

    if (isAdd) {
      toast.success('Thêm nhà cung cấp thành công!');
      navigate('/manufacturer');
    } else {
      toast.success('Sửa nhà cung cấp thành công!');
      navigate(`/manufacturer/${manufacturerId}`);
    }
  };

  const handleOnClickExit = () => {
    navigate(isAdd ? '/manufacturer' : `/manufacturer/detail/${manufacturerId}`);
  };

  useEffect(() => {
    const fetchManufacturerDetail = async () => {
      try {
        const actionResult = await dispatch(getManufacturerById(manufacturerId));
        const dataResult = unwrapResult(actionResult);
        if (dataResult.data) {
          setManufacturer(dataResult.data.manufactor);
        }
        console.log('dataResult', dataResult);
      } catch (error) {
        console.log('Failed to fetch manufacturer detail: ', error);
      }
    };
    // console.log('subProductList', subProductList);
    if (!isAdd) {
      fetchManufacturerDetail();
    }
  }, []);

  return (
    // TODO: call api vào làm phần sửa danh mục
    <Container maxWidth="lg">
      <Card className={classes.cardHeader}>
        <Typography variant="h5">{isAdd ? 'Thêm' : 'Sửa'} nhà cung cấp</Typography>
      </Card>
      <Card>
        {!isAdd && loading ? (
          <>Loading...</>
        ) : (
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
              {manufacturer && (
                <Formik
                  initialValues={{
                    ...initialManufacturerValue,
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
                        xs={12}
                        item
                        // className={classes.leftContainer}
                      >
                        <Box className={classes.infoContainer}>
                          <Typography className={classes.wrapIcon}>
                            Tên nhà cung cấp <Info className={classes.iconStyle} />
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
                            Email <Info className={classes.iconStyle} />
                          </Typography>
                          <TextfieldWrapper
                            name="email"
                            fullWidth
                            id="email"
                            autoComplete="email"
                            // autoFocus
                          />
                        </Box>
                        <Box className={classes.infoContainer}>
                          <Typography className={classes.wrapIcon}>
                            Số điện thoại <Info className={classes.iconStyle} />
                          </Typography>
                          <TextfieldWrapper
                            name="phone"
                            fullWidth
                            id="phone"
                            autoComplete="phone"
                            // autoFocus
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
              )}
            </Grid>
          </Grid>
        )}

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
                  ...initialManufacturerValue,
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
                      xs={12}
                      item
                      // className={classes.leftContainer}
                    >
                      <Box className={classes.infoContainer}>
                        <Typography className={classes.wrapIcon}>
                          Tên nhà cung cấp <Info className={classes.iconStyle} />
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
                          Email <Info className={classes.iconStyle} />
                        </Typography>
                        <TextfieldWrapper
                          name="email"
                          fullWidth
                          id="email"
                          autoComplete="email"
                          // autoFocus
                        />
                      </Box>
                      <Box className={classes.infoContainer}>
                        <Typography className={classes.wrapIcon}>
                          Số điện thoại <Info className={classes.iconStyle} />
                        </Typography>
                        <TextfieldWrapper
                          name="phone"
                          fullWidth
                          id="phone"
                          autoComplete="phone"
                          // autoFocus
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

export default AddEditManufacturerForm;
