import FormatDataUtils from '@/utils/formatData';
import { Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  Grid,
  Stack,
  Table,
  TableCell,
  TableRow,
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
  labelInfo: {
    color: '#696969',
  },
  contentInfo: {
    color: '#000000',
    fontWeight: '400 !important',
  },
  imageStyle: {
    height: '250px',
    width: '250px',
    objectFit: 'cover',
    borderRadius: '15px',
    border: '1px solid black',
  },
});

const localhost = 'http://localhost:8080'
const deployUrl = 'http://ec2-52-221-240-240.ap-southeast-1.compute.amazonaws.com:8080'

const ProductInformation = ({ product }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const handleOnClickEdit = () => {
    navigate(`/product/edit/${product.id}`);
  };
  return (
    <Grid
      container
      spacing={2}
    >
      <Grid
        xs={12}
        item
      >
        <Card>
          <Stack
            direction="row"
            justifyContent="space-between"
            p={2}
          >
            <Typography variant="h6">
              <strong>{product.name}</strong>
            </Typography>

            <Button
              variant="contained"
              startIcon={<Edit />}
              color="warning"
              onClick={() => handleOnClickEdit()}
            >
              Chỉnh sửa
            </Button>
          </Stack>
        </Card>
      </Grid>
      <Grid
        xs={12}
        item
      >
        <Card>
          {/* <CardHeader title="Thông tin sản phẩm" /> */}
          <CardContent>
            <Typography variant="h6">Thông tin sản phẩm</Typography>

            <CardContent className={classes.infoStyle}>
              <Grid
                container
                spacing={2}
              >
                <Grid
                  xs={4}
                  item
                >
                  <Grid
                    container
                    spacing={2}
                  >
                    <Grid
                      xs={12}
                      item
                    >
                      <Grid container>
                        <Grid
                          xs={1}
                          item
                        ></Grid>
                        <Grid
                          xs={6}
                          item
                        >
                          <Typography className={classes.labelInfo}>
                            Mã sản phẩm
                          </Typography>
                        </Grid>
                        <Grid
                          xs={5}
                          item
                        >
                          <Typography className={classes.contentInfo}>
                            {product.productCode}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      xs={12}
                      item
                    >
                      <Grid container>
                        <Grid
                          xs={1}
                          item
                        ></Grid>
                        <Grid
                          xs={6}
                          item
                        >
                          <Typography className={classes.labelInfo}>
                            Nhà sản xuất
                          </Typography>
                        </Grid>
                        <Grid
                          xs={5}
                          item
                        >
                          <Typography className={classes.contentInfo}>
                            {product.manufactorName}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      xs={12}
                      item
                    >
                      <Grid container>
                        <Grid
                          xs={1}
                          item
                        ></Grid>
                        <Grid
                          xs={6}
                          item
                        >
                          <Typography className={classes.labelInfo}>Danh mục</Typography>
                        </Grid>
                        <Grid
                          xs={5}
                          item
                        >
                          <Typography className={classes.contentInfo}>
                            {product.categoryName}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      xs={12}
                      item
                    >
                      <Grid container>
                        <Grid
                          xs={1}
                          item
                        ></Grid>
                        <Grid
                          xs={6}
                          item
                        >
                          <Typography className={classes.labelInfo}>
                            Danh mục phụ
                          </Typography>
                        </Grid>
                        <Grid
                          xs={5}
                          item
                        >
                          <Typography className={classes.contentInfo}>
                            {product.subCategoryName}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      xs={12}
                      item
                    >
                      <Grid container>
                        <Grid
                          xs={1}
                          item
                        ></Grid>
                        <Grid
                          xs={6}
                          item
                        >
                          <Typography className={classes.labelInfo}>Màu sắc</Typography>
                        </Grid>
                        <Grid
                          xs={5}
                          item
                        >
                          <Typography className={classes.contentInfo}>
                            {product.color}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      xs={12}
                      item
                    >
                      <Grid container>
                        <Grid
                          xs={1}
                          item
                        ></Grid>
                        <Grid
                          xs={6}
                          item
                        >
                          <Typography className={classes.labelInfo}>Đơn giá</Typography>
                        </Grid>
                        <Grid
                          xs={5}
                          item
                        >
                          <Typography className={classes.contentInfo}>
                            {FormatDataUtils.formatCurrency(product.unitPrice || 0)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  xs={5}
                  item
                >
                  <Grid
                    container
                    spacing={2}
                  >
                    <Grid
                      xs={12}
                      item
                    >
                      <Typography className={classes.labelInfo}>
                        Mô tả sản phẩm
                      </Typography>
                    </Grid>
                    <Grid
                      xs={12}
                      item
                    >
                      <Typography className={classes.contentInfo}>
                        {product.description}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  xs={3}
                  item
                >
                  {/* TODO: đổi sang api deploy khi push code lên nhánh master */}
                  {product.image ? (
                    <img
                      // component="img"
                      // height="250"
                      // sx={{ width: 250 }}
                      className={classes.imageStyle}
                      alt="Ảnh sản phẩm"
                      src={`${localhost}/${product.image}`}
                    />
                  ) : (
                    <img
                      // component="img"
                      // height="250"
                      // sx={{ width: 250 }}
                      className={classes.imageStyle}
                      alt="Ảnh sản phẩm"
                      src={require('@/assets/images/no-image-found.png')}
                    />
                  )}
                </Grid>
              </Grid>
            </CardContent>
            {/* <Grid container>
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
                        : <strong>{product.quantity || '0'}</strong>
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
                      variant="standard"
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
            </Grid> */}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProductInformation;
