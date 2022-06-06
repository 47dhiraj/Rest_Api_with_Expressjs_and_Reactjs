import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import useAxiosPrivate from "../hooks/useAxiosPrivate";


const Users = () => {

    const [users, setUsers] = useState();

    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {

        let isMounted = true;

        const getUsers = async () => {
            try {

                const response = await axiosPrivate.get('/users');

                console.log('All Users : ', response.data);

                isMounted && setUsers(response.data);

            } catch (err) {
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        getUsers();


        return () => {
            isMounted = false;
        }

    }, [])


    return (
        <article>
            <h2>Users List</h2>
            {
                users?.length
                    ? (
                        <ul>
                            {
                                users.map((user, i) => <li key={i}>{user?.username}</li>)
                            }
                        </ul>
                    ) : <p>No users to display</p>
            }
        </article>
    );
};


export default Users;