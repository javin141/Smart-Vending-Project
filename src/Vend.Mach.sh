#!/bin/bash

echo "Current in idle state, awaiting user command..."

while read -r command_state
do
    case $command_state in
        startup) echo "entering startup"
                    running=true
                    status=0
        while [ "$running" = "true" ]; do
           echo $status

            if [ "$status" == 0 ]
            then
                echo "Running..."
                python3 launch.py -l selection
            elif [ "$status" == 1 ]
            then
                echo "ERROR! Exit with status 1"
                echo "Restarting with status 0..."

            elif [ "$status" == 8 ]
            then 
                echo "Exit code 8, Restarting"
                python3 launch.py -l selection
            elif [ "$status" == 9 ]
            then
                echo "Exit code 9, Returning to main script"
                echo "input startup to restart payment.py"
                running = false

            elif [ "$status" == 10 ]
            then
                echo "Exit code 10, launching burglar program"
                echo "Exit again with status 8 to return to vending program"
                python3 launch.py -l burglar
            fi

            status=$?

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
    echo "Current in idle state, awaiting user command..."

done


