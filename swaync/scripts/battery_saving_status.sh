if [[ $(lenopow -s | grep -oP "(?<=Battery protection: ).*") == "ENABLED" ]]; then
    echo true
    notify-send "Battery Saving Enabled"
else
    echo false
    notify-send "Battery Saving Disabled"
fi