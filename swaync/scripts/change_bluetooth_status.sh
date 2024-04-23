if [[ $SWAYNC_TOGGLE_STATE == true ]]; then
    if [[ $(bluetoothctl show | grep -oP "(?<=Powered: ).*") == "no" ]]; then
        bluetoothctl power on
    fi
else
    if [[ $(bluetoothctl show | grep -oP "(?<=Powered: ).*") == "yes" ]]; then
        bluetoothctl power off
    fi
fi
