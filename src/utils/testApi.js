import axiosClient from "./axiosCient";

const testAPI = {
    getAllPost(){
        const url ='posts';
        return axiosClient.get(url)
    }
}

export default testAPI