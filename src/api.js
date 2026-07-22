import axios from 'axios';

const API = axios.create({
  baseURL: 'https://local-buisness-app-backend.onrender.com/api'
});

export default API;