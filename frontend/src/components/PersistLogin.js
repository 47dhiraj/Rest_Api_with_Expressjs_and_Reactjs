import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import useLogout from "../hooks/useLogout"

import useAuth from '../hooks/useAuth';
import useRefreshToken from '../hooks/useRefreshToken';



const PersistLogin = () => {

    const [isLoading, setIsLoading] = useState(true);

    const refresh = useRefreshToken();

    const logout = useLogout();

    const { auth, persist } = useAuth();



    useEffect(() => {

        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();                      
            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);     
            }
        }

        !auth?.accessToken && !auth?.role && persist                                          
            ? verifyRefreshToken()
            : !auth?.accessToken && !auth?.role && !persist ? logout() : setIsLoading(false)    

        return () => isMounted = false;

    }, [])           




    return (

        <>
            {
                !persist                       
                    ? <Outlet />
                    : isLoading
                        ? <p>Loading...</p>
                        : <Outlet />
            }
        </>

    )

}


export default PersistLogin
