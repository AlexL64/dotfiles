-- General
hl.bind("SUPER + L", hl.dsp.exec_cmd("hyprlock"), { description = "General | SUPER+L | Lock" })
hl.bind("SUPER + B", hl.dsp.exec_cmd("qs ipc call bar toggle"), { description = "General | SUPER+B | Toggle bar" })
hl.bind("SUPER + backspace", hl.dsp.exec_cmd("qs ipc call powerSelector toggle"), { description = "General | SUPER+BACKSPACE | Power menu" })
hl.bind("SUPER + SHIFT + S", hl.dsp.exec_cmd("qs ipc call screenshot toggle"), { description = "General | SUPER+SHIFT+S | Screenshot" })
hl.bind("code:107", hl.dsp.exec_cmd("qs ipc call screenshot toggle"), { description = "General | PrtSc | Screenshot" })

-- Programs
hl.bind("SUPER + Q", hl.dsp.exec_cmd("kitty"), { description = "Program | SUPER+Q | Terminal" })
hl.bind("SUPER + E", hl.dsp.exec_cmd("thunar"), { description = "Program | SUPER+E | File manager" })

-- Window Management
hl.bind("SUPER + C", hl.dsp.window.close(), { description = "Window Management | SUPER+C | Close active window" })
hl.bind("SUPER + SHIFT + C", hl.dsp.window.kill(), { description = "Window Management | SUPER+SHIFT+C | Kill active window" })
hl.bind("SUPER + SPACE", hl.dsp.window.float({ action = "toggle" }), { description = "Window Management | SUPER+SPACE | Toggle window floating" })
hl.bind("SUPER + F", hl.dsp.window.fullscreen_state({ internal = 2, client = 0, action = "toggle" }),
{ description = "Window Management | SUPER+F | Maximized fullscreen window " })
hl.bind("SUPER + SHIFT + F", hl.dsp.window.fullscreen({ mode = "fullscreen" }), { description = "Window Management | SUPER+F | Full screen window" })
hl.bind("SUPER + M", hl.dsp.window.fullscreen({ mode = "maximized" }), { description = "Window Management | SUPER+M | Maximize window" })
hl.bind("SUPER + K", hl.dsp.window.pseudo(), { description = "Window Management | SUPER+K | Toggle window pseudo mode" })


-- Move Window Focus
hl.bind("SUPER + LEFT", hl.dsp.focus({ direction = "l" }), { description = "Move Window Focus | SUPER+LEFT | Move window focus left" })
hl.bind("SUPER + RIGHT", hl.dsp.focus({ direction = "r" }), { description = "Move Window Focus | SUPER+RIGHT | Move window focus right" })
hl.bind("SUPER + UP", hl.dsp.focus({ direction = "u" }), { description = "Move Window Focus | SUPER+UP | Move window focus up" })
hl.bind("SUPER + DOWN", hl.dsp.focus({ direction = "d" }), { description = "Move Window Focus | SUPER+DOWN | Move window focus down" })

-- Move Window
hl.bind("SUPER + SHIFT + LEFT", hl.dsp.window.swap({ direction = "l" }), { description = "Move Window | SUPER+SHIFT+LEFT | Move window left" })
hl.bind("SUPER + SHIFT + RIGHT", hl.dsp.window.swap({ direction = "r" }), { description = "Move Window | SUPER+SHIFT+RIGHT | Move window right" })
hl.bind("SUPER + SHIFT + UP", hl.dsp.window.swap({ direction = "u" }), { description = "Move Window | SUPER+SHIFT+UP | Move window up" })
hl.bind("SUPER + SHIFT + DOWN", hl.dsp.window.swap({ direction = "d" }), { description = "Move Window | SUPER+SHIFT+DOWN | Move window down" })

-- Resize Window
hl.bind("CTRL + LEFT", hl.dsp.window.resize({ x = -25, y = 0 }), { description = "Resize Window | CTRL+LEFT | Decrease window horizontal size" })
hl.bind("CTRL + RIGHT", hl.dsp.window.resize({ x = 25, y = 0 }), { description = "Resize Window | CTRL+RIGHT | Icrease window horizontal size" })
hl.bind("CTRL + UP", hl.dsp.window.resize({ x = 0, y = -25 }), { description = "Resize Window | CTRL+UP | Icrease window horizontal size" })
hl.bind("CTRL + DOWN", hl.dsp.window.resize({ x = 0, y = 25 }), { description = "Resize Window | CTRL+DOWN | Decrease window horizontal size" })

