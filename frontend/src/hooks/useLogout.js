import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "./useAuth";


const useLogout = () => {

    const { setAuth } = useAuth();

    const axiosPrivate = useAxiosPrivate();

    const logout = async () => {

        try {
            const response = await axiosPrivate.get('/logout');
            
            setAuth({});                                        

        } catch (err) {
            console.error(err);
        }

    }


    return logout;                 
}


export default useLogout