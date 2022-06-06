import { Link } from "react-router-dom"


const Missing = () => {

    return (

        <article style={{ padding: "100px" }}>

            <h3>Oops! Page Not Found</h3>
            <br />
            
            <div className="flexGrow">
                <Link to="/">Go to Homepage</Link>
            </div>

        </article>

    )

}


export default Missing

