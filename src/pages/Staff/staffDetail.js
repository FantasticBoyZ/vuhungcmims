import SubProductList from '@/pages/Product/ProductList/ProductDetail/SubProductList';
import { getProductDetail } from '@/slices/ProductSlice';
import { Box, Container, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProductInformation from './ProductInformation';

const useStyles = makeStyles({});

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const [subProductList, setSubProductList] = useState([]);
  const [totalRecord, setTotalRecord] = useState(0);
  const classes = useStyles();

  const dispatch = useDispatch();
  const { loading, products } = useSelector((state) => ({ ...state.products }));

  const productClone = {
    name: 'Thép cây Việt Nhật D16',
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
    const fetchProductDetail = async () => {
      try {
        const actionResult = await dispatch(getProductDetail(productId));
        const dataResult = unwrapResult(actionResult);
        if (dataResult.data) {
          setTotalRecord(dataResult.data.totalRecord);
          setSubProductList(dataResult.data.subProduct);
          setProduct(dataResult.data.product);
        }
        console.log('dataResult', dataResult);
        console.log('product', dataResult.data.product);
        console.log(dataResult);
        console.log('products', products);
      } catch (error) {
        console.log('Failed to fetch product detail: ', error);
      }
    };
    // console.log('subProductList', subProductList);
    // console.log('product', product);
    return () => fetchProductDetail();
  }, []);

  return (
    <>
      {loading ? (
        <>Loading...</>
      ) : (
        <Container maxWidth="xl">
          {!!product && <ProductInformation product={product} />}

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
              {/* <Typography variant='h5'>Danh sách lô hàng </Typography> */}
              {!!totalRecord && totalRecord > 0 && !!subProductList ? (
                <SubProductList subProductList={subProductList} />
              ) : (
                <Box> Sản phẩm chưa có lô hàng nào</Box>
              )}
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};

export default ProductDetail;
