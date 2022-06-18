import axiosClient from "@/utils/axiosCient";
import authHeader from "@/services/auth-header";

const importOrderService = {
  getListImportOrder: (params) => {
    const url = '/order/list';
    return axiosClient.get(url, { params, headers: authHeader() })
  }
}

export default importOrderService;
