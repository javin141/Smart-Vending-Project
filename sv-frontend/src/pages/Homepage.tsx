import {Button, Grid} from "@mui/material";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {VendingItem} from "../objs/VendingItem";
import {getItems} from "../vending";
import {Item} from "../components/VendingItem";
import {useSelector} from "react-redux";

const Onboarding = () => {
    return <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        <h1>Welcome to SmartVending!</h1>

        <div style={{display: "flex", flexDirection: "column"}}>
            <Link to="/login">
                <Button variant="contained">Login / Signup</Button>
            </Link>
        </div>
    </div>
}


const Shop = () => {
    // Credits to https://stackoverflow.com/a/66071205/12204281, CC by SA 4.0
    const [vendingItems, setVending] = useState<VendingItem[]>([])
    // Only load the vending items on page refresh, if not it will make a lot of GET requests
    useEffect(() => {

        let active = true
        void load() // We just want to execute the function, so no .then is required.
        return () => {
            active = false
        }
        async function load() {
            if (!active) { return }
            setVending(await getItems() ?? [])
            setTimeout(async () => {
                active = true
                await load()
                active = false
            }, 600000 /* 10 min */)
        }

    }, [])
    return (
        <>
            <h2 {...{align:"center"}}>Select a drink from our wide variety below:</h2>
        <Grid container style={{margin: 16, justifyContent:"center"}} >
            {vendingItems?.map((item) => {
                return <Item vendingItem={item}/>
            })}

            {vendingItems?.length == 0 ? "No items found" : null}
        </Grid>
            </>
    )
}


const Homepage = () => {
    const loggedIn = useSelector((state: {login: {login: string}}) => state.login.login)
    console.log("Logged in", loggedIn)
    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginLeft: "auto", marginRight: "auto"}}>

    {loggedIn ?
                <Shop/>
                :
                <Onboarding/>

            }
        </div>
    )
}
export default Homepage
