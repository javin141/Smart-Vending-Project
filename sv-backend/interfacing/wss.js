const {WebSocketServer} = require("ws")

const wssv = new WebSocketServer({ port: 8765 });

// const ws2 = require("ws")
let callbacksList = {}

wssv.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data) {
        console.log('received: %s', data);
        let index = 0
        const deleteIndices = []
        for (const i in callbacksList) {
            const shouldDelete = callbacksList[i](JSON.parse(data.toString()), i)
            if (shouldDelete) {
                deleteIndices.push(index)
            }
            index++
        }
        // Delete from the back so there won't be wrong deletions
        for (const i of deleteIndices.reverse()) {
            delete callbacksList[i]
        }
    });

    ws.send(JSON.stringify({endpoint: "helloworld"}));
});

console.log(wssv.clients)

function send(data) {
    if (wssv.clients.size === 1) {
        console.log(wssv.clients)
        for (const client of wssv.clients) {

            client.send(data)
            console.log("Data sent")
            break
        }

    } else {
        return null
    }
}

function helloworld() {
    for (const client of wssv.clients) {
        client.send(JSON.stringify({endpoint: "helloworld"}))
    }
}

function checkStockReq(refcode, callback, id) {
    const message = {
        endpoint: "checkstock",
        refcode: refcode.toString()
    }


    send(JSON.stringify(message))
    callbacksList[id] = callback
}

function getInventory(callback, id) {
    const message = {
        endpoint: "getinv"
    }
    send(JSON.stringify(message))
    callbacksList[id] = callback
}

function placeOrder(refcode, callback, id, slot) {
    const message = {
        endpoint: "placeorder",
        refcode: refcode.toString()
    }
    if (slot) {
        message.slot = slot
    }
    send(JSON.stringify(message))
    callbacksList[id] = callback
}


function findSlot(refcode, callback, id) {
    const message = {
        endpoint: "chooseslot",
        refcode: refcode.toString()
    }
    send(JSON.stringify(message))
    callbacksList[id] = callback
}



module.exports = {helloworld, checkStockReq, getInventory, placeOrder, findSlot}
