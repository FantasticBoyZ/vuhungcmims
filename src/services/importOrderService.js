import axiosClient from '@/utils/axiosCient';
import authHeader from '@/services/authHeader';
import axios from 'axios';

const importOrderService = {
  getImportOrderList: (params) => {
    const url = '/import-order/list';
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getImportOrderById: (orderId) => {
    const url = `/import-order/detail/${orderId}`;
    return axiosClient.get(url, { headers: authHeader() });
  },

  createImportOrder: (importOrder) => {
    const url = 'http://localhost:8080/api/import-order/create';
    // const url = process.env.REACT_APP_API_URL + '/import-order/create';
    // console.log(importOrder);
    return axios.post(url, {
      billReferenceNumber: importOrder.billReferenceNumber,
      createdDate: importOrder.createdDate,
      description: importOrder.description,
      userId: importOrder.userId,
      manufactorId: importOrder.manufactorId,
      // wareHouseId: '',
      wareHouseId: importOrder.wareHouseId,
      consignmentRequests: importOrder.consignmentRequests,
    });
  },

  confirmImportOrder: (params) => {
    const {importOrderId, confirmUserId} = params
    const url = `/import-order/confirm/${importOrderId}/${confirmUserId}`;
    return axiosClient.get(url, { headers: authHeader() });
  },

  cancelImportOrder: (params) => {
    const {importOrderId, confirmUserId} = params
    const url = `/import-order/cancel/${importOrderId}`;
    return axiosClient.get(url, { headers: authHeader() });
  },

  updateImportOrder: (importOrder) => {
    const url = `http://localhost:8080/api/import-order/update`;
    // const url = process.env.REACT_APP_API_URL + '/import-order/update';
    return axios.put(url, importOrder)
  },
};

export default importOrderService;
