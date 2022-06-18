import axiosClient from '@/utils/axiosCient';
import authHeader from '@/services/auth-header';
import axios from 'axios';

const productService = {
  getAllProduct: (params) => {
    const url = '/product';
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getProductById: (id) => {
    const url = `/product/${id}`;
    return axiosClient.get(url, { headers: authHeader() });
  },

  saveProduct: (product) => {
    // console.log(product)

    // const product1 = {
    //   name: 'Add dc roi nhe',
    //   productCode: 'abc',
    //   unitMeasure: 'abcv',
    //   wrapUnitMeasure: 'hop',
    //   numberOfWrapUnitMeasure: 2,
    //   color: 'ss',
    //   description: 'ss',
    //   categoryId: "1",
    //   manufactorId: "1",
    // };
    const url = 'http://localhost:8080/api/product/add';
    
    axios.post(url,{
      id: product.id,
      name: product.name,
      productCode: product.productCode,
      unitMeasure: product.unitMeasure,
      wrapUnitMeasure: product.wrapUnitMeasure,
      numberOfWrapUnitMeasure: product.numberOfWrapUnitMeasure,
      color: product.color,
      description: product.color,
      categoryId: product.categoryId,
      manufactorId: product.manufactorId,
    }).then((response) => {
    
      return response.data;
    }, (error) => {
      console.log(error)
    });;
  },
};

export default productService;
