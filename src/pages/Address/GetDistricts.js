import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDistrictList } from '@/slices/WarehouseSlice';


const GetDistrict = (provinceId) => {
    const dispatch = useDispatch();

    const [districtList, setDistrictList] = useState([]);

    const getDistrict = async (keyword) => {
        try {
            const actionResult = await dispatch(getDistrictList({ provinceId: provinceId }));
            const dataResult = unwrapResult(actionResult);
            if (dataResult.data) {
                setDistrictList(dataResult.data.district);
            }
        } catch (error) {
            console.log('Failed to fetch setDistrict list: ', error);
        }
    };

    useEffect(() => {
        if (provinceId) {
            getDistrict()
        }
    }, [provinceId]);

    return districtList
};

export default GetDistrict
