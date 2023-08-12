# SmartVending
A fully managed solution for vending machine services.

Project for ET0735, DevOps for AIoT, Semester 1 2023.

## Usage
### Hardware (Raspberry Pi)
Install necessary libraries with `pip install -r src/requirements.txt`  
Launch the program on the Pi by executing `src/MachV2.sh`.
### Online (MERN)
- `cd` into `sv-backend`.
- Build the frontend with `npm run build-frontend`
- Building of backend is managed by Docker as a multi-stage build
  - Run `docker build -t <container name> .`
  - To run the container, `docker run <container name> -p 6788:6788 -e <MONGODB_URL> -e <JWT_KEY>`
  - Service will be exposed on port 6788.


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


The software architecture of this project is described below.

### Physical

- The entry point of the program is at `src/MachV2.sh` on the Raspberry Pi.
  - It is a shell script which launches the corresponding features via `src/launch.py`.

