if [[ $SWAYNC_TOGGLE_STATE == true ]]; then
    if [[ $(mullvad status | head -n1 | awk '{print $1;}') == "Disconnected" ]]; then
        mullvad connect
    fi
else
    if [[ $(mullvad status | head -n1 | awk '{print $1;}') != "Disconnected" ]]; then
        mullvad disconnect
    fi
fi
