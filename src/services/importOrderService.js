import axiosClient from "@/utils/axiosCient";
import authHeader from "@/services/auth-header";

const importOrderService = {
  getImportOrderList: (params) => {
    const url = '/import-order/list';
    return axiosClient.get(url, { params, headers: authHeader() })
  }
}

export default importOrderService;
