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

  const FORM_VALIDATION = Yup.object().shape({
    fullName: Yup.string().required('Chưa nhập Họ và tên nhân viên'),
    identityCard: Yup.string().required('Chưa nhập Số CCCD/CMND'),
    phone: Yup.string().required('Chưa nhập Số điện thoại'),
    email: Yup.string()
      .email('Vui lòng nhập đúng định dạng email. VD abc@xyz.com')
      .required('Chưa nhập Email'),
    dateOfBirth: Yup.string().required('Chưa nhập ngày sinh').nullable(),
    provinceId: Yup.string().required('Chưa chọn tỉnh/thành phố').nullable(),
    districtId: Yup.number().required('Chưa chọn quận/huyện').nullable(),
    wardId: Yup.number().required('Chưa chọn xã/phường').nullable(),
    detailAddress: Yup.string().required('Chưa nhập Địa chỉ chi tiết'),
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
      fullName: values.fullName,
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
      detailAddress: values.detailAddress,
    };

    try {
        const actionResult = await dispatch(updateProfile(staff));
        const dataResult = unwrapResult(actionResult);
        if (dataResult) {
            toast.success('Cập nhật hồ sơ cá nhân thành công')
            navigate('/profile')
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
        setStaff(dataResult);
        setDob(dataResult.dateOfBirth);
        setGender(dataResult.gender);
        setSelectedProvince(dataResult.provinceId);
        setSelectedDistrict(dataResult.districtId);
        setSelectedWard(dataResult.wardId);
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
          {staff && (
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
                      <Typography variant="h6">Thông tin cá nhân</Typography>
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
                              Họ và tên
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
                              Số CCCD/CMND <IconRequired />
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
                              Ngày sinh
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
                            <Typography>Giới tính</Typography>
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
                                  label="Nữ"
                                />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                          <Grid
                            xs={6}
                            item
                          >
                            <Typography>
                              Số điện thoại
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
                              Tỉnh/Thành phố
                              <IconRequired />
                            </Typography>
                            {/* {!!provinceList && ( */}
                            <Select
                              classNamePrefix="select"
                              placeholder="Chọn tỉnh/thành phố"
                              noOptionsMessage={() => (
                                <>Không tìm thấy Tỉnh/Thành phố phù hợp</>
                              )}
                              isClearable={true}
                              isSearchable={true}
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
                              Quận/Huyện/Thành phố
                              <IconRequired />
                            </Typography>
                            {/* {!!districtList && ( */}
                            <Select
                              classNamePrefix="select"
                              placeholder="Chọn quận/huyện/thành phố"
                              noOptionsMessage={() => (
                                <>Không tìm thấy Quận/Huyện/Thành phố phù hợp</>
                              )}
                              isClearable={true}
                              isSearchable={true}
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
                              Phường/Xã <IconRequired />
                            </Typography>
                            {/* {!!wardList && ( */}
                            <Select
                              classNamePrefix="select"
                              placeholder="Chọn xã/phường"
                              noOptionsMessage={() => (
                                <>Không tìm thấy Xã/Phường phù hợp</>
                              )}
                              isClearable={true}
                              isSearchable={true}
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
                              Địa chỉ chi tiết
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
                          Lưu chỉnh sửa
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<Close />}
                          color="error"
                          onClick={() => navigate('/staff/list')}
                        >
                          Huỷ
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                  <pre>{JSON.stringify(errors, null, 2)}</pre>
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
