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

    axios
      .post(url, {
        id: manufacturer.id,
        name: manufacturer.name,
        email: manufacturer.email,
        phone: manufacturer.phone,
        // TODO: sửa hardcode
        addressId: '1'
      })
      .then(
        (response) => {
          return response.data;
        },
        (error) => {
          console.log(error);
        },
      );
  },
};

export default ManufactorService;
