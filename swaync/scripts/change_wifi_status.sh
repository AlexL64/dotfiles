if [[ $SWAYNC_TOGGLE_STATE == true ]]; then
    nmcli radio wifi on
else
    nmcli radio wifi off
fi