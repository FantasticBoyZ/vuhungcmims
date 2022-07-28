import axiosClient from "@/utils/axiosCient";
import authHeader from "./authHeader";

const AddressService = {
  getProvince: (params) => {
    const url = `/province`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getDistrict: (params) => {
    const url = `/district/${params.provinceId}`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getWard: (params) => {
    const url = `/ward/${params.districtId}`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },
};

export default AddressService;
