#!/bin/sh

focused=$(hyprctl monitors | grep -oP '(?<=focused: ).*')
active=$(hyprctl monitors | grep -oP '(?<=active workspace: ).*(?= ())')

IFS=' ' read -r -a focused_array <<< $(echo $focused)
IFS=' ' read -r -a active_array <<< $(echo $active)

if [[ ${#focused_array[@]} > 1 ]]; then
    i=0
    for element in "${focused_array[@]}"
    do
        if [[ $element == "yes" ]]; then
            active_monitor=$i
        fi
        i=$((i+1))
    done

    if [[ $((active_monitor+1)) -le $((${#focused_array[@]}-1)) ]]; then
        hyprctl dispatch workspace ${active_array[$((active_monitor+1))]}
    else
        hyprctl dispatch workspace ${active_array[0]}
    fi
fi