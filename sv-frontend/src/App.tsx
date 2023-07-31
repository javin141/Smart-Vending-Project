import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Homepage from "./pages/Homepage";
import MyAppBar from "./components/MyAppBar";

function App() {
  const [count, setCount] = useState(0)

  return (
      <div style={{display: "flex", flexDirection: "column"}}>

      </div>
  )
}

export default App
