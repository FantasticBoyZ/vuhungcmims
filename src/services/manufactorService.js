import authHeader from '@/services/authHeader';
import axiosClient from '@/utils/axiosCient';
import axios from 'axios';

const ManufactorService = {
  getManufactorList: (params) => {
    const url = '/manufacturer';
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getManufacturerById: (id) => {
    const url = `/manufacturer/${id}`;
    return axiosClient.get(url, { headers: authHeader() });
  },
  saveManufacturer: (manufacturer) => {
    const url = 'http://localhost:8080/api/manufacturer/add';

    return axios
      .post(url, {
        id: manufacturer.id,
        name: manufacturer.name,
        email: manufacturer.email,
        phone: manufacturer.phone,
        provinceId: manufacturer.provinceId,
        districtId: manufacturer.districtId,
        wardId: manufacturer.wardId,
        addressDetail: manufacturer.addressDetail
      })
  },
};

export default ManufactorService;
