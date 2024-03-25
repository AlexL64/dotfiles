#!/bin/sh

battery=$(upower -i /org/freedesktop/UPower/devices/battery_BAT0 | grep -w 'percentage' | awk '{print $2}')
battery_state=$(upower -i /org/freedesktop/UPower/devices/battery_BAT0 | grep -w 'state' | awk '{print $2}')

if [[ $battery_state == "charging" ]]; then
    case ${battery::-2}0 in
    100)
        echo 󰂅 $battery
        ;;
    90)
        echo 󰂋 $battery
        ;;
    80)
        echo 󰂊 $battery
        ;;
    70)
        echo 󰢞 $battery
        ;;
    60)
        echo 󰂉 $battery
        ;;
    50)
        echo 󰢝 $battery
        ;;
    40)
        echo 󰂈 $battery
        ;;
    30)
        echo 󰂇 $battery
        ;;
    20)
        echo 󰂆 $battery
        ;;
    10)
        echo 󰢜 $battery
        ;;
    0)
        echo 󰢟 $battery
        ;;
    *)
        echo 󱐋 $battery
        ;;
    esac
else
    case ${battery::-2}0 in
    100)
        echo 󰁹 $battery
        ;;
    90)
        echo 󰂂 $battery
        ;;
    80)
        echo 󰂁 $battery
        ;;
    70)
        echo 󰂀 $battery
        ;;
    60)
        echo 󰁿 $battery
        ;;
    50)
        echo 󰁾 $battery
        ;;
    40)
        echo 󰁽 $battery
        ;;
    30)
        echo 󰁼 $battery
        ;;
    20)
        echo 󰁻 $battery
        ;;
    10)
        echo 󰁺 $battery
        ;;
    0)
        echo 󰂎 $battery
        ;;
    *)
        echo 󰂑 $battery
        ;;
    esac
fi
