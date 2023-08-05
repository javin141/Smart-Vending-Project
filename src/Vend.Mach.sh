#!/bin/bash


while read -r command_state
do
    echo "Current in idle state, awaiting user command..."
    case $command_state in
        startup) echo "entering startup"
                    running=true  
        while [ "$running" = "true" ]; do
            status="$(cat /etc/smartvending/status)"
            if [ "$status" == 0 ]
            then
                echo "Running..."
                python3 launch.py -l selection
            elif [ "$status" == 8 ]
            then 
                echo "Exit code 1, Restarting"
                python3 launch.py -l selection
            elif [ "$status" == 9 ]
            then
                echo "Exit code 2, Returning to main script"
                echo "input startup to restart payment.py"
                running = false

            elif [ "$status" == 10 ]
            then
                echo "Exit code 3, launching burglar program"
                echo "Exit again with status 8 to return to vending program"
                python3 launch.py -l burglar
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


