import authHeader from '@/services/authHeader';
import axiosClient from '@/utils/axiosCient';

const CategoryService =  {
    getCategoryList: (params) => {
        const url = '/category';
        return axiosClient.get(url, {params, headers: authHeader()})
    }
}

export default CategoryService