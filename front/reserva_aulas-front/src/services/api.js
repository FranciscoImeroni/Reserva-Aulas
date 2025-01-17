import axios from "axios";


const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;

const api = axios.create({
  baseURL: `${DOMAIN_BACK}`, // URL base de tu backend
});

export const fetchUsers = () => api.get("/users");
