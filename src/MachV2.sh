#!/bin/bash
echo "Running..."
whael=true
while $whael; do
while read -t 5 -n1 -r -p "Select state [r]un , [c]onfig : " command_state ||command_state="r" ;do
    case $command_state in
    r) echo "   Run"
            running=true
            echo 0 > ./statusfile # Ensure status is empty
        while [ "$running" = "true" ]; do
            status="$(cat ./statusfile)"   # lucius go edit this file for the exit code you want
            if [ "$status" == 0 ]
            then
                echo "Running..."
                python3 ./launch.py -l selection
                echo "Run ended"
            elif [ "$status" == 1 ]
            then 
                echo "Exit code 1, Restarting"
                python3 launch.py -l selection
            elif [ "$status" == 10 ]
            then
                echo "Exit code 10, burglar!"
                python3 launch.py -l burglar
            elif [ "$status" == 11 ]
            then
                echo "Exit code 11, online"
                python3 launch.py -l online
            elif [ "$running" = "false" ]
            then
                echo "Else, Returning to main script"
                echo "input r to restart selection.py"
            fi
            done  ;;
    c)  echo -e "\nEnterin Config..."
        while read -n1 -r -p "[n]etwork , [w]ebsite , [s]tock :" config_text; do
            case $config_text in
            n)    ifconfig    ;;
            w)    echo "website status"   ;;
            s)    python print_array.py   ;;
            /)          echo -e "\nreturning"    
            break;;
            *)          echo "huh"    ;;
        esac
            done;;
    q)  whael=false
        break;;

    *) echo "   huh";;
    esac
done
echo "timeout lmaeo"
#python selection.py
# Uncomment the above statement when the time is right...
done