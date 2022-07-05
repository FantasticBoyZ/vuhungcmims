import axiosClient from '@/utils/axiosCient';
import authHeader from '@/services/authHeader';
import axios from 'axios';

const exportOrderService = {
  getExportOrderList: (params) => {
    const url = '/export-order/list';
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getExportOrderById: (orderId) => {
    const url = `/export-order/detail/${orderId}`;
    return axiosClient.get(url, { headers: authHeader() });
  },

  createExportOrder: (exportOrder) => {
    const url = 'http://localhost:8080/api/export-order/create';
    // const url = process.env.REACT_APP_API_URL + '/export-order/create';
    // console.log(exportOrder);
    return axios.post(url, {
      billReferenceNumber: exportOrder.billReferenceNumber,
      createdDate: exportOrder.createdDate,
      description: exportOrder.description,
      userId: exportOrder.userId,
      manufactorId: exportOrder.manufactorId,
      // wareHouseId: '',
      wareHouseId: exportOrder.wareHouseId,
      consignmentRequests: exportOrder.consignmentRequests,
    });
  },
};

export default exportOrderService;