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
        console.log('B???n vui l??ng ch???n file ??u??i .jpg, .png ????? t???i l??n');
        setErrorImage('B???n vui l??ng ch???n file ??u??i .jpg, .png ????? t???i l??n');
        return;
      }
      if (fileRejections[0].errors[0].code === 'file-too-large') {
        console.log('B???n vui l??ng ch???n file ???nh d?????i 5MB ????? t???i l??n');
        setErrorImage('B???n vui l??ng ch???n file ???nh d?????i 5MB ????? t???i l??n');
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

      {isDragActive ? <span>Th??? ???nh v??o ????y</span> : <span>T???i ???nh l??n</span>}
    </div>
  );
}

const roleList = [
  {
    id: 1,
    role: 'ROLE_SELLER',
    name: 'Nh??n vi??n b??n h??ng',
  },
  {
    id: 2,
    role: 'ROLE_STOREKEEPER',
    name: 'Th??? kho',
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
      .max(255, 'M?? nh??n vi??n kh??ng th??? d??i qu?? 255 k?? t???')
      .required('Ch??a nh???p m?? nh??n vi??n')
      .test('username', 'Vui l??ng xo?? c??c kho???ng tr???ng', function (value) {
        if (value) {
          return !value.includes(' ');
        }
      }),
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
    addressDetail: Yup.string()
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
                toast.success('Th??m s???n ph???m th??nh c??ng!');
                navigate('/staff/list');
              },
              (err) => {
                console.log(err);
              },
            );
            // toast.success(resultResponse.data.message);
          } else {
            navigate('/staff/list');
            toast.success('Th??m s???n ph???m th??nh c??ng!');
          }
          // console.log(resultResponse);
          // navigate(`/staff/list`);
        } else {
          toast.success('????ng k?? nh??n vi??n th??nh c??ng');
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
                    <Typography variant="h6">???nh ?????i di???n</Typography>
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
                      Ch???c v???
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
                  <Typography variant="h6">Th??ng tin c?? nh??n</Typography>
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
                          M?? nh??n vi??n
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
                          Ph?????ng/X?? <IconRequired />
                        </Typography>
                        {/* {!!wardList && ( */}
                        <Select
                          classNamePrefix="select"
                          placeholder="Ch???n x??/ph?????ng"
                          noOptionsMessage={() => <>Kh??ng t??m th???y X??/Ph?????ng ph?? h???p</>}
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
                      Th??m nh??n vi??n
                    </LoadingButton>
                    <Button
                      variant="contained"
                      startIcon={<Close />}
                      color="error"
                      disabled={loading}
                      onClick={() => navigate('/staff/list')}
                    >
                      Hu???
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
