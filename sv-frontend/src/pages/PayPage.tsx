import {useState} from "react";
import {getCookie} from "../utils";
import {TextField} from "@mui/material";
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import ReactCreditCards, {Focused} from "react-credit-cards-2";


function formatExpiry(expiry: string): string {
    const val = expiry.replace(/\D+/, '')
    if (val.length >= 3) {
        let mo = val.slice(0, 2)
        if (Number(mo) > 12) {
            mo = "12"
        }
        return `${mo}/${val.slice(2, 4)}`
    } else {
        return val
    }

}


function formatCvv(cvv: string): string {
    const val = cvv.replace(/\D+/, '')

    if (val.length >= 3) {
        return val.slice(0, 3)
    } else {
        return val
    }
}
export const PayPage = () => {
    const [cardNo, setCardNo] = useState("")
    const [name, setName] = useState(getCookie("NAME") ?? "")
    const [exp, setExp] = useState<string>("")
    const [cvv, setCvv] = useState("")
    const [focus, setFocus] = useState<Focused>("name")


    function handleInputFocus (e) {
        setFocus(e.target.name)
    }
    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "auto", marginRight: "auto"}}>
            <h2 align="center">Please pay for your item.</h2>
            <div style={{margin: 16}}>
            <ReactCreditCards
                cvc={cvv}
                name={name}
                number={cardNo}
                expiry={exp}
                focused={focus}
            />
            </div>

            <TextField label="Name" type="text" value={name} onChange={(event) => {setName(event.target.value)}} style={{margin:8, width:300}} name="name" onFocus={handleInputFocus}/>
            <TextField label="Card Number" type="text" value={cardNo} onChange={(event) => {setCardNo(event.target.value)}} style={{margin:8, width:300}} name="number" onFocus={handleInputFocus}/>

            <div style={{display: "flex", flexDirection: "row", width:300}}>
            <TextField label="Valid thru" type="text" value={exp} onChange={(event) => {setExp(formatExpiry(event.target.value))}} style={{marginTop: 8}} name="expiry" onFocus={handleInputFocus}/>
                <TextField label="CVV" type="password" value={cvv} onChange={(event) => {setCvv(formatCvv(event.target.value))}} style={{marginTop:8, maxWidth: 100}} name="cvc" onFocus={handleInputFocus}/>

            </div>
        </div>
    )
}
