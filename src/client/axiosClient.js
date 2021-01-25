import axios from 'axios';


const client = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL,
});

client.interceptors.request.use(
    (config) => {
      let token = localStorage.getItem('user_token');
  
      if (token) {
        config.headers['Authorization'] = `Bearer ${ token }`;
      }
  
      return config;
    }, 
  
    (error) => {
      return Promise.reject(error);
    }
);

export {client}