import authHeader from '@/services/auth-header';
import axiosClient from '@/utils/axiosCient';

const CategoryService =  {
    getAllCategory: (params) => {
        const url = '/category';
        return axiosClient.get(url, {params, headers: authHeader()})
    }
}

export default CategoryService