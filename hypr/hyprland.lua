package.path = package.path .. ";./?.lua;./?/init.lua"
smw = require("plugins.split-monitor-workspaces")

hl.config({
    general = {
        gaps_in = 5,
        gaps_out = 10,
        border_size = 2,
        col = {
            active_border = { colors = { "rgba(cba6f7ff)", "rgba(89b4faff)" }, angle = 45 },
            inactive_border = "rgba(595959aa)",
        },

        layout = "dwindle",

        allow_tearing = false,
    },

    dwindle = {
        preserve_split = true
    },

    decoration = {
        rounding = 10,

        blur = {
            enabled = true,
            size = 3,
            passes = 1
        },

        shadow = {
            enabled = false
        }
    },

    input = {
        kb_layout = "fr",
        follow_mouse = 1,

        touchpad = {
            natural_scroll = true,
            disable_while_typing = true
        },

        sensitivity = 0,
        numlock_by_default = true
    },

    xwayland = {
        force_zero_scaling = true
    },

    misc = {
        force_default_wallpaper = false,
        disable_hyprland_logo = true,
        vrr = 1
    },

    debug = {
        error_position = -1
    }
})

require("animations")
require("autostart")
require("env")
require("input-devices")
require("keybinds")
require("monitors")
require("plugins")
require("windowrules")
