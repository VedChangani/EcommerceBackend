import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});
delete API.defaults.headers.common["Authorization"];

export const productImageUrl = (id) =>
  `http://localhost:8080/api/product/${id}/image`;

export default API;
