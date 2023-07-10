import {Button} from "@mui/material";
import {Link} from "react-router-dom";

const Homepage = ({user}) => {


    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <h1>Welcome to SmartVending!</h1>

            <div style={{display: "flex", flexDirection: "column"}}>
                <Link to="/login">
                    <Button variant="contained">Login / Signup</Button>
                </Link>
            </div>
        </div>
    )
}
export default Homepage
