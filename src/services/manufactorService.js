import authHeader from '@/services/auth-header';
import axiosClient from '@/utils/axiosCient';

const ManufactorService =  {
    getManufactorList: (params) => {
        const url = '/manufactor';
        return axiosClient.get(url, {params, headers: authHeader()})
    }
}

export default ManufactorService