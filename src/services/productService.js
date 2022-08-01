import axiosClient from '@/utils/axiosCient';
import authHeader from '@/services/authHeader';
import axios from 'axios';
import { API_URL } from '@/constants/apiUrl';

// const API_URL = 'http://localhost:8080/api'
// const API_URL = process.env.REACT_APP_API_URL
const productService = {
  getAllProduct: (params) => {
    const url = '/product';
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getProductById: (params) => {
    const url = `/product/${params.productId}`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getProductByImportOrderId: (params) => {
    const url = `/import-order/list-product`;
    return axiosClient.get(url, { params, headers: authHeader() });
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
    const url = API_URL + '/product/add';
    // const url = process.env.REACT_APP_API_URL + '/product/add';

    return axios.post(url, {
      id: product.id,
      name: product.name,
      productCode: product.productCode,
      unitMeasure: product.unitMeasure,
      wrapUnitMeasure: product.wrapUnitMeasure,
      numberOfWrapUnitMeasure: product.numberOfWrapUnitMeasure,
      color: product.color,
      categoryId: product.categoryId,
      manufactorId: product.manufactorId,
      description: product.description,
    });
  },

  uploadNewImage: (formData) => {
    const url = API_URL + '/product/add/image';
    // const url = process.env.REACT_APP_API_URL + '/product/add/image';

    axios.post(url, formData).then(
      (response) => {
        return response;
      },
      (error) => {
        console.log(error);
      },
    );
  },

  updateImage: (productId, formData) => {
    const url = API_URL + `/product/update/image/${productId}`;
    // const url = process.env.REACT_APP_API_URL + `/product/update/image/${productId}`;

    return axios.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default productService;
