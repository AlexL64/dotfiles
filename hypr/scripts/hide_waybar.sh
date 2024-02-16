#!/bin/sh

# Check if waybar is already running
if pgrep -x "waybar" >/dev/null; then
    pkill -x "waybar"
    exit 0
fi

hyprctl dispatch exec waybar