import {getTotalStock, VendingItem} from "../objs/VendingItem";
import {Card, CardActionArea, CardContent, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom"
export const Item = ({vendingItem}) => {
    const navigate = useNavigate()
    const stock: number = getTotalStock(vendingItem)
    if (!vendingItem.price || vendingItem.price < 0) {
        console.error("Vending price is invalid!")
        return null
    }
    let stockColor;
    if (stock < 5) {
        stockColor = {color: "#FF0000"}
    }
    function cardClicked() {
        navigate("/pay", {vendingItem})
    }
    return (
        <Card sx={{margin: 4}} variant="outlined" >
            <CardActionArea onClick={cardClicked}>
            <CardContent>
                <h2>{vendingItem.name}</h2>
                <h3>${vendingItem.price}</h3>
                <Typography sx={{ mb: 1.5, ...stockColor}} color="text.secondary">
                    {stock} items left
                </Typography>
                <div></div>
            </CardContent>
            </CardActionArea>
        </Card>
    )
}
