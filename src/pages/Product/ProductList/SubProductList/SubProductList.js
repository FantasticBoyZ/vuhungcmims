import productService from '@/services/productService';
import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SubProductList = () => {
  const { productId } = useParams();
  const [subProductList, setSubProductList] = useState();

  useEffect(() => {
    const fetchSubProductList = async () => {
      try {
        // get list subProduct by productId
        const response = await productService.getProductById(productId);
        setSubProductList(response);
        console.log('subProductList', response);
      } catch (error) {
        console.log('Failed to fetch product list: ', error);
      }
    };
    fetchSubProductList();
    console.log(subProductList);
  }, [productId]);

  return (
    <div>
      SubProductList by Product id: {productId}
      <Box>
        {/* <Typography>{subProductList.name}</Typography> */}
      </Box>
    </div>
  );
};

export default SubProductList;
