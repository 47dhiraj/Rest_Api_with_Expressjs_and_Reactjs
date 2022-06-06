import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

import axios from '../api/axios';


import useLocalStorage from "../hooks/useLocalStorage";


const LOGIN_URL = '/auth';


const Login = () => {

    const { setAuth, persist, setPersist } = useAuth();                         


    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";                         

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useLocalStorage('user', '')                   

    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');


    useEffect(() => {
        userRef.current.focus();                

    }, [])                                     


    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])                             



    const handleSubmit = async (e) => {

        e.preventDefault();                     

        try {

            const response = await axios.post(LOGIN_URL,
                { username: user, password: pwd },          
            );

            console.log('Login Response : ', JSON.stringify(response?.data));

            const accessToken = response?.data?.accessToken;

            const role = response?.data?.roles;


            setAuth({ user, role, accessToken });

            setUser('');

            setPwd('');

            navigate(from, { replace: true });              

        } catch (err) {

            if (err.response?.status === 404) {
                setErrMsg('Bad Request.Login Failed')
            }

            if (err.message == "Network Error") {
                setErrMsg('Server can\'t be reached')
            }
            else if (err.response?.status == 400) {
                setErrMsg('Missing Credentials.');
            }
            else if (err.response?.status == 401) {
                setErrMsg('Incorrect Credentials or Unauthorized login');
            }
            else if (!err?.response) {
                setErrMsg('No Server Response');
            }
            else {
                setErrMsg('Login Failed')
            }

            errRef.current.focus();

        }

    }



    const togglePersist = () => {
        setPersist(prev => !prev);                 
    }

    useEffect(() => {
        localStorage.setItem("persist", persist);  
    }, [persist])                                   




    return (

        <section>

            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} style={{ textAlign: 'center' }} aria-live="assertive">{errMsg}</p>    

            <h1 style={{ textAlign: 'center' }}> Sign In </h1>

            <form onSubmit={handleSubmit}>

                <label htmlFor="username">Username:</label>                
                <input
                    type="text"
                    id="username"
                    placeholder='Enter username'
                    ref={userRef}
                    autoComplete="off"              
                    onChange={(e) => setUser(e.target.value)}
                    value={user}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    placeholder='Enter password'
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                />

                <button type="submit" disabled={!user || !pwd ? true : false}> Sign In </button>


                <div className="persistCheck" style={{ paddingTop: '7px' }}>
                    <input
                        type="checkbox"
                        id="persist"
                        checked={persist}
                        onChange={togglePersist}
                    />
                    <label htmlFor="persist"> Remember Me </label>
                </div>

            </form>

            <p>
                Need an Account ? <span className="line"><Link to="/register"> Sign Up </Link></span>
            </p>

        </section>

    )
}


export default Login
