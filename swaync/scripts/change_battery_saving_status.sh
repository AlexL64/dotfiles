notify-send $SWAYNC_TOGGLE_STATE
if [[ $SWAYNC_TOGGLE_STATE == true ]]; then
    pkexec lenopow -e
else
    pkexec lenopow -d
fi