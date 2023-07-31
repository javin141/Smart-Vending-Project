import {useEffect, useState} from "react";
import {getOrders, Order} from "../orders.ts";
import QRCode from 'react-qr-code';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid
} from "@mui/material";
import {Link} from "react-router-dom";
import OrderCard from "../objs/Order.tsx";



type DispatchOf<T> = React.Dispatch<React.SetStateAction<T>>

const RedemptionDialog = ({order, setOrder}: { order: Order|null, setOrder: DispatchOf<Order | null> }) => {


    return (
        <Dialog
            open={!!order} // whole dialog hidden
            onClose={() => setOrder(null)}
        >
            <DialogTitle id="alert-dialog-title">
                Redeem your drink: {order?.name}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Scan this QR code at the vending machine to redeem your drink.
                    <h6 style={{color: "lightgrey"}}>
                        Slot: {order?.slot}<br/>
                        Refcode {order?.refcode}<br/>
                        Price ${order?.price}<br/>

                    </h6>
                </DialogContentText>
                {order?.redeemCode ?
                    <QRCode
                        value={order.redeemCode}/> : <h4>Error: no redemption code found.</h4>}

            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOrder(null)}>OK</Button>
            </DialogActions>
        </Dialog>
    )
}



const OrderPage = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [redeem, setRedeem] = useState<Order | null>(null)
    const [err, setErr] = useState<string | null>(null)

    useEffect(() => {
        getOrders()
            .then(orders => {
                setOrders(orders)
            }).catch(reason => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
            setErr(reason.message)
            console.error("Error", reason)
        })
    }, [])

    function orderClicked(order: Order) {
        setRedeem(order)
    }


    return (
        <div style={{marginLeft: "auto", marginRight: "auto", padding: "16px"}}>
            <RedemptionDialog order={redeem} setOrder={setRedeem}/>


            {err ?
                <>
                    <h2>An error occurred</h2>
                    <h3>{err}</h3>
                    <Link to="/">Go to homepage</Link>
                </>
                :
                <>
                    <h2>Collect your orders now!</h2>
                    <Grid>
                        {orders.map(order => {
                            return <OrderCard order={order} onClick={orderClicked}/>
                        })}
                    </Grid>

                </>
            }
        </div>
    )
}

/*
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
 */
export default OrderPage
