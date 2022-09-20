if status is-interactive
    # Commands to run in interactive sessions can go here
end


starship init fish | source





# My aliases

alias bw_search='bw list items --pretty --search'
alias wifi='sudo nmtui'
alias 'pacman_clear'='pacman -Qtdq | sudo pacman -Rns -'
alias battery='upower -i /org/freedesktop/UPower/devices/battery_BAT0'
