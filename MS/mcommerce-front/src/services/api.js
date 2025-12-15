import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9103",
});

export default api;
