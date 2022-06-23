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
  infoStyle: {
    fontSize: '16px',
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
      <Card className={classes.cardStyle}>
        <Grid container>
          
          <Grid
            container
            item
            xs={9}
          >
            <Grid
              xs={6}
              item
              // sx={{ backgroundColor:"red" }}
            >
              <Typography
                component={'span'}
                className={classes.infoStyle}
                lineHeight={2}
              >
                <Grid container>
                  <Grid
                    xs={6}
                    item
                  >
                    Mã sản phẩm{' '}
                  </Grid>
                  <Grid
                    xs={6}
                    item
                  >
                    : <strong>{product.productCode}</strong>
                  </Grid>
                </Grid>
              </Typography>

              <Typography
                component={'span'}
                className={classes.infoStyle}
                lineHeight={2}
              >
                <Grid container>
                  <Grid
                    xs={6}
                    item
                  >
                    Danh mục{' '}
                  </Grid>
                  <Grid
                    xs={6}
                    item
                  >
                    : <strong>{product.categoryName}</strong>
                  </Grid>
                </Grid>
              </Typography>

              <Typography
                component={'span'}
                className={classes.infoStyle}
                lineHeight={2}
              >
                <Grid container>
                  <Grid
                    xs={6}
                    item
                  >
                    Danh mục phụ
                  </Grid>
                  <Grid
                    xs={6}
                    item
                  >
                    : <strong>{product.subCategoryName}</strong>
                  </Grid>
                </Grid>
              </Typography>

              <Typography
                component={'span'}
                className={classes.infoStyle}
                lineHeight={2}
              >
                <Grid container>
                  <Grid
                    xs={6}
                    item
                  >
                    Đơn vị tính
                  </Grid>
                  <Grid
                    xs={6}
                    item
                  >
                    : <strong>{product.unitMeasure}</strong>
                  </Grid>
                </Grid>
              </Typography>

              <Typography
                component={'span'}
                className={classes.infoStyle}
                lineHeight={2}
              >
                <Grid container>
                  <Grid
                    xs={6}
                    item
                  >
                    Tồn kho
                  </Grid>
                  <Grid
                    xs={6}
                    item
                  >
                    : <strong>{product.quantity}</strong>
                  </Grid>
                </Grid>
              </Typography>
            </Grid>

            <Grid
              xs={6}
              item
              // sx={{ backgroundColor:"blue" }}
            >
              <Typography
                component={'span'}
                className={classes.infoStyle}
                lineHeight={2}
              >
                <Grid container>
                  <Grid
                    xs={6}
                    item
                  >
                    Nhà cung cấp
                  </Grid>
                  <Grid
                    xs={6}
                    item
                  >
                    : <strong>{product.manufactorName}</strong>
                  </Grid>
                </Grid>
              </Typography>
              <Typography
                className={classes.infoStyle}
                lineHeight={2}
              >
                Mô tả{' '}
              </Typography>
              <Box>
                <TextField
                  defaultValue={product.description}
                  variant='standard'
                  multiline
                  
                  sx={{ width: '80%' }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          <Grid
            item
            xs={3}
            // sx={{ backgroundColor:"green" }}
          >
            <CardMedia
              component="img"
              height="180"
              sx={{ width: 180 }}
              alt="Product Detail"
              src="https://i.picsum.photos/id/604/200/300.jpg?hmac=6ceMKS8u7easDoKzWSaIiSTpRlTPn1OUOdfSJWou3uQ"
            />
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ProductInformation;
