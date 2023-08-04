#!/bin/bash

echo "Current in idle state, awaiting user command..."

while read -r command_state
do
    case $command_state in
        startup) echo "entering startup"
                    running=true  
        while [ "$running" = "true" ]; do
            status="$(cat /etc/deeznuts/statusfile)"   # lucius go edit this file for the exit code you want
            if [ "$status" == 0 ]
            then
                echo "Running..."
            elif [ "$status" == 1 ]
            then 
                echo "Exit code 1, Restarting"
                python selection.py
            elif [ "$running" = "false" ]
            then
                echo "Exit code 2, Returning to main script"
                echo "input startup to restart payment.py"
            fi
            done  ;;
#       while read startup_text
#       do
#           case $startup_text in
#           /)  echo "returning"   
#            break;;
#           *)  echo "Unknown_Input";;
#       esac
#       done;; ' 
#       ignore this and remind tao to remove this before merging to main 🐋
        config)     echo "entering config"      
        while read -r config_text
        do
            case $config_text in
            network)    ifconfig    ;;
            website)    echo "website status"   ;;
            stock)      python print_array.py   ;;
            /)          echo "returning"    
            break;;
            *)          echo "Unknown Input"    ;;
        esac
            done;;
        *)  exit ;;
        esac
            done


