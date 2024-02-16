#!/bin/sh

lines="Mirror\nScale Auto\nScale 1\nScale 1.33\nScale 1.6\nScale 2"
config=$(echo -e $lines | rofi -dmenu -theme $HOME/.config/rofi/themes/monitor_config.rasi -p "Monitor 2 config")

case $config in
"Mirror")
    config="HDMI-A-1,preferred,auto,auto,mirror,eDP-1"
    ;;
"Scale Auto")
    config="HDMI-A-1,preferred,auto,auto"
    ;;
"Scale 1")
    config="HDMI-A-1,preferred,auto,1"
    ;;
"Scale 1.33")
    config="HDMI-A-1,preferred,auto,1.33"
    ;;
"Scale 1.6")
    config="HDMI-A-1,preferred,auto,1.6"
    ;;
    "Scale 2")
    config="HDMI-A-1,preferred,auto,2"
    ;;
*)
    ;;
esac

hyprctl keyword monitor $config
