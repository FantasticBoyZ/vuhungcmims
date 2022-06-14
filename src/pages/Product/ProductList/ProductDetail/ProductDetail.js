import SubProductList from '@/pages/Product/ProductList/ProductDetail/SubProductList';
import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { productId } = useParams();
  const [subProductList, setSubProductList] = useState();

  const productClone = {
    productName: 'Thép cây Việt Nhật D16',
    productCode: 'SP001',
    categoryName: 'Vật liệu thô',
    subCategoryName: 'Vật liệu thô 50x50',
    unitMeasure: 'cái',
    inStock: '100',
    manufacturerName: 'Công ty Pharmedic',
    description:
      'Thép cây Việt Nhật D16 là sản phẩm  được sản xuất từ nguồn nguyên liệu ổn định chất lượng cao theo dây chuyền công nghệ tiên tiến của Tây..',
  };

  useEffect(() => {
    // const fetchSubProductList = async () => {
    //   try {
    //     // get list subProduct by productId
    //     const response = await productService.getProductById(productId);
    //     setSubProductList(response);
    //     console.log('subProductList', response);
    //   } catch (error) {
    //     console.log('Failed to fetch product list: ', error);
    //   }
    // };
    // fetchSubProductList();
    console.log(subProductList);
  }, [productId]);

  return (
    <>
      <Container maxWidth="xl">
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          p={2}
        >
          <Typography variant="h3">{productClone.productName}</Typography>
          <Stack
            direction="row"
            spacing={2}
          >
            <Button variant="contained">Sửa sản phẩm</Button>
            <Button variant="outlined">Thoát</Button>
          </Stack>
        </Stack>
        <Divider />
        <Card>
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
                    {productClone.productCode}
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
                    {productClone.categoryName}
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
                    {productClone.subCategoryName}
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
                    {productClone.unitMeasure}
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
                    {productClone.inStock}
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
                    {productClone.manufacturerName}
                  </Box>
                </Typography>
                <Typography
                  variant="h6"
                  lineHeight={2}
                >
                  Mô tả:{' '}
                  <Box>
                    <TextField
                      defaultValue={productClone.description}
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
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
        >
          <Grid
            item
            xs={12}
          >
            <SubProductList />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ProductDetail;
