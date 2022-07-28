
import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getProvinceList,
} from '@/slices/WarehouseSlice';


const GetProvince = () => {
    const dispatch = useDispatch();

    const [provinceList, setProvinceList] = useState([]);

    const getProvince = async (keyword) => {
        try {
            const actionResult = await dispatch(getProvinceList());
            const dataResult = unwrapResult(actionResult);
            if (dataResult.data) {
                setProvinceList(dataResult.data.province);
            }
            return dataResult.data
        } catch (error) {
            console.log('Failed to fetch setProvince list: ', error);
        }
    };


    useEffect(() => {
        getProvince()
    }, []);

    return provinceList
};

export default GetProvince
