import axios from 'axios'
const BASE_URL = 'http://localhost:3000/doctor';

export default axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json ' }
});