!#/bin/sh

echo "Current in idle state, awaiting user command..."

while read command_state
do
    case $command_state in
        startup)    echo "entering startup"  
                    python selection.py
        while read startup_text
        do
            case $startup_text in
            /)  echo "returning"   
             break;;
            *)  echo "Unknown_Input";;
        esac
        done;;  
        config)     echo "entering config"      
        while read config_text
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


