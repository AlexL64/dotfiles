if [[ $(bluetoothctl show | grep -oP "(?<=Powered: ).*") == "yes" ]]; then
    bluetoothctl power off
else
    bluetoothctl power on
fi