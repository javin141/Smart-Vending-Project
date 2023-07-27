import {createRoot} from 'react-dom/client'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Homepage from "./pages/Homepage";
import MyAppBar from "./components/MyAppBar";
import LoginPage from "./pages/LoginPage";
import {PayPage} from "./pages/PayPage";
import {Provider} from 'react-redux'
import OrderPage from "./pages/OrderPage.tsx";
import {configureStore} from "@reduxjs/toolkit";
import loginReducer, {localStorageMiddleware} from "./login_reducers.ts";

const root = createRoot(document.getElementById("root")!);

const store = configureStore({
    reducer: {login: loginReducer},
    middleware: (gDM) => gDM().concat(localStorageMiddleware)
})


root.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <MyAppBar/>

                <div className="main">

                    <Routes>
                        <Route path="/" element={<Homepage/>}/>
                        <Route path="/orders" element={<OrderPage/>}/>
                        <Route path="/login" element={<LoginPage/>}/>
                        <Route path="/pay" element={<PayPage/>}/>
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    </Provider>
);

export {store}
