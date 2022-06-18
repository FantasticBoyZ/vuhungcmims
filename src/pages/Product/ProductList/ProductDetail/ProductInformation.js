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
          <Typography variant="h3">{product.name}</Typography>
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
            <Button variant="outlined">Thoát</Button>
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
                variant="h6"
                lineHeight={2}
              >
                Mã sản phẩm:{' '}
                <Box
                  component="span"
                  color="blue"
                >
                  {product.productCode}
                </Box>
              </Typography>

              <Typography
                variant="h6"
                lineHeight={2}
              >
                Danh mục:{' '}
                <Box
                  component="span"
                  color="blue"
                >
                  {product.categoryName}
                </Box>
              </Typography>

              <Typography
                variant="h6"
                lineHeight={2}
              >
                Danh mục phụ:{' '}
                <Box
                  component="span"
                  color="blue"
                >
                  {product.subCategoryName}
                </Box>
              </Typography>

              <Typography
                variant="h6"
                lineHeight={2}
              >
                Đơn vị tính:{' '}
                <Box
                  component="span"
                  color="blue"
                >
                  {product.unitMeasure}
                </Box>
              </Typography>

              <Typography
                variant="h6"
                lineHeight={2}
              >
                Tồn kho:{' '}
                <Box
                  component="span"
                  color="blue"
                >
                  {product.quantity}
                </Box>
              </Typography>
            </Grid>

            <Grid
              xs={6}
              item
              // sx={{ backgroundColor:"blue" }}
            >
              <Typography
                variant="h6"
                lineHeight={2}
              >
                Nhà cung cấp:{' '}
                <Box
                  component="span"
                  color="blue"
                >
                  {product.manufactorName}
                </Box>
              </Typography>
              <Typography
                variant="h6"
                lineHeight={2}
              >
                Mô tả:{' '}
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
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ProductInformation;
