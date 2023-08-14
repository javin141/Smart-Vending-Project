import asyncio 
import websockets
import json
import time

from websockets.exceptions import ConnectionClosedError

from Inventory_Array import get_item, update_item, choose_slot, get_all_not_deserialised


async def handle_order(websocket):
    async for message in websocket:
        data = json.loads(message)
        endpoint = data.get('endpoint')
        response = {"endpoint": endpoint}

        if endpoint == 'checkstock':
            refcode = data['refcode']
            item = get_item(refcode)
            response['refcode'] = item['refcode']
            response['name'] = item['name']
            response['price'] = item['price']
            response['stock'] = item['stock']
            response['slots'] = item['slots']
            response["redeemcodes"] = item["redeemcodes"]

        elif endpoint == 'placeorder':
            refcode = data['refcode']
            chosen_slot = data.get("slot")
            chosen_slot = chosen_slot if chosen_slot else choose_slot(refcode)

            if chosen_slot is None:
                response['message'] = 'No slots available for the chosen item.'
            else:
                # Generate the reservation code based on the current timestamp
                reservation_code = str(int(time.time()))
                response['reservation_code'] = reservation_code

                # Update the stock for the chosen item and slot
                item = get_item(refcode, True)
                print("log item", item)
                # {redeem: string, timestamp: string, slot: int}
                item["redeemcodes"].append({"redeem": reservation_code, "timestamp": str(int(time.time())), "slot": chosen_slot})
                update_item(refcode, item)

        elif endpoint == "getinv":
            print("Get drinks, not serialised.")
            response["data"] =  get_all_not_deserialised()
        elif endpoint == "chooseslot":
            response["slot"] = choose_slot(data["refcode"])

        elif endpoint == "helloworld":
            print("Hello World!")
            response = {"hello": "world"}

        await websocket.send(json.dumps(response))

async def start_websocket_client():
    server_url = "wss://smartvending-czlucius.koyeb.app/websockets"


    try:

        async with websockets.connect(server_url) as websocket:
            print(f'WebSocket client connected to {server_url}')
            await handle_order(websocket)
    except ConnectionClosedError:
        # Recursively call fn
        print("WSS Connection dropped, restarting")
        await start_websocket_client()



# Start the WebSocket client
asyncio.get_event_loop().run_until_complete(start_websocket_client())
asyncio.get_event_loop().run_forever()
