import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(response=>{
    if (response.status > 199 && response.status < 299){
      console.log('ok status');
    }
    else if (response.status > 299 && response.status < 399){
      console.log('move status');
      
    }
    else if (response.status > 399 && response.status < 499){
      console.log('client error status');
      
    }
    else if (response.status > 499){
      console.log('server error status');
    }
    return response
})

axiosInstance.interceptors.request.use(config=>{
  try {
    
    const userdata  =  localStorage.getItem('userData');
    const parsedUserData = JSON.parse(userdata);
    config.headers['Authorization'] = parsedUserData.token
    return config
  } catch (error) {
    return config
  }
})
export default axiosInstance;
