# SmartVending
A fully managed solution for vending machine services.

Project for ET0735, DevOps for AIoT, Semester 1 2023.

## Usage
### Hardware (Raspberry Pi)
Install necessary libraries with `pip install -r src/requirements.txt`  
Launch the program on the Pi by executing `src/MachV2.sh`.

#### Docker
The image is up on Docker Hub (`czlucius/smartvending-hw`)

There are 2 versions:
- v2.1, the version that was ran on the Pi, where since the picam resolution was bad/blurry, we used an image file as source instead. This version has the email hardcoded.
- v2.1.1, an updated version. This version reads from PiCamera2 instead, and also uses `DEST_MAIL` as the destination email. Use `-e` to add this environment variable.

Run the following command to bring it online:  
Note: you will have to supply your own mail credentials. Currently this works with Zoho's SMTP server. Edit the file `src/mail.py` to modify the SMTP server, with `vim` after appending `bash` to the following command.

`docker run -it -v <DIRECTORY FOR PERSISTENCE>:/persist -v <TEMP_FILE_DIR FOR image>:/tmp -v /run/udev:/run/udev --env-file src/.env -e MAIL_ARR=<YOUR_EMAIL> -e MAIL_PW=<YOUR_EMAIL_PASSWORD> --privileged --device=/dev/vchiq:/dev/vchiq --privileged czlucius/smartvending-hw:<VERSION>`  

### Online (MERN)
- `cd` into `sv-backend`.
- Build the frontend with `npm run build-frontend`
- Building of backend is managed by Docker as a multi-stage build
  - Run `docker build -t <container name> .`
  - To run the container, `docker run <container name> -p 6788:6788 -e <MONGODB_URL> -e <JWT_KEY>`
  - Service will be exposed on port 6788.
  - WebSockets will be exposed on port 8765.


## Software Architecture description

### File structure and purpose
Purpose will be in (brackets)  
Directories are denoted with a trailing slash
- src/
  - hal/ (Hardware Abstraction Layer. https://github.com/czlucius/raspberry_hal/)
  - .env (Environment variables, added to gitignore)
  - .gitignore
  - antitheft_background.py (background program with thread to monitor break-ins)
  - breakin.py (program launched when break-in occurs)
  - camera.py (camera interfacing functions - all camera functionality is contained here)
  - dispense.py (dispensing program, contains functions for dispensing)
  - Inventory_Array.py (SQLite database file, contains functions pertaining data persistence)
  - keypad_interfacing.py (keypad interfacing, orchestration program used to prevent concurrency issues with keypad)
  - launch.py (launch file. called with command line arguments from MachV2.sh)
  - MachV2.sh (main script. helps to launch Python programs and restarts them when crash/exit with status code)
  - mail.py (email program - functions for sending email notifications) 
  - online.py (online program - launched when user wants to redeem online product)
  - payment2.py (payment program (physical))
  - requirements.txt (requirements for running the program)
  - selection.py (selection program, where users can select drinks)
  - statusfile
  - test_mail.py (test for mail)
  - utils.py (utility functions)
  - Vending.sqlite (vending SQLite database)
  - websocket_client.py (WebSockets client for online)
- sv-backend (backend in ExpressJS, interfacing with MongoDB on MongoDB Atlas)
- sv-frontend (frontend in ReactTS, single page application)

### Software Details
The software architecture of this project is described below.

The SmartVending project utilizes a combination of Python for the main vending machine program on the Raspberry Pi, Shell Script to launch and restart the Python programs, and JavaScript/TypeScript for the web-based interface, acting as a WebSocket server. This setup allows seamless communication between the vending machine and the website, enabling real-time updates and order handling.

### SQLite DB implementation
The Database on the Pi's side uses SQLite.  
Schema:
```
refcode integer,
drink_name text,
price integer,
slot text, (comma seperated ints)
stock text, (comma seperated ints)
redeemcodes text (JSON object)
```


#### WebSocket Details
The communication flow involves the Raspberry Pi (acting as the client) sending pings to the WebSocket server (the website), which responds with order notifications or updates to the stock. The website also initiates stock checks and allows users to place orders.

- Endpoint: 'checkstock'
  - Request: {"endpoint": "checkstock", "refcode": <item_refcode>}
  - Response: {"refcode": <item_refcode>, "name": <item_name>, "price": <item_price>, "stock": <item_stock_list>, "slots": <item_slot_list>}
  - This endpoint checks item availability using its reference code, providing details about the item, including name, price, stock, and available slots.

- Endpoint: 'placeorder'
  - Request: {"endpoint": "placeorder", "refcode": <item_refcode>}
  - Response: {"reservation_code": <generated_redemption_code>} or {"message": "No slots available for the chosen item."} (if no slot is available for the item)
  - This endpoint lets users place orders for items, generating a reservation code upon success or indicating unavailability if no slots are available.
 
- Endpoint: 'getinv'
  - Request: {"endpoint": "getinv"}
  - Response (Example): [(1, 'Coca-cola', 1.5, '1,2,3,4,5,6', '3,2,6,4,7,6', '[]'), (2, 'Sprite', 1.7, '7,8,9,10,11', '2,5,3,5,6', '[]')]
    - response is not deserialised and it is up to the endpoint consumer to deserialise it.
  - This endpoint gets all items in inventory, but items are not deserialised.
  
- Endpoint: 'chooseslot'
  - Request: {"endpoint": "chooseslot", "refcode": <item_refcode>}
  - Response: {"slot": <slot>}
  - This endpoint chooses a slot for an item.
 

### Raspberry Pi Thread Allocation
- Thread 1: Core Vending Machine Logic (main, starting thread)
- Thread 2: User Input Handling (Keypad)
- Thread 3: Web Interface Communication (WebSocket Client)
- Thread 4: Security and Monitoring (Break-in Detection)
- 
Note: after a user purchases the drink, the main selection logic is restarted on the current thread, which can be the keypad thread.
Threads can finish execution and be will not be used afterwards.

### Physical and Hardware
- The entry point of the program is at `src/MachV2.sh` on the Raspberry Pi.
  - It is a shell script which launches the corresponding features via `src/launch.py`.
 
- 16x2 LCD Display
  - Provides a clear and concise interface for users, showing item details, prices, and status messages, enhancing the user experience.

- Buzzer
  - Plays a vital role in alerting users about signaling successful transactions, and notifying users of break-ins.

- Keypad
  - Enables users to input selection details for physical orders, also serves as an access authorisation mechanism for authorized personnel, such as engineers.

- Camera
  - Utilized for scanning QR codes during online order collection. In case of any break-in attempts the camera captures images, providing valuable evidence.

- Potentiometer
  - Functions as a burglar detection sensor, detecting unauthorized access when the vending machine's door is opened without authorization.

- Servo
  - Acts as dispensing mechanism, the servo ensures precise and controlled delivery of items to users.

- RFID Reader
  - Enables secure payment transactions through RFID cards.

### Additional Features
- Alarm System for Break-ins.
  - In the event of a break-in, an alarm is triggered, sounding an alert and drawing attention to the unauthorized access attempt

- Email Alerts for Break-ins.
  - If someone attempts to force open the vending machine's door, an alert is sent via email to the designated engineer, accompanied by an image captured by the camera for evidence.

- Engineer access for maintenance purposes.
  - Engineers can access the vending machine using a designated code to restock or maintain the vending machine without trigerring the alarm. It can also be used to disable the alarm after a break-in.


