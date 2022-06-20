import {
  Box,
  Button,
  Card,
  CardMedia,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  productInformation: {
    marginBottom: '32px',
  },
  cardStyle: {
    padding: '12px',
  },
});

const ProductInformation = ({ product }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleOnClickEdit = () => {
    navigate(`/product/edit/${product.id}`);
  };
  return (
    <Box className={classes.productInformation}>
      <Card className={classes.cardStyle}>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          p={2}
        >
          <Typography variant="h5">
            Sản phẩm: <strong>{product.name}</strong>
          </Typography>
          <Stack
            direction="row"
            spacing={2}
          >
            <Button
              onClick={() => handleOnClickEdit()}
              variant="contained"
            >
              Sửa sản phẩm
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/product')}
            >
              Thoát
            </Button>
          </Stack>
        </Stack>
        <Divider />
        <Grid container>
          <Grid
            item
            xs={4}
            // sx={{ backgroundColor:"green" }}
          >
            <CardMedia
              component="img"
              height="200"
              sx={{ width: 200 }}
              alt="Product Detail"
              src="https://i.picsum.photos/id/604/200/300.jpg?hmac=6ceMKS8u7easDoKzWSaIiSTpRlTPn1OUOdfSJWou3uQ"
            />
          </Grid>
          <Grid
            container
            item
            xs={8}
          >
            <Grid
              xs={6}
              item
              // sx={{ backgroundColor:"red" }}
            >
              <Typography
                fontSize="20px"
                lineHeight={2}
              >
                Mã sản phẩm: <strong>{product.productCode}</strong>
              </Typography>

              <Typography
                fontSize="20px"
                lineHeight={2}
              >
                Danh mục: <strong>{product.categoryName}</strong>
              </Typography>

              <Typography
                fontSize="20px"
                lineHeight={2}
              >
                Danh mục phụ: <strong>{product.subCategoryName}</strong>
              </Typography>

              <Typography
                fontSize="20px"
                lineHeight={2}
              >
                Đơn vị tính: <strong>{product.unitMeasure}</strong>
              </Typography>

              <Typography
                fontSize="20px"
                lineHeight={2}
              >
                Tồn kho: <strong>{product.quantity}</strong>
              </Typography>
            </Grid>

            <Grid
              xs={6}
              item
              // sx={{ backgroundColor:"blue" }}
            >
              <Typography
                fontSize="20px"
                lineHeight={2}
              >
                Nhà cung cấp: <strong>{product.manufactorName}</strong>
              </Typography>
              <Typography
                fontSize="20px"
                lineHeight={2}
              >
                Mô tả:{' '}
              </Typography>
              <Box>
                <TextField
                  defaultValue={product.description}
                  multiline
                  rows={4}
                  sx={{ width: '80%' }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ProductInformation;
