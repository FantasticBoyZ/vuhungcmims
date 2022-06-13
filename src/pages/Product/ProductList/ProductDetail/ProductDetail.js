import { Card, Container, Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import SubProductList from '@/pages/Product/ProductList/ProductDetail/SubProductList'
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { productId } = useParams();
  const [subProductList, setSubProductList] = useState();

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
        <Card>
          Product Detail
        </Card>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <SubProductList />
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default ProductDetail