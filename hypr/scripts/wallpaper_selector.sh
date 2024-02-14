#!/bin/bash

# current=$(swww query | sed '/^image:$/,$!d')
# echo $current
wallpaper=$(ls ~/Wallpaper/ | while read A ; do  echo -en "$A\x00icon\x1f~/Wallpaper/$A\n" ; done | rofi -show -dmenu -theme $HOME/.config/rofi/themes/style.rasi)

# -select

swww img ~/Wallpaper/$wallpaper --transition-type grow --transition-pos bottom-right