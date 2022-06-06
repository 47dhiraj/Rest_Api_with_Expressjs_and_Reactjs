import axios from '../api/axios';
import useAuth from './useAuth';



const useRefreshToken = () => {

    const { setAuth } = useAuth();


    const refresh = async () => {

        const response = await axios.get('/refresh');

        setAuth(prev => {
            return {
                ...prev,
                role: response?.data?.roles,
                accessToken: response?.data?.accessToken                
            }
        });


        return response?.data?.accessToken;                             
    }


    return refresh;                

};

export default useRefreshToken;
