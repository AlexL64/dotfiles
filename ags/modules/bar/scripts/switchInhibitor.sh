if [[ $(pgrep -l hypridle) == "" ]]; then
    hypridle&
else
    killall hypridle
fi