-- Workspaces
hl.bind("SUPER + S", hl.dsp.workspace.toggle_special("special"), { description = "Workspace | SUPER+S | Open special workspace" })
hl.bind("SUPER + TAB", function() hl.plugin.hyprexpo.expo("toggle") end, { description = "Workspace | SUPER+TAB | Toggle hyprexpo" })

-- Switch Workspace
hl.bind("SUPER + mouse_down", smw.cycle_workspaces("prev"), { description = "Switch Workspace | SUPER+MOUSE_DOWN | Swicth workspace down" })
hl.bind("SUPER + mouse_up", smw.cycle_workspaces("next"), { description = "Switch Workspace | SUPER+MOUSE_UP | Swicth workspace up" })
hl.bind("SUPER + code:10", smw.workspace("1"), { description = "Switch Workspace | SUPER+1 | Switch to workspace 1" })
hl.bind("SUPER + code:11", smw.workspace("2"), { description = "Switch Workspace | SUPER+2 | Switch to workspace 2" })
hl.bind("SUPER + code:12", smw.workspace("3"), { description = "Switch Workspace | SUPER+3 | Switch to workspace 3" })
hl.bind("SUPER + code:13", smw.workspace("4"), { description = "Switch Workspace | SUPER+4 | Switch to workspace 4" })
hl.bind("SUPER + code:14", smw.workspace("5"), { description = "Switch Workspace | SUPER+5 | Switch to workspace 5" })
hl.bind("SUPER + code:15", smw.workspace("6"), { description = "Switch Workspace | SUPER+6 | Switch to workspace 6" })
hl.bind("SUPER + code:16", smw.workspace("7"), { description = "Switch Workspace | SUPER+7 | Switch to workspace 7" })
hl.bind("SUPER + code:17", smw.workspace("8"), { description = "Switch Workspace | SUPER+8 | Switch to workspace 8" })
hl.bind("SUPER + code:18", smw.workspace("9"), { description = "Switch Workspace | SUPER+9 | Switch to workspace 9" })


-- Move Window To Workspace
hl.bind("SUPER + SHIFT + code:10", smw.move_to_workspace("1"), { description = "Move Window To Workspace | SUPER+SHIFT+1 | Move window to worksapce 1" })
hl.bind("SUPER + SHIFT + code:11", smw.move_to_workspace("2"), { description = "Move Window To Workspace | SUPER+SHIFT+2 | Move window to worksapce 2" })
hl.bind("SUPER + SHIFT + code:12", smw.move_to_workspace("3"), { description = "Move Window To Workspace | SUPER+SHIFT+3 | Move window to worksapce 3" })
hl.bind("SUPER + SHIFT + code:13", smw.move_to_workspace("4"), { description = "Move Window To Workspace | SUPER+SHIFT+4 | Move window to worksapce 4" })
hl.bind("SUPER + SHIFT + code:14", smw.move_to_workspace("5"), { description = "Move Window To Workspace | SUPER+SHIFT+5 | Move window to worksapce 5" })
hl.bind("SUPER + SHIFT + code:15", smw.move_to_workspace("6"), { description = "Move Window To Workspace | SUPER+SHIFT+6 | Move window to worksapce 6" })
hl.bind("SUPER + SHIFT + code:16", smw.move_to_workspace("7"), { description = "Move Window To Workspace | SUPER+SHIFT+7 | Move window to worksapce 7" })
hl.bind("SUPER + SHIFT + code:17", smw.move_to_workspace("8"), { description = "Move Window To Workspace | SUPER+SHIFT+8 | Move window to worksapce 8" })
hl.bind("SUPER + SHIFT + code:18", smw.move_to_workspace("9"), { description = "Move Window To Workspace | SUPER+SHIFT+9 | Move window to worksapce 9" })
hl.bind("SUPER + CTRL + code:10", smw.move_to_workspace_silent(1),
    { description = "Move Window To Workspace | SUPER+SHIFT+1 | Move window to worksapce 1 silently" })
hl.bind("SUPER + CTRL + code:11", smw.move_to_workspace_silent("2"),
    { description = "Move Window To Workspace | SUPER+SHIFT+2 | Move window to worksapce 2 silently" })
hl.bind("SUPER + CTRL + code:12", smw.move_to_workspace_silent("3"),
    { description = "Move Window To Workspace | SUPER+SHIFT+3 | Move window to worksapce 3 silently" })
hl.bind("SUPER + CTRL + code:13", smw.move_to_workspace_silent("4"),
    { description = "Move Window To Workspace | SUPER+SHIFT+4 | Move window to worksapce 4 silently" })
