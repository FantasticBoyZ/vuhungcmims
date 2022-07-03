import authHeader from '@/services/authHeader';
import axiosClient from '@/utils/axiosCient';
import axios from 'axios';

const CategoryService = {
  getCategoryList: (params) => {
    const url = '/category';
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getCategoryDetail: (params) => {
    const url = `/category/${params.categoryId}`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  saveCategory: (category) => {
    const url = 'http://localhost:8080/api/category/add';

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
