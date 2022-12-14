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
      toast.success('X??a kho th??nh c??ng!', { autoClose: 2000 });
      closePopupDelete();
      window.location.reload(true);
      window.close();
    } catch (error) {
      console.log('Failed to delete warehouse: ', error);
      if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('X??a kho th???t b???i!');
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
            Th??m nh?? kho m???i
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
                    <TableCell>Nh?? kho</TableCell>
                    <TableCell>?????a ch???</TableCell>
                    {currentUserRole === 'ROLE_OWNER' && (
                      <TableCell align="left">H??nh ?????ng</TableCell>
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
                            title="Ch???nh s???a"
                            arrow
                          >
                            <ModeEditIcon
                              onClick={() => handleOnClickEdit(item?.id)}
                              color="warning"
                            />
                          </Tooltip>
                          <Tooltip
                            title="X??a"
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
        title="Th??m nh?? kho"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <WareHouseForm closePopup={closePopup} />
      </Popup>
      <Popup
        title="Ch???nh s???a th??ng tin nh?? kho"
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
        title="B???n c?? ch???c mu???n x??a nh?? kho n??y kh??ng?"
        openPopup={openPopupDelete}
        setOpenPopup={setOpenPopupDelete}
      >
        <Typography>
          B???n ph???i ch???c ch???n r???ng trong kho kh??ng c??n s???n ph???m n??o m???i c?? th??? x??a ???????c
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
            X??c nh???n
          </Button>
          <Button
            color="error"
            variant="contained"
            startIcon={<ClearIcon />}
            onClick={() => closePopupDelete()}
          >
            H???y
          </Button>
        </Stack>
      </Popup>
    </Container>
  );
};

export default WarehouseList;
