import { API_URL } from '@/constants/apiUrl';
import authHeader from '@/services/authHeader';
import axiosClient from '@/utils/axiosCient';
import axios from 'axios';

// const API_URL = 'http://localhost:8080/api'
// const API_URL = process.env.REACT_APP_API_URL
const CategoryService = {
  getCategoryList: (params) => {
    const url = '/category';
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getSubCategoryByCategoryId: (params) => {
    const url = '/subCategory';
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getCategoryDetail: (params) => {
    const url = `/category/${params.categoryId}`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  saveCategory: (category) => {
    const url = API_URL + '/category/add';
    // const url = process.env.REACT_APP_API_URL + '/category/add'
    axios
      .post(url, {
        id: category.id,
        name: category.name,
        description: category.description,
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

export default CategoryService;
