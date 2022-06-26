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
    console.log(importOrder);
    return axios.post(url, {
      billReferenceNumber: importOrder.billReferenceNumber,
      createdDate: importOrder.createdDate,
      description: importOrder.description,
      userId: importOrder.userId,
      manufactorId: importOrder.manufactorId,
      // warehourseId: '',
      inventoryId: importOrder.inventoryId,
      consignmentRequests: importOrder.consignmentRequests,
    });
  },
};

export default importOrderService;
