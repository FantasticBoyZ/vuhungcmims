import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import IconRequired from '@/components/Common/IconRequired';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import WarehouseList from '@/pages/Warehouse/wareHouseList';
import AuthService from '@/services/authService';
import { getProvinceList, getDistrictList, getWardList } from '@/slices/addressSlice';
import {
  getProfile,
  getStaffDetail,
  signUpStaff,
  updateProfile,
  uploadImageNewStaff,
} from '@/slices/StaffSlice';
import FormatDataUtils from '@/utils/formatData';
import { Close, CloudUpload, Done, Save } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { unwrapResult } from '@reduxjs/toolkit';
import { differenceInYears } from 'date-fns';
import { Form, Formik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  formHelperTextStyle: {
    margin: '3px 14px 0 !important',
  },
}));

const UpdateProfile = () => {
  const staffId = AuthService.getCurrentUser().id;
  const [staff, setStaff] = useState();
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const today = new Date();
  const { loadingAddress } = useSelector((state) => ({ ...state.address }));
  const { loading } = useSelector((state) => ({ ...state.staff }));
  const [touchedDob, setTouchedDob] = useState(false);
  const [touchedProvinceId, setTouchedProvinceId] = useState(false);
  const [touchedDistrictId, setTouchedDistrictId] = useState(false);
  const [touchedWardId, setTouchedWardId] = useState(false);
  const [dob, setDob] = useState(null);
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState();
  const [selectedDistrict, setSelectedDistrict] = useState();
  const [selectedWard, setSelectedWard] = useState();
  const initialFormValue = {
    username: '',
    fullName: '',
    identityCard: '',
    dateOfBirth: '',
    gender: 1,
    phone: '',
    email: '',
    role: ['ROLE_SELLER'],
    provinceId: '',
    districtId: '',
    wardId: '',
    addressDetail: '',
  };

  const regexPhone = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  const FORM_VALIDATION = Yup.object().shape({
    fullName: Yup.string()
      .trim()
      .max(255, 'H??? v?? t??n nh??n vi??n kh??ng th??? d??i qu?? 255 k?? t???')
      .required('Ch??a nh???p H??? v?? t??n nh??n vi??n'),
    identityCard: Yup.string()
      .required('Ch??a nh???p S??? CCCD/CMND')
      .matches(/^(\d{9}|\d{12})$/, 'S??? CCCD/CMND c???a b???n kh??ng h???p l???'),
    phone: Yup.string()
      .required('Ch??a nh???p S??? ??i???n tho???i')
      .test('phone', 'Vui l??ng xo?? c??c kho???ng tr???ng', function (value) {
        if (value) {
          return !value.includes(' ');
        }
      })
      .matches(
        /^([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8,9})$/,
        'S??? ??i???n tho???i c???a b???n kh??ng h???p l???',
      ),
    email: Yup.string()
      .max(255, 'Email kh??ng th??? d??i qu?? 255 k?? t???')
      .email('Vui l??ng nh???p ????ng ?????nh d???ng email. VD abc@xyz.com')
      .required('Ch??a nh???p Email'),
    dateOfBirth: Yup.date()
      .typeError('Ng??y sinh kh??ng h???p l???')
      .required('Ch??a nh???p ng??y sinh')
      .nullable()
      .test('dateOfBirth', 'Nh??n vi??n ph???i ??t nh???t 18 tu???i', function (value) {
        return differenceInYears(new Date(), new Date(value)) >= 18;
      }),
    provinceId: Yup.string().required('Ch??a ch???n t???nh/th??nh ph???').nullable(),
    districtId: Yup.number().required('Ch??a ch???n qu???n/huy???n').nullable(),
    wardId: Yup.number().required('Ch??a ch???n x??/ph?????ng').nullable(),
    detailAddress: Yup.string()
      .trim()
      .max(255, '?????a ch??? chi ti???t kh??ng th??? d??i qu?? 255 k?? t???')
      .required('Ch??a nh???p ?????a ch??? chi ti???t'),
  });

  const [gender, setGender] = useState(1);

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

  const handleSubmit = async (values) => {
    const staff = {
      id: staffId,
      fullName: FormatDataUtils.removeExtraSpace(values.fullName),
      identityCard: values.identityCard,
      dateOfBirth: new Date(
        new Date(values.dateOfBirth) + new Date().getTimezoneOffset() / 60,
      ).toJSON(),
      gender: Boolean(+values.gender),
      phone: values.phone,
      email: values.email,
      addressId: values.addressId,
      provinceId: values.provinceId,
      districtId: values.districtId,
      wardId: values.wardId,
      detailAddress: FormatDataUtils.removeExtraSpace(values.detailAddress),
    };

    try {
      const actionResult = await dispatch(updateProfile(staff));
      const dataResult = unwrapResult(actionResult);
      if (dataResult) {
        let currentUser = AuthService.getCurrentUser();
        currentUser.fullName = staff.fullName;
        localStorage.setItem('user', JSON.stringify(currentUser));
        toast.success('C???p nh???t h??? s?? c?? nh??n th??nh c??ng');
        navigate('/profile');
      }
    } catch (error) {
      console.log('Failed to update profile: ', error);
    }
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

  const fetchProfile = async () => {
    try {
      const params = {};
      const actionResult = await dispatch(getProfile(staffId));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult) {
        setStaff(dataResult.data);
        setDob(dataResult.data.dateOfBirth);
        setGender(dataResult.data.gender ? 1 : 0);
        setSelectedProvince(dataResult.data.provinceId);
        setSelectedDistrict(dataResult.data.districtId);
        setSelectedWard(dataResult.data.wardId);
      }
    } catch (error) {
      console.log('Failed to fetch staff detail: ', error);
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
    fetchProfile();
  }, []);
  return (
    <Box>
      {loading ? (
        <ProgressCircleLoading />
      ) : (
        <Container maxWidth="lg">
          {!!staff && (
            <Formik
              initialValues={{ ...staff }}
              validationSchema={FORM_VALIDATION}
              onSubmit={(values) => {
                handleSubmit(values);
              }}
            >
              {({ values, errors, setFieldValue }) => (
                <Form>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Th??ng tin c?? nh??n</Typography>
                      <Stack padding={2}>
                        <Grid
                          container
                          spacing={3}
                        >
                          <Grid
                            xs={12}
                            item
                          >
                            <Typography>
                              H??? v?? t??n
                              <IconRequired />
                            </Typography>
                            <TextfieldWrapper
                              name="fullName"
                              fullWidth
                              id="fullName"
                              autoComplete="fullName"
                            />
                          </Grid>
                          <Grid
                            xs={6}
                            item
                          >
                            <Typography>
                              S??? CCCD/CMND <IconRequired />
                            </Typography>
                            <TextfieldWrapper
                              name="identityCard"
                              fullWidth
                              id="identityCard"
                              autoComplete="identityCard"
                            />
                          </Grid>
                          <Grid
                            xs={6}
                            item
                          >
                            <Typography>
                              Ng??y sinh
                              <IconRequired />
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                id="birthDate"
                                label={null}
                                value={dob}
                                inputFormat="dd/MM/yyyy"
                                maxDate={today}
                                onOpen={() => setTouchedDob(true)}
                                onChange={(dob) => {
                                  console.log(dob);
                                  setDob(dob);
                                  setFieldValue('dateOfBirth', dob);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    onFocus={() => setTouchedDob(true)}
                                    {...params}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                            {touchedDob && (
                              <FormHelperText
                                className={classes.formHelperTextStyle}
                                error={true}
                                sx={{ height: '20px' }}
                              >
                                {errors.dateOfBirth}
                              </FormHelperText>
                            )}
                          </Grid>
                          <Grid
                            xs={12}
                            item
                          >
                            <Typography>Gi???i t??nh</Typography>
                            <FormControl>
                              <RadioGroup
                                row
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={gender}
                                onChange={(e) => {
                                  setFieldValue('gender', e.target.value);
                                  setGender(e.target.value);
                                }}
                              >
                                <FormControlLabel
                                  value="1"
                                  control={<Radio />}
                                  label="Nam"
                                />
                                <FormControlLabel
                                  value="0"
                                  control={<Radio />}
                                  label="N???"
                                />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                          <Grid
                            xs={6}
                            item
                          >
                            <Typography>
                              S??? ??i???n tho???i
                              <IconRequired />
                            </Typography>
                            <TextfieldWrapper
                              name="phone"
                              fullWidth
                              id="phone"
                              autoComplete="phone"
                            />
                          </Grid>
                          <Grid
                            xs={6}
                            item
                          >
                            <Typography>
                              Email
                              <IconRequired />
                            </Typography>
                            <TextfieldWrapper
                              name="email"
                              fullWidth
                              id="email"
                              autoComplete="email"
                            />
                          </Grid>
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
                            <Typography>
                              ?????a ch??? chi ti???t
                              <IconRequired />
                            </Typography>
                            <TextfieldWrapper
                              name="detailAddress"
                              fullWidth
                              id="detailAddress"
                              autoComplete="detailAddress"
                            />
                          </Grid>
                        </Grid>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                        p={2}
                      >
                        <Button
                          variant="contained"
                          startIcon={<Save />}
                          color="success"
                          type="submit"
                          onClick={() => {
                            setTouchedDob(true);
                            setTouchedProvinceId(true);
                            setTouchedDistrictId(true);
                            setTouchedWardId(true);
                          }}
                        >
                          L??u ch???nh s???a
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<Close />}
                          color="error"
                          onClick={() => navigate('/profile')}
                        >
                          Hu???
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                  {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                </Form>
              )}
            </Formik>
          )}
        </Container>
      )}
    </Box>
  );
};

export default UpdateProfile;
