import axios from "axios";
import authHeader from "./authHeader";
const API_URL = "http://localhost:8080/api/test/";
const getPublicContent = () => {
  return axios.get("http://localhost:8080/api/people/get-people", { headers: authHeader() });
};
const getUserBoard = () => {
  return axios.get("http://localhost:8080/api/people/get-people", { headers: authHeader() });
};
const getModeratorBoard = () => {
  return axios.get(API_URL + "mod", { headers: authHeader() });
};
const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};
const UserService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};
export default UserService;