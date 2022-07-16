import axiosClient from '@/utils/axiosCient';
import authHeader from '@/services/authHeader';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api'
// const API_URL = process.env.REACT_APP_API_URL
const exportOrderService = {
  getExportOrderList: (params) => {
    const url = '/export-order/list';
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getExportOrderById: (orderId) => {
    const url = `/export-order/detail/${orderId}`;
    return axiosClient.get(url, { headers: authHeader() });
  },

  getListConsignmentByExportOrderId: (params) => {
    const url = `/export-order/list-product-detail`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getListProductInStock: () => {
    const url = '/export-order/list-product';
    return axiosClient.get(url, { headers: authHeader() });
  },

  getListConsignmentOfProductInStock: (params) => {
    const url = '/export-order/list-quantity-instock'
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  createExportOrder: (exportOrder) => {
    const url = `${API_URL}/export-order/create`;
    // const url = process.env.REACT_APP_API_URL + '/export-order/create';
    // console.log(exportOrder);
    return axios.post(url, exportOrder);
  },

  confirmExportOrder: (params) => {
    const {exportOrderId, confirmUserId} = params
    const url = `/export-order/confirm/${exportOrderId}`;
    return axiosClient.get(url, { headers: authHeader() });
  },

  cancelExportOrder: (params) => {
    const {exportOrderId, confirmUserId} = params
    const url = `/export-order/cancel/${exportOrderId}`;
    return axiosClient.get(url, { headers: authHeader() });
  },

  updateExportOrder: (exportOrder) => {
    const url = `${API_URL}/export-order/update`;
    // const url = process.env.REACT_APP_API_URL + '/import-order/update';
    return axios.put(url, exportOrder)
  },

  getReturnOrderList: (params) => {
    const url = '/return-order/list';
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getReturnOrderDetail: (params) => {
    console.log(params)
    const url = `/return-order/detail`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  createReturnOrder: (returnOrder) => {
    const url = API_URL + `/return-order/create`;
    return axios.post(url, returnOrder);
  }
};

export default exportOrderService;
