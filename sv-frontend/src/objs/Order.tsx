import {Card, CardActionArea, CardContent} from "@mui/material";
import {Order} from "../services/orders.ts";
import {useEffect, useState} from "react";
import {getUnixTime} from "../services/utils.ts";

interface OrderProp {
    order: Order
    onClick: (order: Order) => void
}

const HOURS_24 = 86400


function secToHHMM(sec: number): string {
    const mins = Math.trunc(sec / 60)
    const hours = Math.trunc(mins / 60)
    const minsDisp = (mins % 60).toString().padStart(2, "0")
    return `${hours}:${minsDisp}`
}
function reservationExpiringMsg(order: Order) {
    const timeNow = getUnixTime()
    const diff = 86400 - (timeNow - order.time)

    if (diff < 0) return "Order is in the future"
    else if (0 < diff && diff < HOURS_24) return `Reservation expiring in ${secToHHMM(diff)}`
    else return "Reservation has expired. Subject to stock availability at machine."
}

const OrderCard = ({order, onClick}: OrderProp) => {
    const [expiringMsg, setExpiringMsg] = useState<string>("")


    function refreshTime() {
        setTimeout(() => {
            setExpiringMsg(reservationExpiringMsg(order))
            refreshTime()
        }, 60000)
    }

    useEffect(() => {
        setExpiringMsg(reservationExpiringMsg(order))
        refreshTime()
    })



    return (<Card variant="outlined" >
        <CardActionArea onClick={() => onClick(order)}>


        <CardContent>
            <h3>{order.name}</h3>
            ${order.price}
            <p>
            {expiringMsg}
            </p>

            <h6><i>Click to redeem</i></h6>
        </CardContent>
        </CardActionArea>
    </Card>)
}
export default OrderCard
