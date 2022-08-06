import axiosClient from '@/utils/axiosCient';
import authHeader from '@/services/authHeader';

const DashboardService = {
  getDashboardData: (params) => {
    const url = '/dashBoard/list';
    return axiosClient.get(url, { params, headers: authHeader() });
  },
};

export default DashboardService;
