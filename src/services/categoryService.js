import axiosClient from '@/utils/axiosCient';
import React from 'react'
import authHeader from '@/services/auth-header';

const CategoryService =  {
    getAllCategory: (params) => {
        const url = '/category';
        return axiosClient.get(url, {params, headers: authHeader()})
    }
}

export default CategoryService