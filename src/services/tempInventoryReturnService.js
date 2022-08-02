import { API_URL } from "@/constants/apiUrl";
import axiosClient from "@/utils/axiosCient";
import axios from "axios";
import authHeader from "@/services/authHeader";

const tempInventoryReturnService = {
  createTempInventoryReturn: (tempInventoryReturn) => {
    const url = API_URL + '/returnToManufacturer/add';
    return axios.post(url, tempInventoryReturn, { headers: authHeader() });
  },

  getTempInventoryReturnList: (params) => {
    const url = '/returnToManufacturer';
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getTempInventoryReturnById: (tempInventoryReturnId) => {
    const url = `/returnToManufacturer/detail/${tempInventoryReturnId}`;
    return axiosClient.get(url, { headers: authHeader() });
  },

  updateTempInventoryReturn: (params) => {
    const { tempInventoryReturnId, tempInventoryReturn } = params;
    const url = API_URL + `/returnToManufacturer/update/${tempInventoryReturnId}`;
    return axios.put(url, tempInventoryReturn, { headers: authHeader() });
  },

  confirmTempInventoryReturn: (params) => {
    const { tempInventoryReturnId, userConfirmedId } = params;
    const url = `/returnToManufacturer/confirm/${tempInventoryReturnId}`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  cancelTempInventoryReturn: (params) => {
    const { tempInventoryReturnId, userDeleteId } = params;
    const url = `/returnToManufacturer/delete/${tempInventoryReturnId}`;
    return axiosClient.delete(url, { params, headers: authHeader() });
  },
};
export default tempInventoryReturnService;
