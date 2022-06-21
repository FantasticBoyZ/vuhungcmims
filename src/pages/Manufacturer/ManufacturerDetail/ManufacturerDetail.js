import { Card, Container, TextField, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useParams } from 'react-router-dom';

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
  const manufacturerId = useParams();
  // TODO: call api get manufacturer detail
  const classes = useStyles();
  const manufacturer = {
    name: 'Nguyễn Văn A',
    email: 'callapi@gmail.com',
    phone: '0982412342',
  };
  return (
    <Container>
      <Card className={classes.cardHeader} >
        <Typography variant='h5' lineHeight={2}>Thông tin nhà cung cấp</Typography>
      </Card>
      <Card className={classes.infoContainer}>
        <Typography fontSize='20px' lineHeight={2}>
          Tên nhà cung cấp: <strong>{manufacturer.name}</strong>
        </Typography>
        <Typography fontSize='20px' lineHeight={2}>Email: <strong>{manufacturer.email}</strong></Typography>
        <Typography fontSize='20px' lineHeight={2}>Số điện thoại: <strong>{manufacturer.email}</strong></Typography>
      </Card>
    </Container>
  );
};

export default ManufacturerDetail;
