hl.on("hyprland.start", function()
    hl.exec_cmd("hyprpm reload")
    hl.exec_cmd("systemctl --user start hyprpolkitagent")
    hl.exec_cmd("hypridle")

    hl.exec_cmd("hyprctl setcursor catppuccin-mocha-mauve-cursors 24")
    hl.exec_cmd("xsetroot -xcf /usr/share/icons/catppuccin-mocha-mauve-cursors/cursors/left_ptr 24")
    hl.exec_cmd("wl-paste --type text --watch cliphist store")
    hl.exec_cmd("wl-paste --type image --watch cliphist store")
    hl.exec_cmd("echo 'Xft.dpi: 128' | xrdb -merge")

    hl.exec_cmd("nm-applet --indicator")
    hl.exec_cmd("blueman-applet")
    hl.exec_cmd("playerctld")
    hl.exec_cmd("udiskie")
    hl.exec_cmd("awww-daemon")
    hl.exec_cmd("quickshell")
    hl.exec_cmd("easyeffects --hide-window --service-mode")

    -- Very hacky way to fix issue with playerctl returning "No player is being controlled by playerctld"
    -- instead of just removing the mpris player when it is not attached to a player which break
    -- the player in quickshell (by making sure there is always a player) (I have no idea if there is a
    -- better way to do this but at least it works)
    hl.exec_cmd("python $HOME/.config/hypr/scripts/dummyPlayer.sh")
end)
