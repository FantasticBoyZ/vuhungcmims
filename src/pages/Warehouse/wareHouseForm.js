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
import IconRequired from '@/components/Common/IconRequired';


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
        padding: '12px 12px 25px 12px',
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

const WareHouseForm = (props) => {
    const { closePopup, warehouse } = props;

    const { warehouseId } = useParams();
    const navigate = useNavigate();
    const [warehouseList, setWarehouseList] = useState();
    const pages = [10, 20, 50];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
    const classes = useStyles();
    const [provinceList, setProvinceList] = useState([]);
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => ({ ...state.warehouse }));
    const initialFormValue = {
        name: "",
        addressDetail: "",
        province: "",
        district: "",
        ward: ""
    };

    const FORM_VALIDATION = Yup.object().shape({
        name: Yup.string()
            .max(200, 'Tên danh mục không thể dài quá 200 kí tự')
            .required('Chưa nhập tên danh mục'),
        address: Yup.string()
            .required('Chưa nhập địa chỉ'),

    });


    const handleOnClickExit = () => {
        navigate(`/warehouse`);
    };

    const handleSubmit = (values) => {
        const newCategory = {
            name: values.name,
            provinceId: selectedProvince,
            districtId: selectedDistrict,
            wardId: selectedWard,
            addressDetail: values.address,
        };
        console.log(newCategory);
        saveWarehouse(newCategory);
        closePopup();
    };

    const saveWarehouse = async (warehouse) => {
        try {
            let actionResult;
            actionResult = await dispatch(addWarehouse(warehouse));
            const dataResult = unwrapResult(actionResult);
            console.log('dataResult', dataResult);
            toast.success('Thêm kho thành công!');

        } catch (error) {
            console.log('Failed to save warehouse: ', error);
            toast.error('Thêm kho thất bại!');
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

    useEffect(() => {
        getProvince()
        if (selectedProvince) {
            getDistrict()
        }
        if (selectedDistrict) {
            getWard()
        }
    }, [selectedProvince, selectedDistrict])
    return (
        <Container maxWidth="lg">
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
            >

                <Formik
                    initialValues={{
                        ...initialFormValue,
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
                            <Box >
                                <Box sx={{ borderBottom: '1px solid #A7A7A7' }} className={classes.infoContainer}>
                                    <Typography className={classes.wrapIcon}>
                                        Tên nhà kho: <IconRequired />
                                    </Typography>
                                    <TextfieldWrapper
                                        className={classes.styleInput}
                                        name="name"
                                        fullWidth
                                        id="name"
                                        autoComplete="name"
                                    // autoFocus
                                    />
                                </Box>
                                <Typography className={classes.infoAddress}>
                                    Địa chỉ :
                                </Typography>

                                <Grid>
                                    <Box className={classes.styleBox}>
                                        <Box className={classes.infoAddress}>
                                            <Typography className={classes.wrapIcon}>
                                                Tỉnh/Thành phố <IconRequired />
                                            </Typography>
                                            <Select
                                                // classNamePrefix="select"
                                                className={classes.selectBox}
                                                options={FormatDataUtils.getOptionWithIdandName(
                                                    provinceList,
                                                )}
                                                noOptionsMessage={() => <>Không có tìm thấy tỉnh thành phù hợp</>}
                                                isClearable={true}
                                                isSearchable={true}
                                                isLoading={loading}
                                                name="province"
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                value={provinceList.find(obj => obj.value === selectedProvince)} // set selected value
                                                onChange={(e) => { handleChangeProvince(e) }}
                                            />
                                        </Box>
                                        <Box className={classes.infoAddress}>
                                            <Typography className={classes.wrapIcon}>
                                                Quận/huyện <IconRequired />
                                            </Typography>
                                            <Select
                                                // classNamePrefix="select"
                                                className={classes.selectBox}
                                                noOptionsMessage={() => <>Không có tìm thấy quận huyện phù hợp</>}
                                                isClearable={true}
                                                options={FormatDataUtils.getOptionWithIdandName(
                                                    districtList,
                                                )}
                                                isSearchable={true}
                                                isLoading={loading}
                                                loadingMessage={() => <>Đang tìm kiếm danh mục cha...</>}
                                                name="district"
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                value={districtList.find(obj => obj.value === selectedDistrict)} // set selected value
                                                onChange={(e) => { handleChangeDistrict(e) }}
                                            />
                                        </Box>
                                        <Box className={classes.infoAddress}>
                                            <Typography className={classes.wrapIcon}>
                                                Phường/xã <IconRequired />
                                            </Typography>
                                            <Select
                                                // classNamePrefix="select"
                                                className={classes.selectBox}
                                                noOptionsMessage={() => <>Không có tìm thấy địa chỉ nào</>}
                                                isClearable={true}
                                                options={FormatDataUtils.getOptionWithIdandName(
                                                    wardList,
                                                )}
                                                isSearchable={true}
                                                isLoading={loading}
                                                loadingMessage={() => <>Đang tìm kiếm danh mục cha...</>}
                                                name="ward"
                                                menuPortalTarget={document.body}
                                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                                value={wardList.find(obj => obj.value === selectedWard)} // set selected value
                                                onChange={(e) => { handleChangeWard(e) }}
                                            />
                                        </Box>

                                    </Box>
                                </Grid>

                                <Box className={classes.infoContainer}>
                                    <Typography className={classes.wrapIcon}>
                                        Địa chỉ chi tiết {" "} <IconRequired />
                                    </Typography>
                                    <TextfieldWrapper
                                        className={classes.styleInput}
                                        name="address"
                                        fullWidth
                                        id="address"
                                        autoComplete="address"
                                    // autoFocus
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
                            <ButtonWrapper color='success' variant="contained" startIcon={<CheckIcon />}>Thêm nhà kho</ButtonWrapper>
                            <Button
                                color='error'
                                onClick={() => handleOnClickExit()}
                                variant="contained"
                                startIcon={<ClearIcon />}
                            >
                                Hủy
                            </Button>
                        </Stack>
                    </Form>
                </Formik>
            </Grid>
        </Container>
    );
};

export default WareHouseForm;
