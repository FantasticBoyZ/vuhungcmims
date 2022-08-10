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

  getAllProductNotPaging: (manufacturerId) => {
    const url = `/product/manufacturer/${manufacturerId}`;
    return axiosClient.get(url, { headers: authHeader() });
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
    const url = API_URL + '/product/add';

    return axios.post(url, {
      // id: product.id,
      name: product.name,
      productCode: product.productCode,
      unitMeasure: product.unitMeasure,
      wrapUnitMeasure: product.wrapUnitMeasure,
      numberOfWrapUnitMeasure: product.numberOfWrapUnitMeasure,
      color: product.color,
      categoryId: product.categoryId,
      manufactorId: product.manufactorId,
      description: product.description,
    }, { headers: authHeader() });
  },

  updateProduct: (product) => {
    const url = API_URL + '/product/update';
    return axios.put(url, product, { headers: authHeader() });
  },

  uploadNewImage: (formData) => {
    const url = API_URL + '/product/add/image';
    // const url = process.env.REACT_APP_API_URL + '/product/add/image';

    axios.post(url, formData, { headers: authHeader() }).then(
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

    return axios.put(url, formData, { headers: authHeader() });
  },
};

export default productService;
