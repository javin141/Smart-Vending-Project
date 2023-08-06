import asyncio 
import websockets
import json
import time

from Inventory_Array import get_item, update_item, choose_slot

async def handle_order(websocket):
    async for message in websocket:
        data = json.loads(message)
        endpoint = data.get('endpoint')
        response = {}

        if endpoint == 'checkstock':
            refcode = data['refcode']
            item = get_item(refcode)
            response['refcode'] = item['refcode']
            response['name'] = item['name']
            response['price'] = item['price']
            response['stock'] = item['stock']
            response['slots'] = item['slots']

        elif endpoint == 'placeorder':
            refcode = data['refcode']
            chosen_slot = choose_slot(refcode)

            if chosen_slot is None:
                response['message'] = 'No slots available for the chosen item.'
            else:
                # Generate the reservation code based on the current timestamp
                reservation_code = str(int(time.time()))
                response['reservation_code'] = reservation_code

                # Update the stock for the chosen item and slot
                item = get_item(refcode)
                slot_index = item['slots'].index(chosen_slot)
                item['stock'][slot_index] -= 1
                update_item(refcode, item)

        await websocket.send(json.dumps(response))

async def start_websocket_client():
    server_address = 'your_website_address'  # Change to website's WebSocket server address
    server_port = 8765  # Change to website's WebSocket server port

    async with websockets.connect(f'ws://{server_address}:{server_port}') as websocket:
        print(f'WebSocket client connected to ws://{server_address}:{server_port}')
        await handle_order(websocket)

# Start the WebSocket client
asyncio.get_event_loop().run_until_complete(start_websocket_client())
asyncio.get_event_loop().run_forever()
