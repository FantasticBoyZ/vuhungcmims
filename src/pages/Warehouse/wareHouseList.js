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
  Typography,
  Table,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { getWarehouseList, deleteWarehouse } from '@/slices/WarehouseSlice';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import WareHouseForm from './AddWareHouse';
import { toast } from 'react-toastify';
import EditWareHouseForm from './EditWarehouse';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';
import AuthService from '@/services/authService';

const useStyles = makeStyles((theme) => ({
  table: {
    // width: 'inherit',
    textAlign: 'center',
    padding: '20px',
    '& thead th': {
      backgroundColor: '#DCF4FC',
      textAlign: 'center',
    },
    '& tbody td': {
      // width: '20%',
      textAlign: 'center',
    },
    '& tbody tr:hover': {
      cursor: 'pointer',
    },
  },
  cardStyle: {
    padding: '12px',
  },
}));

const WarehouseList = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupDelete, setOpenPopupDelete] = useState(false);
  const [openPopupEdit, setOpenPopupEdit] = useState(false);
  const classes = useStyles();
  const [warehouseList, setWarehouseList] = useState();
  const [selectedWarehouse, setSelectedWarehouse] = useState();
  const dispatch = useDispatch();
  const currentUserRole = AuthService.getCurrentUser().roles[0];

  const handleOnclickAddNewWareHouse = (wareHouseId) => {
    setSelectedWarehouse(wareHouseId);
    setOpenPopup(true);
  };

  const handleOnClickDelete = (warehouseId) => {
    setSelectedWarehouse(warehouseId);
    setOpenPopupDelete(true);
  };

  const handleOnClickEdit = (warehouseId) => {
    setSelectedWarehouse(warehouseId);
    setOpenPopupEdit(true);
  };

  const handleDelete = async () => {
    try {
      let actionResult;
      actionResult = await dispatch(deleteWarehouse(selectedWarehouse));
      const dataResult = unwrapResult(actionResult);
      toast.success('Xóa kho thành công!', { autoClose: 2000 });
      closePopupDelete();
      setTimeout(() => {
        window.location.reload(true);
        window.close();
      }, 2000);
    } catch (error) {
      console.log('Failed to delete warehouse: ', error);
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Xóa kho thất bại!');
      }
    }
  };

  const closePopup = () => {
    setOpenPopup(false);
    setOpenPopupEdit(false);
  };

  const closePopupDelete = () => {
    setOpenPopupDelete(false);
  };

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
    getAllWarehouse();
  }, [selectedWarehouse]);

  return (
    <Container>
      {currentUserRole === 'ROLE_OWNER' && (
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
      )}

      <Paper>
        {!warehouseList ? (
          <ProgressCircleLoading />
        ) : (
          <Box className={classes.table}>
            <TableContainer sx={{ display: 'table' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nhà kho</TableCell>
                    <TableCell>Địa chỉ</TableCell>
                    {currentUserRole === 'ROLE_OWNER' && (
                      <TableCell align="left">Hành động</TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {warehouseList.map((item) => (
                    <TableRow key={item?.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.addressWareHouse}</TableCell>
                      {currentUserRole === 'ROLE_OWNER' && (
                        <TableCell>
                          <Tooltip
                            title="Chỉnh sửa"
                            arrow
                          >
                            <ModeEditIcon
                              onClick={() => handleOnClickEdit(item?.id)}
                              color="warning"
                            />
                          </Tooltip>
                          <Tooltip
                            title="Xóa"
                            arrow
                          >
                            <DeleteForeverIcon
                              color="error"
                              onClick={() => handleOnClickDelete(item?.id)}
                              sx={{ marginLeft: '15%' }}
                            />
                          </Tooltip>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>
      <Popup
        title="Thêm nhà kho"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <WareHouseForm closePopup={closePopup} />
      </Popup>
      <Popup
        title="Chỉnh sửa thông tin nhà kho"
        openPopup={openPopupEdit}
        setOpenPopup={setOpenPopupEdit}
      >
        <EditWareHouseForm
          closePopup={closePopup}
          selectedWarehouse={selectedWarehouse}
          // warehouse={warehouse}
        />
      </Popup>
      <Popup
        title="Bạn có chắc muốn xóa nhà kho này không?"
        openPopup={openPopupDelete}
        setOpenPopup={setOpenPopupDelete}
      >
        <Typography>
          Bạn phải chắc chắn rằng trong kho không còn sản phẩm nào mới có thể xóa được
          kho.
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          padding="20px"
        >
          <Button
            variant="contained"
            olor="success"
            startIcon={<CheckIcon />}
            onClick={() => {
              handleDelete();
            }}
          >
            Xác nhận
          </Button>
          <Button
            color="error"
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
