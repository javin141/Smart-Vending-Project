import {Card, CardActionArea, CardContent} from "@mui/material";
import {Order} from "../services/orders.ts";
import {useEffect, useState} from "react";
import {getUnixTime} from "../services/utils.ts";

interface OrderProp {
    order: Order
    onClick: (order: Order) => void
}

const HOURS_24 = 86400

function reservationExpiringMsg(order: Order) {
    const timeNow = getUnixTime()
    const date = new Date();
    const diff = 86400 - (timeNow - order.time)

    date.setSeconds(diff);
    if (diff < 0) return "Order is in the future"
    else if (0 < diff && diff < HOURS_24) return `Reservation expiring in ${date.toISOString().slice(11, 19)}`
    else return "Reservation has expired. Subject to stock availability at machine."
}

const OrderCard = ({order, onClick}: OrderProp) => {
    const [expiringMsg, setExpiringMsg] = useState<string>("")


    function refreshTime() {
        setTimeout(() => {
            setExpiringMsg(reservationExpiringMsg(order))
            refreshTime()
        }, 1000)
    }

    useEffect(() => {
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
