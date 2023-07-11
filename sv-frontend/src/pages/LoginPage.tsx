import {Box, Button, FormControl, Snackbar, TextField, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {Form} from "react-router-dom";
import {createRef, useRef, useState} from "react";
import {useNavigate} from "react-router-dom"
import {setCookie} from "../utils";
import {login, LoginResult, signup} from "../auth";

enum Login {
    LOGIN, SIGNUP
}


const LoginForm = () => {
    const navigate = useNavigate()

    const [errMsg, setErrMsg] = useState<string>(null)
    const [user, setUser] = useState()
    const [pw, setPw] = useState()


    async function loginCallback(event) {
        event.preventDefault()

        const loginResult: LoginResult = await login(user, pw, "Login failed")


        if (loginResult.success) {
            // event.target.setAttribute("autocomplete", "on");
            setErrMsg("Login successful")
            navigate("/")
        } else {
            setErrMsg(loginResult.errMsg ?? "Login failed")
        }
    }


    return (
        <form style={{display: "flex", flexDirection: "column"}} name="login-form" onSubmit={loginCallback}>
            <Snackbar open={!!errMsg}
                      autoHideDuration={6000}
                      message={errMsg}
                      onClose={() => setErrMsg(null)}/>
            <h2 style={{textAlign: "center"}}>Login to SmartVending</h2>

            <TextField required variant="filled" value={user} onChange={(event) => setUser(event.target.value)}
                       label="Username" style={{margin: "8px"}} type="text" ></TextField>

            <TextField required variant="filled" value={pw} onChange={(event) => setPw(event.target.value)}
                       label="Password" style={{margin: "8px"}} type="password" ></TextField>
            <Button type="submit">Login</Button>

        </form>)
}


const SignupForm = ( ) => {
    const navigate = useNavigate()
    const [signUser, setSignUser] = useState("")
    const [signPw, setSignPw] = useState("")
    const [signName, setSignName] = useState()
    const [errMsg, setErrMsg] = useState<string>(null)

    async function signupCallback(event) {
        event.preventDefault()
        const data = {
            username: signUser,
            password: signPw,
            name: signName
        }
        const signupResult: LoginResult = await signup(signUser, signPw, signName, "Signup failed")
        if (signupResult.success) {
            setErrMsg("Signup successful")
            navigate("/")
        } else {
            setErrMsg(signupResult.errMsg ?? "Signup failed")
        }
    }


    return (
        <form style={{display: "flex", flexDirection: "column"}} name="login-form" onSubmit={signupCallback}>
            <Snackbar open={!!errMsg}
                      autoHideDuration={6000}
                      message={errMsg}
                      onClose={() => setErrMsg(null)}/>
            <h2 style={{textAlign: "center"}}>Signup to SmartVending</h2>

            <TextField required variant="filled" value={signName} onChange={(event) => setSignName(event.target.value)}
                       label="Name" style={{margin: "8px"}} type="text" ></TextField>

            <TextField required variant="filled" value={signUser} onChange={(event) => setSignUser(event.target.value)}
                       label="Username" style={{margin: "8px"}} type="text" ></TextField>

            <TextField required variant="filled" value={signPw} onChange={(event) => setSignPw(event.target.value)}
                       label="Password" style={{margin: "8px"}} type="password" ></TextField>
            <Button type="submit">Signup</Button>

        </form>)
}



const LoginPage = () => {


    const [login, setLogin] = useState<Login>(Login.LOGIN)

    // TODO: This triggers PW manager regardless of login fail or pass. We need to trigger only on login pass.



    function handleSwitchState(event: React.MouseEvent<HTMLElement>, newState: Login | null) {
        setLogin(newState ?? Login.LOGIN)
    }


    return (<div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "auto",
        marginRight: "auto",
        flexDirection: "column"
    }}>

        {
            login == Login.LOGIN ?
                <LoginForm/>:
                <SignupForm/>
        }


        <ToggleButtonGroup value={login} exclusive onChange={handleSwitchState}>
            <ToggleButton value={Login.LOGIN}>
                Login
            </ToggleButton>
            <ToggleButton value={Login.SIGNUP}>
                Signup
            </ToggleButton>
        </ToggleButtonGroup>
    </div>)
}

export default LoginPage
