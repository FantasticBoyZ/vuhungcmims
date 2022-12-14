import ButtonWrapper from '@/components/Common/FormsUI/Button';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import {
  Box,
  Button,
  Card,
  Container,
  FormHelperText,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import Select from 'react-select';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { toast } from 'react-toastify';
import {
  addWarehouse,
  getProvinceList,
  getDistrictList,
  getWardList,
  getWarehouseDetail,
  updateWarehouse,
} from '@/slices/WarehouseSlice';
import FormatDataUtils from '@/utils/formatData';
import LoadingButton from '@mui/lab/LoadingButton';

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
    paddingBottom: '25px',
  },
  infoAddress: {
    display: 'block',
    verticalAlign: 'center',
    justifyContent: 'center',
    padding: '18px 12px 0',
  },
  wrapIcon: {
    verticalAlign: 'middle',
    display: 'inline-flex',
    width: '200px',
    paddingBottom: '10px',
    padding: '10px 0',
  },
  textfieldStyle: {
    flex: '5',
  },
  iconStyle: {
    fontSize: 'small',
    margin: '0 10px ',
  },
  styleBox: {
    display: 'flex',
  },
  infoBox: {
    textAlign: 'center',
  },
  styleInput: {
    padding: '10px 0',
  },
}));

const EditWareHouseForm = (props) => {
  const { selectedWarehouse, closePopup } = props;
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const classes = useStyles();
  const [provinceList, setProvinceList] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => ({ ...state.warehouse }));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warehouse, setWarehouse] = useState();
  const [selectedProvince, setSelectedProvince] = useState();
  const [selectedDistrict, setSelectedDistrict] = useState();
  const [selectedWard, setSelectedWard] = useState();
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);

  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string()
      .max(255, 'T??n kho kh??ng th??? d??i qu?? 255 k?? t???')
      .required('Ch??a nh???p t??n kho'),
    addressDetail: Yup.string()
      .max(255, '?????a ch??? chi ti???t kh??ng th??? d??i qu?? 255 k?? t???')
      .required('Ch??a nh???p ?????a ch???'),
    provinceId: Yup.string().required('Ch??a ch???n t???nh/th??nh ph???'),
    districtId: Yup.number().required('Ch??a ch???n qu???n/huy???n'),
    wardId: Yup.number().required('Ch??a ch???n x??/ph?????ng'),
  });

  const handleOnClickExit = () => {
    closePopup();
  };

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

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    const newCategory = {
      id: warehouse?.id,
      name: values.name,
      provinceId: selectedProvince,
      districtId: selectedDistrict,
      wardId: selectedWard,
      addressDetail: values.addressDetail,
    };
    console.log(newCategory);
    try {
      let actionResult;
      actionResult = await dispatch(updateWarehouse(newCategory));
      const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.status === 200) {
        setIsSubmitting(false);
        toast.success('S???a kho th??nh c??ng!', { autoClose: 2000 });
        window.location.reload(true);
        window.close();
      }
      // toast.success('S???a kho th??nh c??ng!', { autoClose: 2000 });
      // setTimeout(() => {
      //     window.location.reload(true);
      //     window.close()
      // }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      console.log('Failed to save warehouse: ', error);
      toast.error('S???a kho th???t b???i!');
    }
    closePopup();
  };

  const getDetail = async () => {
    try {
      const actionResult = await dispatch(getWarehouseDetail(selectedWarehouse));
      const dataResult = unwrapResult(actionResult);
      // if (dataResult.data) {
      setWarehouse(dataResult.data.warehouse);
      setSelectedProvince(dataResult.data.warehouse?.provinceId);
      setSelectedDistrict(dataResult.data.warehouse?.districtId);
      setSelectedWard(dataResult.data.warehouse?.wardId);
      // }
    } catch (error) {
      console.log('Failed to fetch warehouse detail: ', error);
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

  const initialFormValue = {
    name: warehouse?.name || '',
    addressDetail: warehouse?.addressDetail || '',
    provinceId: warehouse?.provinceId || '',
    districtId: warehouse?.districtId || '',
    wardId: warehouse?.wardId || '',
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
    getDetail();
  }, []);

  return (
    <Container maxWidth="lg">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
      >
        <Formik
          enableReinitialize={true}
          initialValues={{ ...initialFormValue }}
          validationSchema={FORM_VALIDATION}
          onSubmit={(values) => handleSubmit(values)}
        >
          {({ values, errors, setFieldValue }) => (
            <Form>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
              >
                <Box>
                  <Box
                    sx={{ borderBottom: '1px solid #A7A7A7' }}
                    className={classes.infoContainer}
                  >
                    <Typography className={classes.wrapIcon}>T??n nh?? kho</Typography>
                    <TextfieldWrapper
                      className={classes.styleInput}
                      name="name"
                      fullWidth
                      id="name"
                      autoComplete="name"
                    />
                  </Box>

                  <Typography className={classes.infoAddress}>?????a ch??? :</Typography>

                  <Grid>
                    <Box className={classes.styleBox}>
                      <Box className={classes.infoAddress}>
                        <Typography className={classes.wrapIcon}>
                          T???nh/Th??nh ph???
                        </Typography>
                        <Select
                          // classNamePrefix="select"
                          className={classes.selectBox}
                          options={FormatDataUtils.getOptionWithIdandName(provinceList)}
                          noOptionsMessage={() => (
                            <>Kh??ng c?? t??m th???y t???nh th??nh ph?? h???p</>
                          )}
                          isClearable={true}
                          isSearchable={true}
                          isLoading={loading}
                          name="provinceId"
                          menuPortalTarget={document.body}
                          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                          value={FormatDataUtils.getOptionWithIdandName(
                            provinceList,
                          )?.filter(function (option) {
                            return option.value === selectedProvince;
                          })}
                          onChange={(e) => {
                            setFieldValue(
                              'provinceId',
                              e?.value,
                              setSelectedProvince(e?.value),
                            );
                            setFieldValue('districtId', '', false);
                            setFieldValue('wardId', '', false);
                            onChangeProvince(e);
                          }}
                        />
                        {!selectedProvince ? (
                          <FormHelperText
                            error={true}
                            sx={{ height: '20px' }}
                          >
                            {errors.provinceId}
                          </FormHelperText>
                        ) : (
                          ''
                        )}
                      </Box>
                      <Box className={classes.infoAddress}>
                        <Typography className={classes.wrapIcon}>Qu???n/huy???n</Typography>
                        <Select
                          // classNamePrefix="select"
                          className={classes.selectBox}
                          noOptionsMessage={() => (
                            <>Kh??ng c?? t??m th???y qu???n huy???n ph?? h???p</>
                          )}
                          isClearable={true}
                          options={FormatDataUtils.getOptionWithIdandName(districtList)}
                          isSearchable={true}
                          isLoading={loading}
                          loadingMessage={() => <>??ang t??m ki???m ?????a ch???...</>}
                          name="districtId"
                          menuPortalTarget={document.body}
                          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                          value={FormatDataUtils.getOptionWithIdandName(
                            districtList,
                          )?.filter(function (option) {
                            return option.value === selectedDistrict;
                          })}
                          onChange={(e) => {
                            setFieldValue('districtId', e?.value);
                            setFieldValue('wardId', '', false);
                            onChangeDistrict(e);
                          }}
                        />
                        {!selectedDistrict ? (
                          <FormHelperText
                            error={true}
                            sx={{ height: '20px' }}
                          >
                            {errors.districtId}
                          </FormHelperText>
                        ) : (
                          ''
                        )}
                      </Box>
                      <Box className={classes.infoAddress}>
                        <Typography className={classes.wrapIcon}>Ph?????ng/x??</Typography>
                        <Select
                          className={classes.selectBox}
                          noOptionsMessage={() => <>Kh??ng c?? t??m th???y ?????a ch??? n??o</>}
                          isClearable={true}
                          options={FormatDataUtils.getOptionWithIdandName(wardList)}
                          isSearchable={true}
                          isLoading={loading}
                          loadingMessage={() => <>??ang t??m ki???m ?????a ch???...</>}
                          name="wardId"
                          menuPortalTarget={document.body}
                          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                          value={FormatDataUtils.getOptionWithIdandName(wardList)?.filter(
                            function (option) {
                              return option.value === selectedWard;
                            },
                          )}
                          onChange={(e) => {
                            setFieldValue('wardId', e?.value, setSelectedWard(e?.value));
                          }}
                        />
                        {!selectedWard ? (
                          <FormHelperText
                            error={true}
                            sx={{ height: '20px' }}
                          >
                            {errors.wardId}
                          </FormHelperText>
                        ) : (
                          ''
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  <Box className={classes.infoContainer}>
                    <Typography className={classes.wrapIcon}>?????a ch??? chi ti???t</Typography>
                    <TextfieldWrapper
                      className={classes.styleInput}
                      name="addressDetail"
                      fullWidth
                      id="address"
                      autoComplete="address"
                    />
                  </Box>
                </Box>
              </Grid>

              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                padding="20px"
              >
                <LoadingButton
                  color="success"
                  type="submit"
                  loading={isSubmitting}
                  loadingPosition="start"
                  variant="contained"
                  startIcon={<CheckIcon />}
                >
                  L??u ch???nh s???a
                </LoadingButton>
                <Button
                  color="error"
                  onClick={() => handleOnClickExit()}
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={<ClearIcon />}
                >
                  H???y ch???nh s???a
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Grid>
    </Container>
  );
};

export default EditWareHouseForm;
