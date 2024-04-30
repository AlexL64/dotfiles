if status is-interactive
    starship init fish | source
end


alias 'pacman_clear'='yay -Qtdq | yay -Rns -'
alias 'pacman_clear_show_all'='yay -Qqd | yay -Rsu --print -'
alias 'pacman_clear_all'='yay -Qqd | yay -Rsu -'
alias 'ssh'='kitten ssh'
alias 'neofetch'='fastfetch'
# Created by `pipx` on 2024-03-15 15:11:17
set PATH $PATH /home/alex/.local/bin
