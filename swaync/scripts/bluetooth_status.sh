if [[ $(bluetoothctl show | grep -oP "(?<=Powered: ).*") == "yes" ]]; then
    echo true
else
    echo false
fi