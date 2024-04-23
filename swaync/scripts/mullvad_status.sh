if [[ $(mullvad status | head -n1 | awk '{print $1;}') != "Disconnected" ]]; then
    echo true
else
    echo false
fi