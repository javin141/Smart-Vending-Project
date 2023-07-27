import {Link} from "react-router-dom";
import {AppBar} from "@mui/material";

const MyAppBar = () => {
    return (
        <AppBar className="navBar" position="static" style={{
            color: "inherit",
            backgroundColor: "lightgray",
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
        }}>
            <img src="/assets/smartvending.png" width="40px" height="40px"
                 style={{display: "block", borderRadius: 99999999, margin: "8px 16px"}} alt="smartvending "/>
            <div className="navLinks" style={{
                marginLeft: "auto",
                marginRight: "16px"
            }}>
                <Link to="/" style={{textDecoration: "none", margin: "8px"}}>Home</Link>
                <Link to="/cart" style={{textDecoration: "none", margin: "8px"}}>Cart</Link>
                <Link to="/orders" style={{textDecoration: "none", margin: "8px"}}>Orders</Link>


            </div>
        </AppBar>
    )
}
export default MyAppBar
