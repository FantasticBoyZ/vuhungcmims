import axiosClient from '@/utils/axiosCient';
import authHeader from '@/services/authHeader';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api'
// const API_URL = process.env.REACT_APP_API_URL
const inventoryCheckingService = {
  
  getListInventoryChecking: (params) => {
    const url = `/inventoryCheckingHistory`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getProductByWarehouseId: (wareHouseId) => {
    const url = `/product/wareHouse/${wareHouseId}`;
    return axiosClient.get(url, {  headers: authHeader() });
  },

  getConsignmentByProductId: (productId) => {
    const url = `/product/consignment/${productId}`;
    return axiosClient.get(url, { headers: authHeader() });
  },

  getInventoryCheckingHistoryDetail: (inventoryCheckingHistoryId) => {
    const url = `/inventoryCheckingHistory/detail/${inventoryCheckingHistoryId}`;
    return axiosClient.get(url, { headers: authHeader() });
  },

  createInventoryChecking: (inventoryChecking) => {
    const url = `${API_URL}/inventoryCheckingHistory/add`;
    return axios.post(url, inventoryChecking);
  },
};

export default inventoryCheckingService;
