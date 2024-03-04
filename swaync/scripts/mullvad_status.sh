if [[ $(mullvad status) != "Disconnected" ]]; then
    echo true
else
    echo false
fi