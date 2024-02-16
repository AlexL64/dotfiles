#!/bin/sh

lines="HDMI-A-1,preferred,auto,auto,mirror,eDP-1\nHDMI-A-1,preferred,auto,auto\nHDMI-A-1,preferred,auto,1\nHDMI-A-1,preferred,auto,1.33\nHDMI-A-1,preferred,auto,1.6\nHDMI-A-1,preferred,auto,2"
config=$(printf $lines | rofi -dmenu -theme $HOME/.config/rofi/themes/monitor_config.rasi -p "Monitor 2 config")
hyprctl keyword monitor $config