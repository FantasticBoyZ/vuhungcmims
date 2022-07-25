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
  const [manufacturer, setManufacturer] = useState();
  const classes = useStyles();
  const isAdd = !manufacturerId;
  const [openPopup, setopenPopup] = useState(false);


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
    :
    {
      name: manufacturer?.name,
      email: manufacturer?.email,
      phone: manufacturer?.phone,
      provinceId: manufacturer?.provinceId,
      districtId: manufacturer?.districtId,
      wardId: manufacturer?.wardId,
      addressDetail: manufacturer?.addressDetail,
    }


  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string()
      .max(200, 'Tên nhà sản xuất không thể dài quá 200 kí tự')
      .required('Chưa nhập tên nhà sản xuất'),
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Chưa nhập email nhà sản xuất'),

    phone: Yup.number().required('Chưa nhập số điện thoại nhà sản xuất'),
    provinceId: Yup.string().required('Chưa chọn tỉnh/thành phố'),
    districtId: Yup.number().required('Chưa chọn quận/huyện/thành phố'),
    wardId: Yup.number().required('Chưa chọn phường/xã'),
    // .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
  });

  const saveManufacturerDetail = async (manufacturer) => {
    try {
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
    setopenPopup(true)
    setManufacturer(values)
  };

  const handleConfirm = () => {
    saveManufacturerDetail(manufacturer);
    setopenPopup(false)
  }

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
          setSelectedProvince(dataResult.data.manufactor.provinceId)
          setSelectedDistrict(dataResult.data.manufactor.districtId)
          setSelectedWard(dataResult.data.manufactor.wardId)
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
  }, [manufacturerId]);

  useEffect(() => {
    if (selectedProvince) {
      setSelectedDistrict('');
      setSelectedWard('')
    }
  }, [selectedProvince])

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
                <ProgressCircleLoading />
              ) : (
                <Box>
                  <Card className={classes.cardInfo}>
                    <CardHeader title="Thông tin nhà sản xuất" />

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
                            Tên nhà sản xuất <IconRequired />
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
                            Số điện thoại <IconRequired />
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
                          <Divider textAlign="left" style={{ fontSize: '18px' }}>Địa chỉ</Divider>
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
                          <Typography className={classes.wrapIcon}>
                            Tỉnh/Thành phố <IconRequired />
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
                            value={FormatDataUtils.getOptionWithIdandName(GetProvince())?.filter(function (option) {
                              return option.value === selectedProvince;
                            })}
                            options={FormatDataUtils.getOptionWithIdandName(GetProvince())}
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
                              setFieldValue('provinceId', e?.value, setSelectedProvince(e?.value));
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
                            Quận/Huyện/Thành phố <IconRequired />
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
                            value={FormatDataUtils.getOptionWithIdandName(GetDistrict(selectedProvince))?.filter(function (option) {
                              return option.value === selectedDistrict;
                            })}
                            options={FormatDataUtils.getOptionWithIdandName(GetDistrict(selectedProvince))}
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
                              setFieldValue('districtId', e?.value, setSelectedDistrict(e?.value));
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
                            Phường/Xã: <IconRequired />
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
                            value={FormatDataUtils.getOptionWithIdandName(GetWard(selectedDistrict))?.filter(function (option) {
                              return option.value === selectedWard;
                            })}
                            options={FormatDataUtils.getOptionWithIdandName(GetWard(selectedDistrict))}
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
                              setFieldValue('wardId', e?.value, setSelectedWard(e?.value));
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
                          <Typography className={classes.wrapIcon}>Địa chỉ chi tiết <IconRequired /></Typography>
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
                      <ButtonWrapper
                        color="warning"
                        variant="contained"
                        startIcon={<CheckIcon />}
                      >
                        Lưu chỉnh sửa
                      </ButtonWrapper>
                      <Button
                        color="error"
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
                      padding={2}
                    >
                      <Grid
                        xs={12}
                        item
                      >
                        <Typography className={classes.wrapIcon}>
                          Tên nhà sản xuất <IconRequired />
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
                          Số điện thoại <IconRequired />
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
                        <Divider textAlign="left" style={{ fontSize: '18px' }}>Địa chỉ</Divider>
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
                        <Typography className={classes.wrapIcon}>
                          Tỉnh/Thành phố <IconRequired />
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
                          options={FormatDataUtils.getOptionWithIdandName(GetProvince())}
                          value={GetProvince()?.find(
                            (obj) => obj.value === selectedProvince,
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
                            setFieldValue('provinceId', e?.value, setSelectedProvince(e?.value));
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
                          Quận/Huyện/Thành phố <IconRequired />
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
                          options={FormatDataUtils.getOptionWithIdandName(GetDistrict(selectedProvince))}
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
                            setFieldValue('districtId', e?.value, setSelectedDistrict(e?.value));
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
                          Phường/Xã <IconRequired />
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
                          options={FormatDataUtils.getOptionWithIdandName(GetWard(selectedDistrict))}
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
                            setFieldValue('wardId', e?.value, setSelectedWard(e?.value));
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
                        <Typography className={classes.wrapIcon}>Địa chỉ chi tiết <IconRequired /></Typography>
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
                    <ButtonWrapper
                      color="success"
                      variant="contained"
                      startIcon={<CheckIcon />}
                    >
                      Thêm nhà sản xuất
                    </ButtonWrapper>
                    <Button
                      color="error"
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
      <Popup
        title={isAdd ? 'Bạn có chắc chắn muốn thêm nhà xuất không?' : "Bạn có chắc chắn muốn lưu lại chỉnh sửa không?"}
        openPopup={openPopup}
        setOpenPopup={setopenPopup}
      >
        <Typography >
          Hãy kiểm tra kỹ thông tin trước khi xác nhận.
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
            Xác nhận</Button>
          <Button
            variant="outlined"
            onClick={() => setopenPopup(false)}
          >
            Hủy
          </Button>
        </Stack>
      </Popup>
    </Container>

  );
};

export default AddEditManufacturerForm;
