if status is-interactive
    # Commands to run in interactive sessions can go here
end


starship init fish | source





# My aliases

alias bw_search='bw list items --pretty --search'
alias wifi='nmtui'
alias 'pacman_clear'='yay -Qtdq | yay -Rns -'
alias 'pacman_clear_show_all'='yay -Qqd | yay -Rsu --print -'
alias 'pacman_clear_all'='yay -Qqd | yay -Rsu -'
alias battery='upower -i /org/freedesktop/UPower/devices/battery_BAT0'
alias disable_pad_while_typing='xinput set-prop "06CB0001:00 06CB:CE78 Touchpad" "libinput Disable While Typing Enabled"'




set -Ux PYENV_ROOT $HOME/.pyenv
set -U fish_user_paths $PYENV_ROOT/bin $fish_user_paths
set -U fish_user_paths $HOME/.pub-cache/bin $fish_user_paths

pyenv init - | source
