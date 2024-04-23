if [[ $SWAYNC_TOGGLE_STATE == true ]]; then
    if [[ $(lenopow -s | grep -oP "(?<=Battery protection: ).*") == "DISABLED" ]]; then
        pkexec lenopow -e
    fi
else
    if [[ $(lenopow -s | grep -oP "(?<=Battery protection: ).*") == "ENABLED" ]]; then
        pkexec lenopow -d
    fi
fi
