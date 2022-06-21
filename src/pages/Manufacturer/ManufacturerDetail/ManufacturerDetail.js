import { getManufacturerById } from '@/slices/ManufacturerSlice';
import { Box, Button, Card, Container, Stack, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const useStyles = makeStyles({
  cardHeader: {
    padding: '30px 20px',
    marginBottom: '20px',
  },
  infoContainer: {
    display: 'block',
    // verticalAlign: 'center',
    // justifyContent: 'center',
    padding: '20px',
  },
});
const ManufacturerDetail = () => {
  const { manufacturerId } = useParams();
  const [manufacturer, setManufacturer] = useState();
  const classes = useStyles();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.manufacturers }));
  // const manufacturer = {
  //   name: 'Nguyễn Văn A',
  //   email: 'callapi@gmail.com',
  //   phone: '0982412342',
  // };

  const handleOnClickEdit = () => {
    navigate(`/manufacturer/edit/${manufacturerId}`)
  }

  useEffect(() => {
    const fetchManufacturerDetail = async () => {
      try {
        const actionResult = await dispatch(getManufacturerById(manufacturerId));
        const dataResult = unwrapResult(actionResult);
        if (dataResult.data) {
          setManufacturer(dataResult.data.manufactor);
        }
        console.log('dataResult', dataResult);
      } catch (error) {
        console.log('Failed to fetch manufacturer detail: ', error);
      }
    };
    // console.log('subProductList', subProductList);

    fetchManufacturerDetail();
  }, []);
  return (
    <Container>
      <Card className={classes.cardHeader}>
        <Typography
          variant="h5"
          lineHeight={2}
        >
          Thông tin nhà cung cấp
        </Typography>
      </Card>
      <Card className={classes.infoContainer}>
        {loading ? (
          <>Loading...</>
        ) : (
          <Box>
            <Typography
              fontSize="20px"
              lineHeight={2}
            >
              Tên nhà cung cấp: <strong>{manufacturer?.name}</strong>
            </Typography>
            <Typography
              fontSize="20px"
              lineHeight={2}
            >
              Email: <strong>{manufacturer?.email}</strong>
            </Typography>
            <Typography
              fontSize="20px"
              lineHeight={2}
            >
              Số điện thoại: <strong>{manufacturer?.phone}</strong>
            </Typography>
            <Typography
              fontSize="20px"
              lineHeight={2}
            >
              Địa chỉ: <strong>{manufacturer?.addressManufactor}</strong>
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              justifyContent='flex-end'
            >
              <Button
                onClick={() => handleOnClickEdit()}
                variant="contained"
              >
                Sửa thông tin nhà cung cấp
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/manufacturer')}
              >
                Thoát
              </Button>
            </Stack>
          </Box>
        )}
      </Card>
    </Container>
  );
};

export default ManufacturerDetail;
