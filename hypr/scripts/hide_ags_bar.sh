#!/bin/sh

process=$(pgrep -a "ags" | grep "/bar/")
if pgrep -a "ags" | grep "/bar/" >/dev/null; then
    ags -b bar -q
    exit 0
fi

hyprctl dispatch exec "ags -c ~/.config/ags/modules/bar/config.js -b bar"
