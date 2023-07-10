import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {createRoot} from "react-dom/client";
import Homepage from "./pages/Homepage";
import MyAppBar from "./components/MyAppBar";

const root = createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
        <div>
            <MyAppBar/>

            <div className="main">

            <Routes>
                <Route path="/" element={<Homepage/>}/>
                <Route path="/cart"/>
            </Routes>
            </div>
        </div>
    </BrowserRouter>

);
