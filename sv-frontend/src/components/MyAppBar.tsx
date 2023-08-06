import {Link, useNavigate} from "react-router-dom";
import {AppBar} from "@mui/material";
import {useDispatch, useSelector} from "react-redux";
import {setLoggedIn} from "../login_reducers.ts";

const MyAppBar = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
    const login: string = useSelector((state: {login: {login: string}}) => state.login.login)
    function logout() {
        dispatch(setLoggedIn(null))
        navigate("/")
    }
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
                {login ?
                    <>
                        <Link to="/orders" style={{textDecoration: "none", margin: "8px"}}>Orders</Link>
                        <a href="#" onClick={logout} style={{textDecoration: "none", margin: "8px"}}>Logout</a>
                    </>
                    :
                    <Link to="/login" style={{textDecoration: "none", margin: "8px"}}>Login</Link>
                }
            </div>
        </AppBar>
    )
}
export default MyAppBar
