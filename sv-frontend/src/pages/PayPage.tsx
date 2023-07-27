import React, {useEffect, useState} from "react";
import {getCookie} from "../utils";
import {
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from "@mui/material";
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import ReactCreditCards, {Focused} from "react-credit-cards-2";
import {useLocation, useNavigate} from "react-router-dom";
import {VendingItem} from "../objs/VendingItem.ts";
import {CardDetails} from "../auth.ts";
import {payFor} from "../vending.ts";


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

interface DialogDetails {
    title: string
    message: string
    action: string
    actionCode: DialogAction
}

enum DialogAction {
    NO_ITEM, PAYMENT_ERR, PAYMENT_SUCCESS
}

export const PayPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        const state = location.state as { vendingItem?: VendingItem }
        if (!state || !state.vendingItem) {
            setDialog({
                title: "No item selected",
                message: "Please select an item from the homepage before paying",
                action: "Go to Homepage",
                actionCode: DialogAction.NO_ITEM
            })
        } else {
            setItem(state.vendingItem)
        }
    }, [location.state])


    const [cardNo, setCardNo] = useState("")
    const [name, setName] = useState(getCookie("NAME") ?? "")
    const [exp, setExp] = useState<string>("")
    const [cvv, setCvv] = useState<string>()
    const [focus, setFocus] = useState<Focused>("name")

    const [item, setItem] = useState<VendingItem>()


    const [dialog, setDialog] = useState<DialogDetails|null>(null)


    function handleInputFocus(e: React.FocusEvent<HTMLInputElement>) {
        setFocus((e.target.name as unknown) as Focused ?? "")
    }

    function getCardDetails(): CardDetails {
        return {
            owner: name, cardNumber: cardNo, cvv: Number(cvv), expDate: exp, bankCode: "myBank"
        }
    }

    function checkout() {
        payFor(item!, getCardDetails())
            .then(result => {
                
            })
            .catch(reason => {
                // An error has occured.
                setDialog({
                    title: "Error",
                    message: reason,
                    action: "Try again",
                    actionCode: DialogAction.PAYMENT_ERR
                })
            })


    }

    function dialogAction() {
        switch (dialog?.actionCode) {
            case DialogAction.NO_ITEM:
                navigate("/")
                break
            case DialogAction.PAYMENT_ERR:
                break
            case DialogAction.PAYMENT_SUCCESS:
                navigate("/")
        }
    }

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
            marginRight: "auto"
        }}>

            <Dialog
                open={!!dialog}
                onClose={() => setDialog(null)}
            >
                <DialogTitle id="alert-dialog-title">
                    {dialog?.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialog?.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={dialogAction}>{dialog?.action}</Button>
                </DialogActions>
            </Dialog>
            <>
                <h2 style={{textAlign: "center"}}>Please pay for your item.</h2>

                <div style={{display: "flex", flexDirection: "column"}}>

                    <Card sx={{height: "fit-content"}}>
                        <CardContent>
                            <h3>Your purchase</h3>
                            <div style={{display: "flex"}}>
                                <div>
                                    {item?.name}
                                </div>
                                <div style={{marginLeft: "auto"}}>
                                    ${item?.price}
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{margin: 16}}>
                            <ReactCreditCards
                                cvc={cvv ?? ""}
                                name={name}
                                number={cardNo}
                                expiry={exp}
                                focused={focus}
                            />
                        </div>

                        <TextField label="Name" type="text" value={name} onChange={(event) => {
                            setName(event.target.value)
                        }} style={{margin: 8, width: 300}} name="name" onFocus={handleInputFocus}/>
                        <TextField label="Card Number" type="text" value={cardNo} onChange={(event) => {
                            setCardNo(event.target.value)
                        }} style={{margin: 8, width: 300}} name="number" onFocus={handleInputFocus}/>

                        <div style={{display: "flex", flexDirection: "row", width: 300, marginLeft: 8,}}>
                            <TextField label="Valid thru" type="text" value={exp} onChange={(event) => {
                                setExp(formatExpiry(event.target.value))
                            }} style={{marginTop: 8}} name="expiry" onFocus={handleInputFocus}/>
                            <TextField label="CVV" type="password" value={cvv} onChange={(event) => {
                                setCvv(formatCvv(event.target.value))
                            }} style={{marginTop: 8, maxWidth: 100}} name="cvc" onFocus={handleInputFocus}/>

                        </div>

                        <Button style={{margin: 8}} onClick={checkout}>Checkout</Button>
                    </div>
                </div>
            </>
        </div>
    )
}
