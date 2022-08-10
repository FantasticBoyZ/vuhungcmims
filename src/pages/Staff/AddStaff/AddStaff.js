import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import IconRequired from '@/components/Common/IconRequired';
import WarehouseList from '@/pages/Warehouse/wareHouseList';
import { getProvinceList, getDistrictList, getWardList } from '@/slices/addressSlice';
import { signUpStaff, uploadImageNewStaff } from '@/slices/StaffSlice';
import FormatDataUtils from '@/utils/formatData';
import { Close, CloudUpload, Done } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
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
import LoadingButton from '@mui/lab/LoadingButton';
import { differenceInYears } from 'date-fns';

const useStyles = makeStyles((theme) => ({
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
  imgPreview: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    // top: '0',
    // left: '0',
    objectFit: 'cover',
  },
  formHelperTextStyle: {
    margin: '3px 14px 0 !important',
  },
}));

function Dropzone(props) {
  const { imageUrl, setImageUrl, setFormData, setErrorImage } = props;
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    // console.log(fileRejections[0]);
    setErrorImage('');
    if (!!fileRejections[0]) {
      //   console.log(fileRejections[0].errors);
      if (fileRejections[0].errors[0].code === 'file-invalid-type') {
        console.log('Bạn vui lòng chọn file đuôi .jpg, .png để tải lên');
        setErrorImage('Bạn vui lòng chọn file đuôi .jpg, .png để tải lên');
        return;
      }
      if (fileRejections[0].errors[0].code === 'file-too-large') {
        console.log('Bạn vui lòng chọn file ảnh dưới 5MB để tải lên');
        setErrorImage('Bạn vui lòng chọn file ảnh dưới 5MB để tải lên');
        return;
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
    multiple: false,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
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

const roleList = [
  {
    id: 1,
    role: 'ROLE_SELLER',
    name: 'Nhân viên bán hàng',
  },
  {
    id: 2,
    role: 'ROLE_STOREKEEPER',
    name: 'Thủ kho',
  },
];

const AddStaff = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const today = new Date();
  const { loadingAddress } = useSelector((state) => ({ ...state.address }));
  const { loading } = useSelector((state) => ({ ...state.staff }));
  const [imageUrl, setImageUrl] = useState();
  const [formData, setFormData] = useState(new FormData());
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
  const [errorImage, setErrorImage] = useState('');
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
    username: Yup.string()
      .required('Chưa nhập mã nhân viên')
      .test('username', 'Vui lòng xoá các khoảng trắng', function (value) {
        if (value) {
          return !value.includes(' ');
        }
      }),
    fullName: Yup.string().trim().required('Chưa nhập Họ và tên nhân viên'),
    identityCard: Yup.string()
      .required('Chưa nhập Số CCCD/CMND')
      .matches(/^(\d{9}|\d{12})$/, 'Số CCCD/CMND của bạn không hợp lệ'),
    phone: Yup.string()
      .required('Chưa nhập Số điện thoại')
      .test('phone', 'Vui lòng xoá các khoảng trắng', function (value) {
        if (value) {
          return !value.includes(' ');
        }
      })
      .matches(
        /^([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8,9})$/,
        'Số điện thoại của bạn không hợp lệ',
      ),
    email: Yup.string()
      .email('Vui lòng nhập đúng định dạng email. VD abc@xyz.com')
      .required('Chưa nhập Email'),
    dateOfBirth: Yup.string()
      .required('Chưa nhập ngày sinh')
      .nullable()
      .test('dateOfBirth', 'Nhân viên phải ít nhất 18 tuổi', function (value) {
        return differenceInYears(new Date(), new Date(value)) >= 18;
      }),
    provinceId: Yup.string().required('Chưa chọn tỉnh/thành phố').nullable(),
    districtId: Yup.number().required('Chưa chọn quận/huyện').nullable(),
    wardId: Yup.number().required('Chưa chọn xã/phường').nullable(),
    addressDetail: Yup.string().trim().required('Chưa nhập Địa chỉ chi tiết'),
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
    console.log(values);
    const staff = {
      username: values.username,
      fullName: FormatDataUtils.removeExtraSpace(values.fullName),
      identityCard: values.identityCard,
      dateOfBirth: new Date(
        new Date(values.dateOfBirth) + new Date().getTimezoneOffset() / 60,
      ).toJSON(),
      gender: Boolean(+values.gender),
      phone: values.phone,
      email: values.email,
      role: values.role,
      provinceId: values.provinceId,
      districtId: values.districtId,
      wardId: values.wardId,
      addressDetail: FormatDataUtils.removeExtraSpace(values.addressDetail),
    };
    try {
      const response = await dispatch(signUpStaff(staff));
      const resultResponse = unwrapResult(response);
      console.log(resultResponse);
      if (resultResponse) {
        if (resultResponse.data.message) {
          if (formData.has('file')) {
            const uploadNewImage = await dispatch(uploadImageNewStaff(formData)).then(
              (res) => {
                console.log(res.message);
                toast.success('Thêm sản phẩm thành công!');
                navigate('/staff/list');
              },
              (err) => {
                console.log(err);
              },
            );
            // toast.success(resultResponse.data.message);
          } else {
            navigate('/staff/list');
            toast.success('Thêm sản phẩm thành công!');
          }
          // console.log(resultResponse);
          // navigate(`/staff/list`);
        } else {
          toast.success('Đăng ký nhân viên thành công');
        }
      }
    } catch (error) {
      console.log('Failed to sign up staff: ', error);
      toast.error(error.message);
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

  useEffect(() => {
    getProvince();
    if (selectedProvince) {
      getDistrict();
    }
    if (selectedDistrict) {
      getWard();
    }
  }, [selectedProvince, selectedDistrict]);
  return (
    <Formik
      initialValues={{ ...initialFormValue }}
      validationSchema={FORM_VALIDATION}
      onSubmit={(values) => {
        handleSubmit(values);
      }}
    >
      {({ values, errors, setFieldValue }) => (
        <Form>
          <Grid
            container
            spacing={2}
          >
            <Grid
              xs={2.5}
              item
            >
              <Stack spacing={2}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Ảnh đại diện</Typography>
                    <Stack
                      direction="row"
                      padding={1}
                      justifyContent="center"
                    >
                      <Dropzone
                        // {...userProfile}
                        imageUrl={imageUrl}
                        setImageUrl={setImageUrl}
                        setFormData={setFormData}
                        setErrorImage={setErrorImage}
                      />
                    </Stack>
                    <FormHelperText
                      className={classes.formHelperTextStyle}
                      error={true}
                      sx={{ height: '20px' }}
                    >
                      {errorImage}
                    </FormHelperText>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      Chức vụ
                      <IconRequired />
                    </Typography>
                    <Select
                      classNamePrefix="select"
                      defaultValue={roleList[0]}
                      options={roleList}
                      getOptionValue={(option) => option}
                      getOptionLabel={(option) => option.name}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        control: (base) => ({
                          ...base,
                          height: 56,
                          minHeight: 56,
                        }),
                      }}
                      onChange={(e) => {
                        setFieldValue('role[0]', e.role);
                      }}
                    />
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
            <Grid
              xs={9.5}
              item
            >
              <Card>
                <CardContent>
                  <Typography variant="h6">Thông tin cá nhân</Typography>
                  <Stack padding={2}>
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid
                        xs={6}
                        item
                      >
                        <Typography>
                          Mã nhân viên
                          <IconRequired />
                        </Typography>
                        <TextfieldWrapper
                          name="username"
                          fullWidth
                          id="username"
                          autoComplete="username"
                          autoFocus
                        />
                      </Grid>
                      <Grid
                        xs={6}
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
                          isLoading={loadingAddress && !selectedProvince}
                          name="provinceId"
                          value={FormatDataUtils.getSelectedOption(
                            provinceList,
                            selectedProvince,
                          )}
                          options={FormatDataUtils.getOptionWithIdandName(provinceList)}
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
                          isLoading={loadingAddress && !selectedDistrict}
                          value={FormatDataUtils.getSelectedOption(
                            districtList,
                            selectedDistrict,
                          )}
                          options={FormatDataUtils.getOptionWithIdandName(districtList)}
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
                          Phường/Xã <IconRequired />
                        </Typography>
                        {/* {!!wardList && ( */}
                        <Select
                          classNamePrefix="select"
                          placeholder="Chọn xã/phường"
                          noOptionsMessage={() => <>Không tìm thấy Xã/Phường phù hợp</>}
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
                          Địa chỉ chi tiết
                          <IconRequired />
                        </Typography>
                        <TextfieldWrapper
                          name="addressDetail"
                          fullWidth
                          id="addressDetail"
                          autoComplete="addressDetail"
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
                    <LoadingButton
                      variant="contained"
                      startIcon={<Done />}
                      color="success"
                      loading={loading}
                      loadingPosition="start"
                      type="submit"
                      onClick={() => {
                        setTouchedDob(true);
                        setTouchedProvinceId(true);
                        setTouchedDistrictId(true);
                        setTouchedWardId(true);
                      }}
                    >
                      Thêm nhân viên
                    </LoadingButton>
                    <Button
                      variant="contained"
                      startIcon={<Close />}
                      color="error"
                      disabled={loading}
                      onClick={() => navigate('/staff/list')}
                    >
                      Huỷ
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default AddStaff;
