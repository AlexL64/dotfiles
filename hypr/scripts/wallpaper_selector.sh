#!/bin/sh

current=$(basename $(swww query | grep -oP '(?<=image: ).*'))
wallpaper=$(ls ~/Wallpaper/ | while read A ; do  echo -en "$A\x00icon\x1f~/Wallpaper/$A\n" ; done | rofi -dmenu -theme $HOME/.config/rofi/themes/wallpaper_selector_style.rasi -select "$current") 

swww img ~/Wallpaper/$wallpaper --transition-type grow --transition-pos bottom-right