!#/bin/sh

echo "Current in idle state, awaiting user command..."

while read command_state
do
    case $command_state in
        startup)    echo "entering startup"     
        while read startup_text
        do
            case $startup_text in
            /)  echo "returning"    ;;
            *)  echo "Unknown_Input"    break;;
        esac
        done;;
        config)     echo "entering config"      
        while read config_text
        do
            case $config_text in
            network)    ifconfig    ;;
            website)    echo "website status"   ;;
            stock)      python print_array.py   ;;
            *)          echo "Unknown Input"    ;;
            /)          echo "returning"        break;;
        esac
            done;;
        *)  exit ;;
        esac
            done



