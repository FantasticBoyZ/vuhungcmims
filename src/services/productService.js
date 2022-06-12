import axiosClient from "@/utils/axiosCient";
import authHeader from "@/services/auth-header";

const productService = {
    getAllProduct: (params) => {
        const url = '/product';
        return axiosClient.get(url, {params, headers: authHeader()})
    },

    getProductById: (id) => {
        const url = `/products/${id}`;
        return axiosClient.get(url, { headers: authHeader() })
    }
}

export default productService;
