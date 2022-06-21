import axiosClient from "@/utils/axiosCient";
import authHeader from "@/services/authHeader";

const importOrderService = {
  getImportOrderList: (params) => {
    const url = '/import-order/list';
    return axiosClient.get(url, { params, headers: authHeader() })
  },

  getImportOrderById: (params) => {
    const url = '/import-order/infor-detail';
    return axiosClient.get(url, { params, headers: authHeader() })
  }
}

export default importOrderService;
