if [[ $(mullvad status) != "Disconnected" ]]; then
    mullvad disconnect
else
    mullvad connect
fi