import axios from 'axios';

// 1. Axios 인스턴스를 생성합니다.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // .env 파일에 지정된 백엔드 주소
});

// 2. 요청 인터셉터(Request Interceptor)를 설정합니다.
//    -> 모든 API 요청이 보내지기 *전에* 이 코드가 실행됩니다.
apiClient.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰을 가져옵니다.
    const token = localStorage.getItem('authToken');
    
    // 토큰이 존재하면, Authorization 헤더에 자동으로 추가합니다.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // 요청 과정에서 에러가 발생하면 처리합니다.
    return Promise.reject(error);
  }
);

export default apiClient;