import ButtonWrapper from '@/components/Common/FormsUI/Button';
import TextfieldWrapper from '@/components/Common/FormsUI/Textfield';
import { getCategoryDetail } from '@/slices/CategorySlice';
import { Info } from '@mui/icons-material';
import { Box, Button, Card, Container, Grid, Stack, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import Select from 'react-select';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { toast } from 'react-toastify';
import { addWarehouse, getProvinceList, getDistrictList, getWardList, getWarehouseDetail } from '@/slices/WarehouseSlice';
import FormatDataUtils from '@/utils/formatData';

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
        paddingBottom: '25px'
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
        padding: '10px 0'
    },
    textfieldStyle: {
        flex: '5',
    },
    iconStyle: {
        fontSize: 'small',
        margin: '0 10px ',
    },
    styleBox: {
        display: 'flex'
    },
    infoBox: {
        textAlign: 'center'
    },
    styleInput: {
        padding: '10px 0'
    }
}));

const EditWareHouseForm = (props) => {
    const { closePopup, selectedWarehouse, } = props;
    const navigate = useNavigate();
    const pages = [10, 20, 50];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
    const classes = useStyles();
    const [provinceList, setProvinceList] = useState([]);
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => ({ ...state.warehouse }));
    const [warehouse, setWarehouse] = useState();


    const FORM_VALIDATION = Yup.object().shape({
        name: Yup.string()
            .max(200, 'Tên không thể dài quá 200 kí tự')
            .required('Chưa nhập tên '),
        address: Yup.string()
            .required('Chưa nhập địa chỉ'),
    });


    const handleOnClickExit = () => {
        closePopup(true);
    };

    const handleSubmit = async (values) => {
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
            actionResult = await dispatch(addWarehouse(newCategory));
            const dataResult = unwrapResult(actionResult);
            console.log('dataResult', dataResult);
            toast.success('Sửa kho thành công!');
            setTimeout(() => {
                window.location.reload(true);
                window.close()
            }, 5000);

        } catch (error) {
            console.log('Failed to save warehouse: ', error);
            toast.error('Sửa kho thất bại!');
        }
        closePopup();
    };

    const getDetail = async () => {
        try {
            const actionResult = await dispatch(getWarehouseDetail(selectedWarehouse));
            const dataResult = unwrapResult(actionResult);
            // if (dataResult.data) {
            setWarehouse(dataResult.data.warehouse);
            setSelectedProvince(dataResult.data.warehouse?.provinceId)
            setSelectedDistrict(dataResult.data.warehouse?.districtId)
            setSelectedWard(dataResult.data.warehouse?.wardId)
            // }
        } catch (error) {
            console.log('Failed to fetch warehouse detail: ', error);
        }
    };

    const [selectedProvince, setSelectedProvince] = useState();
    const [selectedDistrict, setSelectedDistrict] = useState();
    const [selectedWard, setSelectedWard] = useState();
    const [districtList, setDistrictList] = useState([]);
    const [wardList, setWardList] = useState([]);

    const handleChangeProvince = e => {
        setSelectedProvince(e.value);
    }

    const handleChangeDistrict = e => {
        setSelectedDistrict(e.value);
    }

    const handleChangeWard = e => {
        setSelectedWard(e.value);
    }

    const getProvince = async (keyword) => {
        try {
            const actionResult = await dispatch(getProvinceList());
            const dataResult = unwrapResult(actionResult);
            if (dataResult.data) {
                setProvinceList(dataResult.data.province);
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
                    console.log('Failed to fetch setProvince list: ', error);
                }
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
        name: warehouse?.name,
        addressDetail: warehouse?.addressDetail,
        province: warehouse?.provinceId,
        district: warehouse?.districtId,
        ward: warehouse?.wardId
    }

    useEffect(() => {
        getProvince()
        if (selectedProvince) {
            getDistrict()
        }
        if (selectedDistrict) {
            getWard()
        }
    }, [selectedProvince, selectedDistrict,])

    useEffect(() => {
        getDetail()
    }, [])

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
                    initialValues={
                        { ...initialFormValue }
                    }
                    // validationSchema={FORM_VALIDATION}
                    onSubmit={(values) => handleSubmit(values)}
                >

                    <Form>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="stretch"
                        >
                            <Box >
                                <Box sx={{ borderBottom: '1px solid #A7A7A7' }} className={classes.infoContainer}>
                                    <Typography className={classes.wrapIcon}>
                                        Tên nhà kho
                                    </Typography>
                                    <TextfieldWrapper
                                        className={classes.styleInput}
                                        name="name"
                                        fullWidth
                                        id="name"
                                        autoComplete="name"
                                    />
                                </Box>


                                <Typography className={classes.infoAddress}>
                                    Địa chỉ :
                                </Typography>

                                <Grid>
                                    <Box className={classes.styleBox}>
                                        <Box className={classes.infoAddress}>
                                            <Typography className={classes.wrapIcon}>
                                                Tỉnh/Thành phố
                                            </Typography>
                                            <Select
                                                // classNamePrefix="select"
                                                className={classes.selectBox}
                                                options={FormatDataUtils.getOptionWithIdandName(provinceList)}
                                                noOptionsMessage={() => <>Không có tìm thấy tỉnh thành phù hợp</>}
                                                isClearable={true}
                                                isSearchable={true}
                                                isLoading={loading}
                                                name="province"
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                value={FormatDataUtils.getOptionWithIdandName(provinceList)?.filter(function (option) {
                                                    return option.value === selectedProvince;
                                                })}
                                                onChange={(e) => { handleChangeProvince(e) }}

                                            />
                                        </Box>
                                        <Box className={classes.infoAddress}>
                                            <Typography className={classes.wrapIcon}>
                                                Quận/huyện
                                            </Typography>
                                            <Select
                                                // classNamePrefix="select"
                                                className={classes.selectBox}
                                                noOptionsMessage={() => <>Không có tìm thấy quận huyện phù hợp</>}
                                                isClearable={true}
                                                options={FormatDataUtils.getOptionWithIdandName(districtList)}
                                                isSearchable={true}
                                                isLoading={loading}
                                                loadingMessage={() => <>Đang tìm kiếm địa chỉ...</>}
                                                name="district"
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                value={FormatDataUtils.getOptionWithIdandName(districtList)?.filter(function (option) {
                                                    return option.value === selectedDistrict;
                                                })}
                                                onChange={(e) => { handleChangeDistrict(e) }}
                                            />
                                        </Box>
                                        <Box className={classes.infoAddress}>
                                            <Typography className={classes.wrapIcon}>
                                                Phường/xã
                                            </Typography>
                                            <Select
                                                className={classes.selectBox}
                                                noOptionsMessage={() => <>Không có tìm thấy địa chỉ nào</>}
                                                isClearable={true}
                                                options={FormatDataUtils.getOptionWithIdandName(wardList)}
                                                isSearchable={true}
                                                isLoading={loading}
                                                loadingMessage={() => <>Đang tìm kiếm địa chỉ...</>}
                                                name="ward"
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                value={FormatDataUtils.getOptionWithIdandName(wardList)?.filter(function (option) {
                                                    return option.value === selectedWard;
                                                })}
                                                onChange={(e) => { handleChangeWard(e) }}
                                            />
                                        </Box>

                                    </Box>
                                </Grid>

                                <Box className={classes.infoContainer}>
                                    <Typography className={classes.wrapIcon}>
                                        Địa chỉ chi tiết
                                    </Typography>
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
                            <ButtonWrapper color='success' variant="contained" startIcon={<CheckIcon />}>Lưu chỉnh sửa</ButtonWrapper>
                            <Button
                                color='error'
                                onClick={() => handleOnClickExit()}
                                variant="contained"
                                startIcon={<ClearIcon />}
                            >
                                Hủy chỉnh sửa
                            </Button>
                        </Stack>
                    </Form>
                </Formik>
            </Grid>
        </Container>
    );
};

export default EditWareHouseForm;
