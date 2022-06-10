import axiosClient from "@/utils/axiosCient";

const productService = {
    getAllProduct: (params) => {
        const url = '/products';
        return axiosClient.get(url, {params})
    },

    getProductById: (id) => {
        const url = `/products/${id}`;
        return axiosClient.get(url)
    }
}

export default productService;
