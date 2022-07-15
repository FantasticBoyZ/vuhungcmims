import ButtonWrapper from '@/components/Common/FormsUI/Button';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import { getManufacturerById, saveManufacturer } from '@/slices/ManufacturerSlice';
import { Info } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  FormHelperText,
  Grid,
  Stack,
  Tooltip,
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
import ManufactorService from '@/services/manufactorService';
import Select from 'react-select';
import FormatDataUtils from '@/utils/formatData';
import IconRequired from '@/components/Common/IconRequired';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    padding: '30px 20px',
    marginBottom: '20px',
  },
  cardInfo: {
    marginBottom: '24px',
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
  // formContainer: {
  //   padding: '24px',
  //   rowGap: '20px',
  // },
  // manufacturerName: {
  //   marginBottom: '24px',
  // },
  phoneStyle: {
    paddingRight: '12px',
  },
  emailStyle: {
    paddingLeft: '12px',
  },
  errorTextHelper: {
    paddingLeft: '15px',
  },
}));

const AddEditManufacturerForm = () => {
  const { manufacturerId } = useParams();
  const [selectedProvince, setSelectedProvince] = useState();
  const [selectedDistrict, setSelectedDistrict] = useState();
  const [selectedWard, setSelectedWard] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.manufacturers }));
  const [manufacturer, setManufacturer] = useState();
  const classes = useStyles();
  const isAdd = !manufacturerId;
  // console.log(isAdd);
  // const { initialFormValue, setInitialFormValue } = useState({
  //   name: '',
  //   email: '',
  //   phone: '',
  // });
  const initialManufacturerValue = isAdd
    ? {
      name: '',
      email: '',
      phone: '',
      provinceId: '',
      districtId: '',
      wardId: '',
      addressDetail: '',
    }
    : manufacturer;
  // const phoneRegExp =
  //   '(84|0[3|5|7|8|9])+([0-9]{8})\b';

  const provinceTestData = [
    {
      id: 1,
      name: 'Hà Nội',
    },
  ];

  const districtTestData = [
    {
      id: 1,
      name: 'Huyện Thạch Thất',
    },
  ];

  const wardTestData = [
    {
      id: 1,
      name: 'Xã Thạch Hoà',
    },
  ];

  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string()
      .max(200, 'Tên nhà sản xuất không thể dài quá 200 kí tự')
      .required('Chưa nhập tên nhà sản xuất'),
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Chưa nhập email nhà sản xuất'),

    phone: Yup.number().required('Chưa nhập số điện thoại nhà sản xuất'),
    provinceId: Yup.string().required('Chưa chọn tỉnh/thành phố'),
    districtId: Yup.number().required('Chưa chọn quận/huyện phố'),
    wardId: Yup.number().required('Chưa chọn xã/phường'),
    // .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
  });

  const saveManufacturerDetail = async (manufacturer) => {
    try {
      // const actionResult = await dispatch(saveManufacturer(manufacturer));
      // const dataResult = unwrapResult(actionResult);
      // console.log('dataResult', dataResult);
      ManufactorService.saveManufacturer(manufacturer).then(
        (response) => {
          if (isAdd) {
            toast.success('Thêm nhà sản xuất thành công!');
            navigate('/manufacturer');
          } else {
            toast.success('Sửa nhà sản xuất thành công!');
            navigate(`/manufacturer/detail/${manufacturerId}`);
          }
          return response.data;
        },
        (error) => {
          if (isAdd) {
            toast.error('Thêm nhà sản xuất thất bại!');
          } else {
            toast.error('Sửa nhà sản xuất thất bại!');
          }
          console.log(error);
        },
      );
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
      provinceId: values.provinceId,
      districtId: values.districtId,
      wardId: values.wardId,
      addressDetail: values.addressDetail,
    };
    console.log(values);
    saveManufacturerDetail(newManufacturer);
  };

  const handleOnClickExit = () => {
    navigate(isAdd ? '/manufacturer' : `/manufacturer/detail/${manufacturerId}`);
  };

  useEffect(() => {
    const fetchManufacturerDetail = async (manufacturerId) => {
      try {
        const actionResult = await dispatch(getManufacturerById(manufacturerId));
        const dataResult = unwrapResult(actionResult);
        if (dataResult.data) {
          setManufacturer(dataResult.data.manufactor);
          // TODO: sửa provinceTestData,districtTestData, wardTestData thành data get từ api và sửa logic province => district => ward
          setSelectedProvince(
            FormatDataUtils.getSelectedOption(
              provinceTestData,
              dataResult.data.manufactor.provinceId,
            ),
          );
          setSelectedDistrict(
            FormatDataUtils.getSelectedOption(
              districtTestData,
              dataResult.data.manufactor.districtId,
            ),
          );
          setSelectedWard(
            FormatDataUtils.getSelectedOption(
              wardTestData,
              dataResult.data.manufactor.wardId,
            ),
          );
        }
        console.log(dataResult.data.manufactor);
        console.log('dataResult', dataResult);
      } catch (error) {
        console.log('Failed to fetch manufacturer detail: ', error);
      }
    };
    // console.log('subProductList', subProductList);
    if (!isAdd) {
      fetchManufacturerDetail(manufacturerId);
    }
    console.log(FormatDataUtils.getOptionWithIdandName(provinceTestData));
  }, [manufacturerId]);

  return (
    <Container maxWidth="lg">
      {/* Update manufacturer info */}
      {manufacturer && (
        <Formik
          initialValues={{ ...manufacturer }}
          validationSchema={FORM_VALIDATION}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ values, errors, setFieldValue }) => (
            <Form>
              {!isAdd && loading ? (
                <>Loading...</>
              ) : (
                <Box>
                  <Card className={classes.cardInfo}>
                    <CardHeader title="Thông tin nhà sản xuất" />

                    <CardContent>
                      {/* {!!manufacturer && ( */}
                      <Grid
                        container
                        spacing={2}
                      >
                        <Grid
                          xs={12}
                          item
                        >
                          <Typography className={classes.wrapIcon}>
                            Tên nhà sản xuất: <IconRequired />
                            {/* <Info className={classes.iconStyle} /> */}
                          </Typography>
                          <TextfieldWrapper
                            name="name"
                            fullWidth
                            id="name"
                            autoComplete="name"
                            autoFocus
                            className={classes.manufacturerName}
                          />
                        </Grid>
                        <Grid
                          xs={6}
                          item
                          className={classes.phoneStyle}
                        >
                          <Typography className={classes.wrapIcon}>
                            Số điện thoại: <IconRequired />
                            {/* <Info className={classes.iconStyle} /> */}
                          </Typography>
                          <TextfieldWrapper
                            name="phone"
                            fullWidth
                            id="phone"
                            autoComplete="phone"
                          // autoFocus
                          />
                        </Grid>
                        <Grid
                          xs={6}
                          item
                          className={classes.emailStyle}
                        >
                          <Typography className={classes.wrapIcon}>
                            Email: <IconRequired />
                            {/* <Info className={classes.iconStyle} /> */}
                          </Typography>
                          <TextfieldWrapper
                            name="email"
                            fullWidth
                            id="email"
                            autoComplete="email"
                          // autoFocus
                          />
                        </Grid>
                      </Grid>
                      {/* )} */}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader title="Thông tin địa chỉ" />
                    <CardContent>
                      <Grid
                        container
                        spacing={2}
                      >
                        <Grid
                          xs={4}
                          item
                        >
                          <Typography className={classes.wrapIcon}>
                            Tỉnh: <IconRequired />
                          </Typography>
                          {selectedProvince && (
                            <Select
                              classNamePrefix="select"
                              placeholder="Chọn tỉnh thành."
                              noOptionsMessage={() => (
                                <>Không có tìm thấy tỉnh thành phù hợp</>
                              )}
                              isClearable={true}
                              isSearchable={true}
                              name="provinceId"
                              value={selectedProvince}
                              options={FormatDataUtils.getOptionWithIdandName(
                                provinceTestData,
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
                                setFieldValue('provinceId', e?.value);
                              }}
                            />
                          )}
                          <FormHelperText
                            error={true}
                            className={classes.errorTextHelper}
                          >
                            {errors.provinceId}
                          </FormHelperText>
                        </Grid>
                        <Grid
                          xs={4}
                          item
                        >
                          <Typography className={classes.wrapIcon}>
                            Huyện: <IconRequired />
                          </Typography>
                          {selectedDistrict && (
                            <Select
                              classNamePrefix="select"
                              placeholder="Chọn quận/huyện"
                              noOptionsMessage={() => (
                                <>Không có tìm thấy quận/huyện phù hợp</>
                              )}
                              isClearable={true}
                              isSearchable={true}
                              name="districtId"
                              value={selectedDistrict}
                              options={FormatDataUtils.getOptionWithIdandName(
                                districtTestData,
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
                                setFieldValue('districtId', e?.value);
                              }}
                            />
                          )}
                          <FormHelperText
                            error={true}
                            className={classes.errorTextHelper}
                          >
                            {errors.districtId}
                          </FormHelperText>
                        </Grid>
                        <Grid
                          xs={4}
                          item
                        >
                          <Typography className={classes.wrapIcon}>
                            Xã: <IconRequired />
                          </Typography>
                          {selectedWard && (
                            <Select
                              classNamePrefix="select"
                              placeholder="Chọn xã/phường"
                              noOptionsMessage={() => (
                                <>Không có tìm thấy xã/phường thành phù hợp</>
                              )}
                              isClearable={true}
                              isSearchable={true}
                              name="wardId"
                              value={selectedWard}
                              options={FormatDataUtils.getOptionWithIdandName(
                                wardTestData,
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
                                setFieldValue('wardId', e?.value);
                              }}
                            />
                          )}
                          <FormHelperText
                            error={true}
                            className={classes.errorTextHelper}
                          >
                            {errors.wardId}
                          </FormHelperText>
                        </Grid>
                        <Grid
                          xs={12}
                          item
                        >
                          <Typography className={classes.wrapIcon}>Địa chỉ:</Typography>
                          <TextfieldWrapper
                            name="addressDetail"
                            fullWidth
                            id="addressDetail"
                            autoComplete="addressDetail"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                    {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="flex-end"
                      padding="20px"
                    >
                      <ButtonWrapper color='warning' variant="contained" startIcon={<CheckIcon />}>Lưu chỉnh sửa</ButtonWrapper>
                      <Button
                        color='error'
                        onClick={() => handleOnClickExit()}
                        variant="contained"
                        startIcon={<ClearIcon />}
                      >
                        Hủy chỉnh sửa
                      </Button>
                    </Stack>
                  </Card>
                </Box>
              )}
            </Form>
          )}
        </Formik>
      )}
      {/* Add new manufacturer info */}
      {!manufacturer && isAdd && (
        <Formik
          initialValues={{ ...initialManufacturerValue }}
          validationSchema={FORM_VALIDATION}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ values, errors, setFieldValue }) => (
            <Form>
              <Box>
                <Card className={classes.cardInfo}>
                  <CardHeader title="Thông tin nhà sản xuất" />

                  <CardContent>
                    {/* {!!manufacturer && ( */}
                    <Grid
                      container
                      spacing={2}
                    >
                      <Grid
                        xs={12}
                        item
                      >
                        <Typography className={classes.wrapIcon}>
                          Tên nhà sản xuất: <IconRequired />
                          {/* <Info className={classes.iconStyle} /> */}
                        </Typography>
                        <TextfieldWrapper
                          name="name"
                          fullWidth
                          id="name"
                          autoComplete="name"
                          autoFocus
                          className={classes.manufacturerName}
                        />
                      </Grid>
                      <Grid
                        xs={6}
                        item
                        className={classes.phoneStyle}
                      >
                        <Typography className={classes.wrapIcon}>
                          Số điện thoại: <IconRequired />
                          {/* <Info className={classes.iconStyle} /> */}
                        </Typography>
                        <TextfieldWrapper
                          name="phone"
                          fullWidth
                          id="phone"
                          autoComplete="phone"
                        // autoFocus
                        />
                      </Grid>
                      <Grid
                        xs={6}
                        item
                        className={classes.emailStyle}
                      >
                        <Typography className={classes.wrapIcon}>
                          Email: <IconRequired />
                          {/* <Info className={classes.iconStyle} /> */}
                        </Typography>
                        <TextfieldWrapper
                          name="email"
                          fullWidth
                          id="email"
                          autoComplete="email"
                        // autoFocus
                        />
                      </Grid>
                    </Grid>
                    {/* )} */}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader title="Thông tin địa chỉ" />
                  <CardContent>
                    <Grid
                      container
                      spacing={2}
                    >
                      <Grid
                        xs={4}
                        item
                      >
                        <Typography className={classes.wrapIcon}>
                          Tỉnh: <IconRequired />
                        </Typography>

                        <Select
                          classNamePrefix="select"
                          placeholder="Chọn tỉnh thành."
                          noOptionsMessage={() => (
                            <>Không có tìm thấy tỉnh thành phù hợp</>
                          )}
                          isClearable={true}
                          isSearchable={true}
                          name="provinceId"
                          options={FormatDataUtils.getOptionWithIdandName(
                            provinceTestData,
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
                            setFieldValue('provinceId', e?.value);
                          }}
                        />

                        <FormHelperText
                          error={true}
                          className={classes.errorTextHelper}
                        >
                          {errors.provinceId}
                        </FormHelperText>
                      </Grid>
                      <Grid
                        xs={4}
                        item
                      >
                        <Typography className={classes.wrapIcon}>
                          Huyện: <IconRequired />
                        </Typography>
                        <Select
                          classNamePrefix="select"
                          placeholder="Chọn quận/huyện"
                          noOptionsMessage={() => (
                            <>Không có tìm thấy quận/huyện phù hợp</>
                          )}
                          isClearable={true}
                          isSearchable={true}
                          name="districtId"
                          options={FormatDataUtils.getOptionWithIdandName(
                            districtTestData,
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
                            setFieldValue('districtId', e?.value);
                          }}
                        />
                        <FormHelperText
                          error={true}
                          className={classes.errorTextHelper}
                        >
                          {errors.districtId}
                        </FormHelperText>
                      </Grid>
                      <Grid
                        xs={4}
                        item
                      >
                        <Typography className={classes.wrapIcon}>
                          Xã: <IconRequired />
                        </Typography>
                        <Select
                          classNamePrefix="select"
                          placeholder="Chọn xã/phường"
                          noOptionsMessage={() => (
                            <>Không có tìm thấy xã/phường thành phù hợp</>
                          )}
                          isClearable={true}
                          isSearchable={true}
                          name="wardId"
                          options={FormatDataUtils.getOptionWithIdandName(wardTestData)}
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
                            setFieldValue('wardId', e?.value);
                          }}
                        />
                        <FormHelperText
                          error={true}
                          className={classes.errorTextHelper}
                        >
                          {errors.wardId}
                        </FormHelperText>
                      </Grid>
                      <Grid
                        xs={12}
                        item
                      >
                        <Typography className={classes.wrapIcon}>Địa chỉ:</Typography>
                        <TextfieldWrapper
                          name="addressDetail"
                          fullWidth
                          id="addressDetail"
                          autoComplete="addressDetail"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                  <pre>{JSON.stringify(values, null, 2)}</pre>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-end"
                    padding="20px"
                  >
                    <ButtonWrapper color='success' variant="contained" startIcon={<CheckIcon />}>Thêm nhà sản xuất</ButtonWrapper>
                    <Button
                      color='error'
                      onClick={() => handleOnClickExit()}
                      variant="contained"
                      startIcon={<ClearIcon />}
                    >
                      Hủy
                    </Button>
                  </Stack>
                </Card>
              </Box>
            </Form>
          )}
        </Formik>
      )}
    </Container>
  );
};

export default AddEditManufacturerForm;
