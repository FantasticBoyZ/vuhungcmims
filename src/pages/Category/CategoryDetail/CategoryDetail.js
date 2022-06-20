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
const CategoryDetail = () => {
  const categoryId = useParams();
  const classes = useStyles();
  const category = {
    name: 'Gạch',
    description: 'Sản phẩm bền đẹp đạt chuẩn chất lượng Châu Âu',
  };
  return (
    <Container>
      <Card className={classes.cardHeader} >
        <Typography variant='h5'>Thông tin danh mục</Typography>
      </Card>
      <Card className={classes.infoContainer}>
        <Typography fontSize='20px'>
          Danh mục: <strong>{category.name}</strong>
        </Typography>
        <Typography fontSize='20px'>Mô tả:</Typography>
        <TextField
          defaultValue={category.description}
          multiline
          rows={4}
          fontSize='20px'
          sx={{ width: '100%' }}
          InputProps={{
            readOnly: true,
          }}
        />
      </Card>
    </Container>
  );
};

export default CategoryDetail;
