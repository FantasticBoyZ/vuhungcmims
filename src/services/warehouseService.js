import authHeader from '@/services/authHeader';
import axiosClient from '@/utils/axiosCient';
import axios from 'axios';

const WarehouseService = {
    getWarehouseList: (params) => {
        const url = '/warehouse';
        return axiosClient.get(url, { params, headers: authHeader() });
    },

    getWarehouseDetail: (params) => {
        const url = `/warehouse/${params}`;
        return axiosClient.get(url, params);
    },

    addWarehouse: (params) => {
        const url = `http://localhost:8080/api/warehouse/add`;
        return axios.post(url, params);
    },

    deleteWarehouse: (params) => {
        const url = `/warehouse/delete/${params}`;
        return axiosClient.delete(url, params);
    },

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

export default WarehouseService;
