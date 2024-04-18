#!/bin/sh

for i in {0..25}
do
  echo $(($RANDOM % 10))
done

current=$(basename $(swww query | grep -oP '(?<=image: ).*'))
wallpaper=$(ls ~/Wallpaper/ | while read A; do echo -en "$A\x00icon\x1f~/Wallpaper/$A\n"; done | rofi -dmenu -theme $HOME/.config/rofi/themes/wallpaper_selector_style.rasi -select "$current")

case $(($RANDOM % 2)) in
0)
    type="grow"
    ;;
1)
    type="outer"
    ;;
*) ;;
esac

case $(($RANDOM % 10)) in
0)
    pos="center"
    ;;
1)
    pos="bottom"
    ;;
2)
    pos="top"
    ;;
3)
    pos="left"
    ;;
4)
    pos="right"
    ;;
5)
    pos="bottom-right"
    ;;
6)
    pos="bottom-left"
    ;;
7)
    pos="top-right"
    ;;
8)
    pos="top-left"
    ;;
9)
    pos="top-right"
    ;;
*) ;;
esac

swww img ~/Wallpaper/$wallpaper --transition-type $type --transition-pos $pos
