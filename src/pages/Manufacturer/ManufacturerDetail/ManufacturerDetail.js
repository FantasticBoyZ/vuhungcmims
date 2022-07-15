import { getManufacturerById } from '@/slices/ManufacturerSlice';
import { Box, Button, Card, Container, Grid, Stack, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import CreateIcon from '@mui/icons-material/Create';
import ProgressCircleLoading from '@/components/Common/ProgressCircleLoading';

const useStyles = makeStyles({
  cardHeader: {
    display: 'flex',
    padding: '20px 20px',
    marginBottom: '20px',
    justifyContent: 'space-between'
  },
  infoContainer: {
    display: 'block',
    // verticalAlign: 'center',
    // justifyContent: 'center',
    padding: '20px',
    marginBottom: '20px',
  },
  infoProduct: {
    padding: '20px'
  }
});
const ManufacturerDetail = () => {
  const { manufacturerId } = useParams();
  const [manufacturer, setManufacturer] = useState();
  const classes = useStyles();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => ({ ...state.manufacturers }));

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

    fetchManufacturerDetail();
  }, []);
  return (
    <Container>
      <Card className={classes.cardHeader}>
        <Typography
          variant="h5"
          lineHeight={2}
        >
          {manufacturer?.name}
        </Typography>
        <Button onClick={() => handleOnClickEdit()} color='warning' variant="contained" startIcon={<CreateIcon />}>
          Chỉnh sửa
        </Button>
      </Card>
      <Card className={classes.infoContainer}>
        {loading ? (
          <ProgressCircleLoading />
        ) : (
          <Box>
            <Typography
              fontSize="20px"
              lineHeight={2}
            >
              <strong> Thông tin chi tiết:</strong>
            </Typography>
            <Grid
              xs={12}
              item
            >
              <Typography
                fontSize="20px"
                lineHeight={2}
                item xs={4}
              >Số điện thoại:  <strong item xs={8}>{manufacturer?.phone}</strong>
              </Typography>


            </Grid>
            <Typography
              fontSize="20px"
              lineHeight={2}
            >
              Email: {manufacturer?.email}
            </Typography>
            <Typography
              fontSize="20px"
              lineHeight={2}
            >
              Địa chỉ: {manufacturer?.addressManufactor}
            </Typography>
            {/* <Stack
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
            </Stack> */}
          </Box>
        )}
      </Card>
      <Card className={classes.infoProduct}>
        <Box>
          <Typography>Các sản phẩm cung cấp</Typography>
        </Box>
      </Card>
    </Container>
  );
};

export default ManufacturerDetail;
