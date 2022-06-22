import axiosClient from "@/utils/axiosCient";
import authHeader from "@/services/authHeader";

const importOrderService = {
  getImportOrderList: (params) => {
    const url = '/import-order/list';
    return axiosClient.get(url, { params, headers: authHeader() })
  },

  getImportOrderById: (orderId) => {
    const url = `/import-order/detail/${orderId}`;
    return axiosClient.get(url, {  headers: authHeader() })
  }
}

export default importOrderService;
