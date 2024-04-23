if [[ $(lenopow -s | grep -oP "(?<=Battery protection: ).*") == "ENABLED" ]]; then
    echo true
else
    echo false
fi