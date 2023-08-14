import {createSlice, Middleware} from "@reduxjs/toolkit";
import {getCookie, removeCookie, setCookie} from "./services/utils.ts";


const loginSlice = createSlice({
    name: "login",
    initialState: {
        login: getCookie("SESSION"),
        name: getCookie("NAME")
    },
    reducers: {
        setLoggedIn(state, action) {
            state.login = action.payload ? action.payload as string : null
        },
        setName(state, action) {
            state.name = action.payload ? action.payload as string : null
        }
    }
})

export interface LoginState {
    login: string
    name: string
}
const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
    console.log('dispatching', action)
    const result = next(action) as string
    console.log('next state', store.getState())
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const state = store.getState() as {login: {login: string, name: string}}
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (state.login.login) {
        setCookie("SESSION", state.login.login)
    } else {
        removeCookie("SESSION")
    }
    if (state.login.name) {
        setCookie("NAME", state.login.name)
    } else {
        removeCookie("NAME")
    }
    return result
}

export const {setLoggedIn} = loginSlice.actions
export default loginSlice.reducer

export {localStorageMiddleware}
