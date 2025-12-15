import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:9103",
  headers: {
    "Content-Type": "application/json"
  }
});