hl.bind("SUPER + CTRL + code:14", smw.move_to_workspace_silent("5"),
    { description = "Move Window To Workspace | SUPER+SHIFT+5 | Move window to worksapce 5 silently" })
hl.bind("SUPER + CTRL + code:15", smw.move_to_workspace_silent("6"),
    { description = "Move Window To Workspace | SUPER+SHIFT+6 | Move window to worksapce 6 silently" })
hl.bind("SUPER + CTRL + code:16", smw.move_to_workspace_silent("7"),
    { description = "Move Window To Workspace | SUPER+SHIFT+7 | Move window to worksapce 7 silently" })
hl.bind("SUPER + CTRL + code:17", smw.move_to_workspace_silent("8"),
    { description = "Move Window To Workspace | SUPER+SHIFT+8 | Move window to worksapce 8 silently" })
hl.bind("SUPER + CTRL + code:18", smw.move_to_workspace_silent("9"),
    { description = "Move Window To Workspace | SUPER+SHIFT+9 | Move window to worksapce 9 silently" })


-- Multi Monitor
hl.bind("SUPER + O", hl.dsp.focus({ monitor = "+1" }), { description = "Multi Monitor | SUPER+O | Focus next monitor" })
hl.bind("SUPER + SHIFT +  O", hl.dsp.window.move({ monitor = "+1" }), { description = "Multi Monitor | SUPER+SHIFT+O | Move window to next monitor" })
hl.bind("SUPER + CTRL + O", function()
    local active_workspace = hl.get_active_workspace()

    if active_workspace ~= nil then
        local active_workspace_windows = hl.get_workspace_windows(active_workspace)

        for index, win in ipairs(active_workspace_windows) do
            hl.dsp.window.move({ monitor = "+1", window = win })
        end
    end
end, { description = "Multi Monitor | SUPER+CTRL+O | Swap active worksapce" })
hl.bind("SUPER + G", smw.grab_rogue_windows(), { description = "Multi Monitor | SUPER+G | Grab rogue windows" })

-- Tools
hl.bind("SUPER + R", hl.dsp.exec_cmd("rofi -show run -theme $HOME/.config/rofi/themes/style.rasi"), { description = "Tools | SUPER+R | Run menu" })
hl.bind("SUPER + W", hl.dsp.exec_cmd("qs ipc call wallpapers toggle"), { description = "Tools | SUPER+W | Wallpaper selector" })
hl.bind("SUPER + V", hl.dsp.exec_cmd("qs ipc call clipboard toggle"), { description = "Tools | SUPER+V | Clipboard" })
hl.bind("SUPER + P", hl.dsp.exec_cmd("qs ipc call applicationLauncher toggle"), { description = "Tools | SUPER+P | App launcher" })
-- hl.bind("SUPER + SHIFT + P", hl.dsp.exec_cmd("ags toggle Monitors"), { description = "Tools | SUPER+SHIFT+P | Monitors Config" })
-- hl.bind("SUPER + twosuperior", hl.dsp.exec_cmd("ags toggle Keybinds"), { description = "Tools | SUPER+² | This window" })

-- Move/resize windows with mainMod + LMB/RMB and dragging
hl.bind("SUPER + mouse:272", hl.dsp.window.resize())
hl.bind("SUPER + mouse:273", hl.dsp.window.drag())

-- Brightness control
hl.bind("XF86MonBrightnessDown", hl.dsp.exec_cmd("brightnessctl s 5%- --device=intel_backlight"))
hl.bind("XF86MonBrightnessUp", hl.dsp.exec_cmd("brightnessctl s +5% --device=intel_backlight"))

-- Volume/Mic Control
hl.bind("XF86AudioMute", hl.dsp.exec_cmd("pactl set-sink-mute 0 toggle"))
hl.bind("XF86AudioLowerVolume", hl.dsp.exec_cmd("pactl set-sink-volume 0 -5%"))
hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd("pactl set-sink-volume 0 +5%"))
hl.bind("XF86AudioMicMute", hl.dsp.exec_cmd("pactl set-source-mute 0 toggle"))

-- Media control
hl.bind("XF86AudioPlay", hl.dsp.exec_cmd("playerctl play-pause"))
hl.bind("XF86AudioStop", hl.dsp.exec_cmd("playerctl stop"))
hl.bind("XF86AudioNext", hl.dsp.exec_cmd("playerctl next"))
hl.bind("XF86AudioPrev", hl.dsp.exec_cmd("playerctl previous"))

-- Open calculator
hl.bind("XF86Calculator", hl.dsp.exec_cmd("qalculate-gtk"))
