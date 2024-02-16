#!/bin/sh

lines="Mirror\nScale Auto\nScale 100%\nScale 133%\nScale 160%\nScale 200%"
config=$(echo -e $lines | rofi -dmenu -theme $HOME/.config/rofi/themes/monitor_config.rasi -p "Monitor 2 config")

case $config in
"Mirror")
    config="HDMI-A-1,preferred,auto,auto,mirror,eDP-1"
    ;;
"Scale Auto")
    config="HDMI-A-1,preferred,auto,auto"
    ;;
"Scale 100%")
    config="HDMI-A-1,preferred,auto,1"
    ;;
"Scale 133%")
    config="HDMI-A-1,preferred,auto,1.3333333333"
    ;;
"Scale 160%")
    config="HDMI-A-1,preferred,auto,1.6"
    ;;
    "Scale 200%")
    config="HDMI-A-1,preferred,auto,2"
    ;;
*)
    ;;
esac

hyprctl keyword monitor $config
