import { Link } from "react-router-dom"


const LinkPage = () => {

    return (

        <section>

            <h1 style={{ textAlign: 'center' }}>All the Links</h1>

            <br />

            <h2 style={{ textAlign: 'center' }}>Public Links</h2>
            <Link to="/login">Login Page</Link>
            <Link to="/register">Register Page</Link>

            <br />

            <h2 style={{ textAlign: 'center' }}>Private Links</h2>
            <Link to="/">Home Page</Link>
            <Link to="/admin">Admin Page</Link>

        </section>

    )

}


export default LinkPage

