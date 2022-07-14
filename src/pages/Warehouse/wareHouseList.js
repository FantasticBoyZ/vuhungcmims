import { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import Popup from '@/components/Common/Popup';
import {
    Box,
    Button,
    Paper,
    Stack,
    TableBody,
    TableCell,
    TableRow,
    Container,
    Tooltip,
    TableHead,
    TableContainer,
    Typography
} from '@mui/material';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { getWarehouseList, getWarehouseDetail, deleteWarehouse } from '@/slices/WarehouseSlice';
import AddIcon from '@mui/icons-material/Add';
import ButtonWrapper from '@/components/Common/FormsUI/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import WareHouseForm from './wareHouseForm';
import { toast } from 'react-toastify';
import EditWareHouseForm from './EditWarehouse';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';

const useStyles = makeStyles((theme) => ({
    table: {
        textAlign: 'center',
        padding: '20px',
        '& thead th': {
            backgroundColor: '#DCF4FC',
            textAlign: 'center'

        },
        '& tbody td': {
            width: '20%',
            textAlign: 'center'
        },
        '& tbody tr:hover': {
            cursor: 'pointer',
        },
    },
    cardStyle: {
        padding: '12px',
    },
    icons: {
        marginRight: '20px',
    },
}));


const WarehouseList = () => {
    const [openPopup, setOpenPopup] = useState(false);
    const [openPopupDelete, setOpenPopupDelete] = useState(false);
    const [openPopupEdit, setOpenPopupEdit] = useState(false);
    const classes = useStyles();
    const navigate = useNavigate();
    const [warehouseList, setWarehouseList] = useState();
<<<<<<< HEAD
    // const [warehouse, setWarehouse] = useState({});
=======
    const [warehouse, setWarehouse] = useState({});
>>>>>>> f4808b0ce5b4bbb0f67d90801640fe078bc8844d
    const [selectedWarehouse, setSelectedWarehouse] = useState();
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => ({ ...state.warehouse }));

    const handleOnclickAddNewWareHouse = (wareHouseId) => {
        setSelectedWarehouse(wareHouseId)
        setOpenPopup(true);
    };

    const handleOnClickDelete = (warehouseId) => {
        setSelectedWarehouse(warehouseId)
        setOpenPopupDelete(true);
    };

    const handleOnClickEdit = (warehouseId) => {
        setSelectedWarehouse(warehouseId)
        setOpenPopupEdit(true);
    };


    const handleDelete = async () => {
        try {
            let actionResult;
            actionResult = await dispatch(deleteWarehouse(selectedWarehouse));
            const dataResult = unwrapResult(actionResult);
            toast.success('Xóa kho thành công!');
            closePopupDelete()
<<<<<<< HEAD
            setTimeout(() => {
                window.location.reload(true);
                window.close()
            }, 5000);
=======
>>>>>>> f4808b0ce5b4bbb0f67d90801640fe078bc8844d
        } catch (error) {
            console.log('Failed to delete warehouse: ', error);
            toast.error('Xóa kho thất bại!');
        }
    }

    const closePopup = () => {
        setOpenPopup(false);
    };

    const closePopupDelete = () => {
        setOpenPopupDelete(false);
    };

<<<<<<< HEAD
    // const getDetail = async () => {
    //     try {
    //         const actionResult = await dispatch(getWarehouseDetail(selectedWarehouse));
    //         const dataResult = unwrapResult(actionResult);
    //         // if (dataResult.data) {
    //         setWarehouse(dataResult.data.warehouse);
    //         // }
    //     } catch (error) {
    //         console.log('Failed to fetch warehouse detail: ', error);
    //     }
    // };
=======
    const getDetail = async () => {
        try {
            const actionResult = await dispatch(getWarehouseDetail(selectedWarehouse));
            const dataResult = unwrapResult(actionResult);
            // if (dataResult.data) {
            setWarehouse(dataResult.data.warehouse);
            // }
        } catch (error) {
            console.log('Failed to fetch warehouse detail: ', error);
        }
    };
>>>>>>> f4808b0ce5b4bbb0f67d90801640fe078bc8844d

    const getAllWarehouse = async (keyword) => {
        try {
            const actionResult = await dispatch(getWarehouseList());
            const dataResult = unwrapResult(actionResult);
            if (dataResult.data) {
                setWarehouseList(dataResult.data.warehouse);
            }
        } catch (error) {
            console.log('Failed to fetch warehouse list: ', error);
        }
    };
    useEffect(() => {
        getAllWarehouse()
<<<<<<< HEAD
        // if (selectedWarehouse) {
        //     getDetail()
        // }
=======
        if (selectedWarehouse) {
            getDetail()
        }
>>>>>>> f4808b0ce5b4bbb0f67d90801640fe078bc8844d
    }, [selectedWarehouse])
    return (
        <Container>
            <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={2}
                p={2}
            >
                <Button
                    className={classes.styleButton}
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOnclickAddNewWareHouse()}
                >
                    Thêm nhà kho mới
                </Button>
            </Stack>

            <Paper>
                {!warehouseList ? (
                    <ProgressCircleLoading />
                ) : (
                    <Box className={classes.table}>
                        <TableContainer>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nhà kho</TableCell>
                                    <TableCell>Địa chỉ</TableCell>
                                    <TableCell align="left">Hành động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {warehouseList.map((item) => (
                                    <TableRow key={item?.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.addressWareHouse}</TableCell>
                                        <TableCell>
                                            <Tooltip
                                                title="Chỉnh sửa"
                                                arrow
                                            >
                                                <ModeEditIcon onClick={() => handleOnClickEdit(item?.id)} color='warning' className={classes.icons} />
                                            </Tooltip>
                                            <Tooltip
                                                title="Xóa"
                                                arrow
                                            >
                                                <DeleteForeverIcon color='error' onClick={() => handleOnClickDelete(item?.id)} className={classes.icons} />
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </TableContainer>
                    </Box>
                )}
            </Paper>
            <Popup
                title="Thêm nhà kho"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <WareHouseForm
                    closePopup={closePopup}
                //   warehouse={warehouse}
                />
            </Popup>
            <Popup
                title="Chỉnh sửa thông tin nhà kho"
                openPopup={openPopupEdit}
                setOpenPopup={setOpenPopupEdit}
            >
                <EditWareHouseForm
                    closePopup={closePopup}
                    selectedWarehouse={selectedWarehouse}
<<<<<<< HEAD
                // warehouse={warehouse}
=======
                    warehouse={warehouse}
>>>>>>> f4808b0ce5b4bbb0f67d90801640fe078bc8844d
                />
            </Popup>
            <Popup
                title="Bạn có chắc muốn xóa nhà kho này không?"
                openPopup={openPopupDelete}
                setOpenPopup={setOpenPopupDelete}
            >
                <Typography >
                    Bạn phải chắc chắn rằng trong kho không còn sản phẩm nào mới có thể xóa được kho.
                </Typography>
                <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-end"
                    padding="20px"
                >
                    <Button
                        variant="contained"
                        olor='success'
                        startIcon={<CheckIcon />}
                        onClick={() => { handleDelete() }}
                    >
                        Xác nhận</Button>
                    <Button
                        color='error'
                        variant="contained"
                        startIcon={<ClearIcon />}
                        onClick={() => closePopupDelete()}
                    >
                        Hủy
                    </Button>
                </Stack>
            </Popup>
        </Container>
    );
};

export default WarehouseList;
<<<<<<< HEAD

=======
>>>>>>> f4808b0ce5b4bbb0f67d90801640fe078bc8844d
