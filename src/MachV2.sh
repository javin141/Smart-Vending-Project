#!/bin/bash
echo "Running..."
whael=true
while $whael; do
while read -t 5 -n1 -r -p "Select state [r]un , [c]onfig : " command_state ;do
    case $command_state in
    r) echo "   Run"
            running=true  
            python selection.py
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
                echo "input startup to restart selection.py"
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