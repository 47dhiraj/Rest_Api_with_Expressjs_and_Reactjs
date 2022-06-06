import { useNavigate, Link } from "react-router-dom";


import useLogout from "../hooks/useLogout"


const Home = () => {

    const navigate = useNavigate();

    const logout = useLogout();

    const signOut = async () => {

        await logout();

        navigate('/linkpage');
    }


    return (

        <section>

            <h1 style={{ textAlign: 'center' }}>In Home Page</h1>
            <br />

            <br />

            <Link to="/admin">Go to Admin page</Link>
            <Link to="/linkpage">Go to Link page</Link>

            <div className="flexGrow">
                <button onClick={signOut}> Sign Out </button>
            </div>

        </section>

    )
}

export default Home
