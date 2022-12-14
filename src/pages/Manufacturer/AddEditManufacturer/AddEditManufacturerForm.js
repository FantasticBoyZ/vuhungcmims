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
  Divider,
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
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import GetDistrict from '@/pages/Address/GetDistricts';
import GetWard from '@/pages/Address/GetWard';
import GetProvince from '@/pages/Address/GetProvince';
import Popup from '@/components/Common/Popup';
import AlertPopup from '@/components/Common/AlertPopup';
import { getDistrictList, getProvinceList, getWardList } from '@/slices/addressSlice';
import LoadingButton from '@mui/lab/LoadingButton';
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
    color: '#696969',
  },
  textfieldStyle: {
    flex: '5',
  },
  iconStyle: {
    fontSize: 'small',
    margin: '0 10px ',
  },
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
  const { loadingAddress } = useSelector((state) => ({ ...state.address }));
  const [manufacturer, setManufacturer] = useState();
  const classes = useStyles();
  const isAdd = !manufacturerId;
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [touchedProvinceId, setTouchedProvinceId] = useState(false);
  const [touchedDistrictId, setTouchedDistrictId] = useState(false);
  const [touchedWardId, setTouchedWardId] = useState(false);
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);

  const initialManufacturerValue = {
    name: '',
    email: '',
    phone: '',
    provinceId: '',
    districtId: '',
    wardId: '',
    addressDetail: '',
  };

  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string()
      .trim()
      .max(255, 'T??n nh?? s???n xu???t kh??ng th??? d??i qu?? 255 k?? t???')
      .required('Ch??a nh???p t??n nh?? s???n xu???t'),
    email: Yup.string()
      .email('Email kh??ng h???p l???')
      .max(255, 'Email kh??ng th??? d??i qu?? 255 k?? t???')
      .required('Ch??a nh???p email nh?? s???n xu???t'),

    phone: Yup.string()
      .required('Ch??a nh???p s??? ??i???n tho???i nh?? s???n xu???t')
      .test('phone', 'Vui l??ng xo?? c??c kho???ng tr???ng', function (value) {
        if (value) {
          return !value.includes(' ');
        }
      })
      .matches(
        /^[\+84|84|0]+([0-9]{9,10})$/,
        'S??? ??i???n tho???i c???a nh?? cung c???p kh??ng h???p l???',
      ),
    provinceId: Yup.string().required('Ch??a ch???n t???nh/th??nh ph???'),
    districtId: Yup.number().required('Ch??a ch???n qu???n/huy???n/th??nh ph???'),
    wardId: Yup.number().required('Ch??a ch???n ph?????ng/x??'),
    addressDetail: Yup.string()
      .trim()
      .max(255, '?????a ch??? chi ti???t kh??ng th??? d??i qu?? 255 k?? t???')
      .required('Ch??a nh???p ?????a ch??? chi ti???t'),
  });

  const onChangeProvince = (e) => {
    setDistrictList([]);
    setWardList([]);
    setSelectedDistrict(null);
    setSelectedWard(null);
    if (e !== null) {
      setSelectedProvince(e.value);
    } else {
      setSelectedProvince(e);
    }
  };

  const onChangeDistrict = (e) => {
    setWardList([]);
    setSelectedWard(null);
    if (e !== null) {
      setSelectedDistrict(e.value);
    } else {
      setSelectedDistrict(e);
    }
  };

  const onChangeWard = (e) => {
    if (e !== null) {
      setSelectedWard(e.value);
    } else {
      setSelectedWard(e);
    }
  };

  const saveManufacturerDetail = async (manufacturer) => {
    setLoadingButton(true);
    try {
      ManufactorService.saveManufacturer(manufacturer).then(
        (response) => {
          if (isAdd) {
            toast.success('Th??m nh?? s???n xu???t th??nh c??ng!');
            setLoadingButton(false);
            navigate('/manufacturer');
          } else {
            toast.success('S???a nh?? s???n xu???t th??nh c??ng!');
            setLoadingButton(false);
            navigate(`/manufacturer/detail/${manufacturerId}`);
          }
          return response.data;
        },
        (error) => {
          if (isAdd) {
            toast.error('Th??m nh?? s???n xu???t th???t b???i!');
            setLoadingButton(false);
          } else {
            toast.error('S???a nh?? s???n xu???t th???t b???i!');
            setLoadingButton(false);
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
      id: isAdd ? '' : manufacturerId,
      name: FormatDataUtils.removeExtraSpace(values.name),
      email: values.email,
      phone: values.phone,
      provinceId: values.provinceId,
      districtId: values.districtId,
      wardId: values.wardId,
      addressDetail: FormatDataUtils.removeExtraSpace(values.addressDetail),
    };
    // setOpenPopup(true);
    // setTitle(
    //   isAdd
    //     ? 'B???n c?? ch???c ch???n mu???n th??m nh?? xu???t kh??ng?'
    //     : 'B???n c?? ch???c ch???n mu???n l??u l???i ch???nh s???a kh??ng?',
    // );
    // setMessage('H??y ki???m tra k??? th??ng tin tr?????c khi x??c nh???n.');
    // setManufacturer(newManufacturer);
    // ??ang b??? bug hi???n popup nh??ng ???n ????ng th?? tr???ng m??n h??nh n??n save lu??n khi ???n n??t
    saveManufacturerDetail(newManufacturer);
  };

  const handleConfirm = () => {
    saveManufacturerDetail(manufacturer);
    setOpenPopup(false);
  };

  const handleOnClickExit = () => {
    navigate(isAdd ? '/manufacturer' : `/manufacturer/detail/${manufacturerId}`);
  };

  const getProvince = async (keyword) => {
    try {
      const actionResult = await dispatch(getProvinceList());
      const dataResult = unwrapResult(actionResult);
      if (dataResult.data) {
        setProvinceList(dataResult.data.province);
      }
    } catch (error) {
      console.log('Failed to fetch setProvince list: ', error);
    }
  };

  const getDistrict = async (keyword) => {
    try {
      const params = {
        provinceId: selectedProvince,
      };
      const actionResult = await dispatch(getDistrictList(params));
      const dataResult = unwrapResult(actionResult);
      if (dataResult.data) {
        setDistrictList(dataResult.data.district);
      }
    } catch (error) {
      console.log('Failed to fetch setDistrict list: ', error);
    }
  };

  const getWard = async (keyword) => {
    try {
      const params = {
        districtId: selectedDistrict,
      };
      const actionResult = await dispatch(getWardList(params));
      const dataResult = unwrapResult(actionResult);
      if (dataResult.data) {
        setWardList(dataResult.data.ward);
      }
    } catch (error) {
      console.log('Failed to fetch setWard list: ', error);
    }
  };

  useEffect(() => {
    getProvince();
    if (selectedProvince) {
      getDistrict();
    }
    if (selectedDistrict) {
      getWard();
    }
  }, [selectedProvince, selectedDistrict]);

  useEffect(() => {
    const fetchManufacturerDetail = async (manufacturerId) => {
      try {
        const params = {
          manufacturerId: manufacturerId,
        };
        const actionResult = await dispatch(getManufacturerById(params));
        const dataResult = unwrapResult(actionResult);
        if (dataResult.data) {
          setManufacturer(dataResult.data.manufactor);
          setSelectedProvince(dataResult.data.manufactor.provinceId);
          setSelectedDistrict(dataResult.data.manufactor.districtId);
          setSelectedWard(dataResult.data.manufactor.wardId);
        } else {
          navigate('/404');
        }
        console.log(dataResult.data.manufactor);
        console.log('dataResult', dataResult);
      } catch (error) {
        console.log('Failed to fetch manufacturer detail: ', error);
      }
    };
    // console.log('subProductList', subProductList);
    if (!isAdd) {
      if (isNaN(manufacturerId)) {
        navigate('/404');
      } else {
        fetchManufacturerDetail(manufacturerId);
      }
    }
  }, [manufacturerId]);

  // useEffect(() => {
  //   if (selectedProvince) {
  //     setSelectedDistrict('');
  //     setSelectedWard('')
  //   }
  // }, [selectedProvince])

  return (
    <Container maxWidth="lg">
      {/* Update manufacturer info */}
      <Box>
        {loading ? (
          <ProgressCircleLoading />
        ) : (
          <Box>
            {manufacturer && !isAdd && (
              <Formik
                initialValues={{ ...manufacturer }}
                validationSchema={FORM_VALIDATION}
                onSubmit={(values) => handleSubmit(values)}
              >
                {({ values, errors, setFieldValue }) => (
                  <Form>
                    <Box>
                      <Card className={classes.cardInfo}>
                        <CardHeader title="Th??ng tin nh?? s???n xu???t" />

                        <CardContent>
                          {/* {!!manufacturer && ( */}
                          <Grid
                            container
                            spacing={2}
                            padding={2}
                          >
                            <Grid
                              xs={12}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                T??n nh?? s???n xu???t <IconRequired />
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
                              xs={12}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                S??? ??i???n tho???i <IconRequired />
                              </Typography>
                              <TextfieldWrapper
                                name="phone"
                                fullWidth
                                id="phone"
                                autoComplete="phone"
                              />
                            </Grid>
                            <Grid
                              xs={12}
                              item
                            >
                              <Typography className={classes.wrapIcon}>Email</Typography>
                              <TextfieldWrapper
                                name="email"
                                fullWidth
                                id="email"
                                autoComplete="email"
                              />
                            </Grid>
                          </Grid>
                          {/* )} */}
                          <Grid
                            container
                            spacing={2}
                            paddingTop={2}
                            paddingX={2}
                          >
                            <Grid
                              xs={12}
                              item
                            >
                              <Divider
                                textAlign="left"
                                style={{ fontSize: '18px' }}
                              >
                                ?????a ch???
                              </Divider>
                            </Grid>
                          </Grid>

                          <Grid
                            container
                            spacing={2}
                            padding={2}
                          >
                            <Grid
                              xs={4}
                              item
                            >
                              <Typography>
                                T???nh/Th??nh ph???
                                <IconRequired />
                              </Typography>
                              {/* {!!provinceList && ( */}
                              <Select
                                classNamePrefix="select"
                                placeholder="Ch???n t???nh/th??nh ph???"
                                noOptionsMessage={() => (
                                  <>Kh??ng t??m th???y T???nh/Th??nh ph??? ph?? h???p</>
                                )}
                                isClearable={true}
                                isSearchable={true}
                                isLoading={loadingAddress && !selectedProvince}
                                name="provinceId"
                                value={FormatDataUtils.getSelectedOption(
                                  provinceList,
                                  selectedProvince,
                                )}
                                options={FormatDataUtils.getOptionWithIdandName(
                                  provinceList,
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
                                onFocus={() => setTouchedProvinceId(true)}
                                onChange={(e) => {
                                  setFieldValue('provinceId', e?.value);
                                  setFieldValue('districtId', '', false);
                                  setFieldValue('wardId', '', false);
                                  onChangeProvince(e);
                                }}
                              />
                              {touchedProvinceId && (
                                <FormHelperText
                                  className={classes.formHelperTextStyle}
                                  error={true}
                                  sx={{ height: '20px' }}
                                >
                                  {errors.provinceId}
                                </FormHelperText>
                              )}
                              {/* )} */}
                            </Grid>
                            <Grid
                              xs={4}
                              item
                            >
                              <Typography>
                                Qu???n/Huy???n/Th??nh ph???
                                <IconRequired />
                              </Typography>
                              {/* {!!districtList && ( */}
                              <Select
                                classNamePrefix="select"
                                placeholder="Ch???n qu???n/huy???n/th??nh ph???"
                                noOptionsMessage={() => (
                                  <>Kh??ng t??m th???y Qu???n/Huy???n/Th??nh ph??? ph?? h???p</>
                                )}
                                isClearable={true}
                                isSearchable={true}
                                isLoading={loadingAddress && !selectedDistrict}
                                name="districtId"
                                isDisabled={!selectedProvince}
                                value={FormatDataUtils.getSelectedOption(
                                  districtList,
                                  selectedDistrict,
                                )}
                                options={FormatDataUtils.getOptionWithIdandName(
                                  districtList,
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
                                onFocus={() => setTouchedDistrictId(true)}
                                onChange={(e) => {
                                  setFieldValue('districtId', e?.value);
                                  setFieldValue('wardId', '', false);
                                  onChangeDistrict(e);
                                }}
                              />
                              {touchedDistrictId && (
                                <FormHelperText
                                  className={classes.formHelperTextStyle}
                                  error={true}
                                  sx={{ height: '20px' }}
                                >
                                  {errors.districtId}
                                </FormHelperText>
                              )}
                              {/* )} */}
                            </Grid>
                            <Grid
                              xs={4}
                              item
                            >
                              <Typography>
                                Ph?????ng/X?? <IconRequired />
                              </Typography>
                              {/* {!!wardList && ( */}
                              <Select
                                classNamePrefix="select"
                                placeholder="Ch???n x??/ph?????ng"
                                noOptionsMessage={() => (
                                  <>Kh??ng t??m th???y X??/Ph?????ng ph?? h???p</>
                                )}
                                isClearable={true}
                                isSearchable={true}
                                isLoading={loadingAddress && !selectedWard}
                                name="wardId"
                                isDisabled={!selectedDistrict}
                                value={FormatDataUtils.getSelectedOption(
                                  wardList,
                                  selectedWard,
                                )}
                                options={FormatDataUtils.getOptionWithIdandName(wardList)}
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                  control: (base) => ({
                                    ...base,
                                    height: 56,
                                    minHeight: 56,
                                  }),
                                }}
                                onFocus={() => setTouchedWardId(true)}
                                onChange={(e) => {
                                  setFieldValue('wardId', e !== null ? e?.value : null);
                                  onChangeWard(e);
                                }}
                              />
                              {touchedWardId && (
                                <FormHelperText
                                  className={classes.formHelperTextStyle}
                                  error={true}
                                  sx={{ height: '20px' }}
                                >
                                  {errors.wardId}
                                </FormHelperText>
                              )}
                              {/* )} */}
                            </Grid>
                            <Grid
                              xs={12}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                ?????a ch??? chi ti???t <IconRequired />
                              </Typography>
                              <TextfieldWrapper
                                name="addressDetail"
                                fullWidth
                                id="addressDetail"
                                autoComplete="addressDetail"
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>

                      <Card>
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent="flex-end"
                          padding="20px"
                        >
                          <LoadingButton
                            color="warning"
                            variant="contained"
                            loading={loadingButton}
                            type="submit"
                            loadingPosition="start"
                            startIcon={<CheckIcon />}
                            onClick={() => {
                              setTouchedProvinceId(true);
                              setTouchedDistrictId(true);
                              setTouchedWardId(true);
                            }}
                          >
                            L??u ch???nh s???a
                          </LoadingButton>
                          <Button
                            color="error"
                            onClick={() => handleOnClickExit()}
                            disabled={loadingButton}
                            variant="contained"
                            startIcon={<ClearIcon />}
                          >
                            H???y ch???nh s???a
                          </Button>
                        </Stack>
                      </Card>
                    </Box>
                  </Form>
                )}
              </Formik>
            )}
            {/* Add new manufacturer info */}
            {!manufacturer && !!isAdd && (
              <Formik
                initialValues={{ ...initialManufacturerValue }}
                validationSchema={FORM_VALIDATION}
                onSubmit={(values) => handleSubmit(values)}
              >
                {({ values, errors, setFieldValue }) => (
                  <Form>
                    <Box>
                      <Card className={classes.cardInfo}>
                        <CardHeader title="Th??ng tin nh?? s???n xu???t" />

                        <CardContent>
                          {/* {!!manufacturer && ( */}
                          <Grid
                            container
                            spacing={2}
                            padding={2}
                          >
                            <Grid
                              xs={12}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                T??n nh?? s???n xu???t <IconRequired />
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
                              xs={12}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                S??? ??i???n tho???i <IconRequired />
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
                              xs={12}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                Email
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
                          <Grid
                            container
                            spacing={2}
                            paddingTop={2}
                            paddingX={2}
                          >
                            <Grid
                              xs={12}
                              item
                            >
                              <Divider
                                textAlign="left"
                                style={{ fontSize: '18px' }}
                              >
                                ?????a ch???
                              </Divider>
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            spacing={2}
                            padding={2}
                          >
                            <Grid
                              xs={4}
                              item
                            >
                              <Typography>
                                T???nh/Th??nh ph???
                                <IconRequired />
                              </Typography>
                              {/* {!!provinceList && ( */}
                              <Select
                                classNamePrefix="select"
                                placeholder="Ch???n t???nh/th??nh ph???"
                                noOptionsMessage={() => (
                                  <>Kh??ng t??m th???y T???nh/Th??nh ph??? ph?? h???p</>
                                )}
                                isClearable={true}
                                isSearchable={true}
                                isLoading={loadingAddress && !selectedProvince}
                                name="provinceId"
                                value={FormatDataUtils.getSelectedOption(
                                  provinceList,
                                  selectedProvince,
                                )}
                                options={FormatDataUtils.getOptionWithIdandName(
                                  provinceList,
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
                                onFocus={() => setTouchedProvinceId(true)}
                                onChange={(e) => {
                                  setFieldValue('provinceId', e?.value);
                                  setFieldValue('districtId', '', false);
                                  onChangeProvince(e);
                                }}
                              />
                              {touchedProvinceId && (
                                <FormHelperText
                                  className={classes.formHelperTextStyle}
                                  error={true}
                                  sx={{ height: '20px' }}
                                >
                                  {errors.provinceId}
                                </FormHelperText>
                              )}
                              {/* )} */}
                            </Grid>
                            <Grid
                              xs={4}
                              item
                            >
                              <Typography>
                                Qu???n/Huy???n/Th??nh ph???
                                <IconRequired />
                              </Typography>
                              {/* {!!districtList && ( */}
                              <Select
                                classNamePrefix="select"
                                placeholder="Ch???n qu???n/huy???n/th??nh ph???"
                                noOptionsMessage={() => (
                                  <>Kh??ng t??m th???y Qu???n/Huy???n/Th??nh ph??? ph?? h???p</>
                                )}
                                isClearable={true}
                                isSearchable={true}
                                isLoading={loadingAddress && !selectedDistrict}
                                name="districtId"
                                isDisabled={!selectedProvince}
                                value={FormatDataUtils.getSelectedOption(
                                  districtList,
                                  selectedDistrict,
                                )}
                                options={FormatDataUtils.getOptionWithIdandName(
                                  districtList,
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
                                onFocus={() => setTouchedDistrictId(true)}
                                onChange={(e) => {
                                  setFieldValue('districtId', e?.value);
                                  setFieldValue('wardId', '', false);
                                  onChangeDistrict(e);
                                }}
                              />
                              {touchedDistrictId && (
                                <FormHelperText
                                  className={classes.formHelperTextStyle}
                                  error={true}
                                  sx={{ height: '20px' }}
                                >
                                  {errors.districtId}
                                </FormHelperText>
                              )}
                              {/* )} */}
                            </Grid>
                            <Grid
                              xs={4}
                              item
                            >
                              <Typography>
                                Ph?????ng/X?? <IconRequired />
                              </Typography>
                              {/* {!!wardList && ( */}
                              <Select
                                classNamePrefix="select"
                                placeholder="Ch???n x??/ph?????ng"
                                noOptionsMessage={() => (
                                  <>Kh??ng t??m th???y X??/Ph?????ng ph?? h???p</>
                                )}
                                isClearable={true}
                                isSearchable={true}
                                isLoading={loadingAddress && !selectedWard}
                                name="wardId"
                                isDisabled={!selectedDistrict}
                                value={FormatDataUtils.getSelectedOption(
                                  wardList,
                                  selectedWard,
                                )}
                                options={FormatDataUtils.getOptionWithIdandName(wardList)}
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                  control: (base) => ({
                                    ...base,
                                    height: 56,
                                    minHeight: 56,
                                  }),
                                }}
                                onFocus={() => setTouchedWardId(true)}
                                onChange={(e) => {
                                  setFieldValue('wardId', e !== null ? e?.value : null);
                                  onChangeWard(e);
                                }}
                              />
                              {touchedWardId && (
                                <FormHelperText
                                  className={classes.formHelperTextStyle}
                                  error={true}
                                  sx={{ height: '20px' }}
                                >
                                  {errors.wardId}
                                </FormHelperText>
                              )}
                              {/* )} */}
                            </Grid>
                            <Grid
                              xs={12}
                              item
                            >
                              <Typography className={classes.wrapIcon}>
                                ?????a ch??? chi ti???t <IconRequired />
                              </Typography>
                              <TextfieldWrapper
                                name="addressDetail"
                                fullWidth
                                id="addressDetail"
                                autoComplete="addressDetail"
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                      <Card>
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent="flex-end"
                          padding="20px"
                        >
                          <LoadingButton
                            color="success"
                            variant="contained"
                            type="submit"
                            loading={loadingButton}
                            loadingPosition="start"
                            startIcon={<CheckIcon />}
                          >
                            Th??m nh?? s???n xu???t
                          </LoadingButton>
                          <Button
                            color="error"
                            onClick={() => handleOnClickExit()}
                            variant="contained"
                            disabled={loadingButton}
                            startIcon={<ClearIcon />}
                          >
                            H???y
                          </Button>
                        </Stack>
                      </Card>
                    </Box>
                    {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                  </Form>
                )}
              </Formik>
            )}
            {/* <Popup
        title={isAdd ? 'B???n c?? ch???c ch???n mu???n th??m nh?? xu???t kh??ng?' : "B???n c?? ch???c ch???n mu???n l??u l???i ch???nh s???a kh??ng?"}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <Typography >
          H??y ki???m tra k??? th??ng tin tr?????c khi x??c nh???n.
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          padding="20px"
        >
          <Button
            variant="contained"
            olor='primary'
            onClick={() => handleConfirm()}
          >
            X??c nh???n</Button>
          <Button
            variant="outlined"
            onClick={() => setOpenPopup(false)}
          >
            H???y
          </Button>
        </Stack>
      </Popup> */}
          </Box>
        )}
      </Box>
      {/* <AlertPopup
        maxWidth="sm"
        title={title}
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        isConfirm={!errorMessage}
        handleConfirm={handleConfirm}
      >
        <Box
          component={'span'}
          className="popupMessageContainer"
        >
          {errorMessage ? errorMessage : message}
        </Box>
      </AlertPopup> */}
    </Container>
  );
};

export default AddEditManufacturerForm;
