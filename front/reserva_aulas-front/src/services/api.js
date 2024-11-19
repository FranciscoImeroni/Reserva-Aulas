import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // URL base de tu backend
});

export const fetchUsers = () => api.get("/users");
