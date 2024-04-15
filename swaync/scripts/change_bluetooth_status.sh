if [[ $SWAYNC_TOGGLE_STATE == true ]]; then
    # rfkill unblock bluetooth
    bluetoothctl power on
else
    # rfkill block bluetooth
    bluetoothctl power off
fi