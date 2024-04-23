if [[ $SWAYNC_TOGGLE_STATE == true ]]; then
    if [[ $(nmcli radio wifi) == "disabled" ]]; then
        nmcli radio wifi on
    fi
else
    if [[ $(nmcli radio wifi) == "enabled" ]]; then
        nmcli radio wifi off
    fi
fi
