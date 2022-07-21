import { unwrapResult } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getWardList } from '@/slices/WarehouseSlice';


const GetWard = (districtId) => {
    const dispatch = useDispatch();

    const [wardList, setWardList] = useState([]);
    const getWard = async (keyword) => {
        try {
            const actionResult = await dispatch(getWardList({ districtId: districtId }));
            const dataResult = unwrapResult(actionResult);
            if (dataResult.data) {
                setWardList(dataResult.data.ward);
            }
        } catch (error) {
            console.log('Failed to fetch setWard list: ', error);
        }
    };

    useEffect(() => {
        if (districtId) {
            getWard()
        }
    }, [districtId]);

    return wardList
};

export default GetWard
