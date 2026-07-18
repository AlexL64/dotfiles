-- Disable animations
hl.layer_rule({ match = { namespace = "noanim" }, no_anim = true })
hl.layer_rule({ match = { namespace = "bar" }, animation = "slide down" })
hl.layer_rule({ match = { namespace = "slideRight" }, animation = "slide right" })

-- Tiling windows
hl.window_rule({ match = { class = "ONLYOFFICE Desktop Editors" }, tile = true })
hl.window_rule({ match = { class = "Minecraft.*" }, tile = true })
hl.window_rule({ match = { class = "steam_app_.*" }, tile = true })

-- Floating windows
hl.window_rule({ match = { class = "org.pulseaudio.pavucontrol" }, float = true })
hl.window_rule({ match = { class = "blueman-manager" }, float = true })
hl.window_rule({ match = { class = "nm-connection-editor" }, float = true })
hl.window_rule({ match = { class = "brave-nngceckbapebfimnlniiiahkandclblb-Default" }, float = true })
hl.window_rule({ match = { class = "qt5ct" }, float = true })
hl.window_rule({ match = { class = "qt6ct" }, float = true })
hl.window_rule({ match = { class = "nwg-look" }, float = true })
hl.window_rule({ match = { class = "com.yubico.yubioath" }, float = true })
hl.window_rule({ match = { class = "qalculate-gtk" }, float = true })
hl.window_rule({ match = { class = "Confirm to replace files" }, float = true })
hl.window_rule({ match = { class = "File Operation Progress" }, float = true })
hl.window_rule({ match = { class = "Save File" }, float = true })
hl.window_rule({ match = { class = "Open Folder" }, float = true })
hl.window_rule({ match = { class = "Open File" }, float = true })
hl.window_rule({ match = { class = "seahorse" }, float = true })
hl.window_rule({ match = { class = "Grub-customizer" }, float = true })
hl.window_rule({ match = { class = "file-roller" }, float = true })
hl.window_rule({ match = { class = "system-config-printer" }, float = true })
hl.window_rule({ match = { class = "org.gnome.Firmware" }, float = true })
hl.window_rule({ match = { class = "thunar", title = ".*Rename.*" }, float = true })
hl.window_rule({ match = { class = "thunar", title = "File Operation Progress" }, float = true })
hl.window_rule({ match = { class = "org.qbittorrent.qBittorrent", title = "(?!qBittorrent)." }, float = true })
hl.window_rule({ match = { class = "org.prismlauncher.PrismLauncher", title = ".*Console window for .*" }, float = true })

-- Windows size
hl.window_rule({ match = { class = "org.pulseaudio.pavucontrol" }, size = { "monitor_w * 0.4", "monitor_h * 0.4" } })
hl.window_rule({ match = { class = "blueman-manager" }, size = { "monitor_w * 0.4", "monitor_h * 0.4" } })
hl.window_rule({ match = { class = "nm-connection-editor" }, size = { "monitor_w * 0.4", "monitor_h * 0.4" } })
hl.window_rule({ match = { class = "com.yubico.yubioath" }, size = { "monitor_w * 0.4", "monitor_h * 0.4" } })
hl.window_rule({ match = { class = "Save File" }, size = { "monitor_w * 0.4", "monitor_h * 0.4" } })
hl.window_rule({ match = { class = "Open Folder" }, size = { "monitor_w * 0.4", "monitor_h * 0.4" } })
hl.window_rule({ match = { class = "Open File" }, size = { "monitor_w * 0.4", "monitor_h * 0.4" } })
hl.window_rule({ match = { class = "system-config-printer" }, size = { "monitor_w * 0.4", "monitor_h * 0.4" } })
hl.window_rule({ match = { class = "com.hunterwittenborn.Celeste" }, size = { "monitor_w * 0.4", "monitor_h * 0.4" } })
hl.window_rule({ match = { class = "org.prismlauncher.PrismLauncher", title = ".*Console window for .*" }, size = { "monitor_w * 0.4", "monitor_h * 0.4" } })

-- Center
hl.window_rule({ match = { class = "org.prismlauncher.PrismLauncher" }, center = true })
hl.window_rule({ match = { class = "nwg-processes" }, center = true })

-- Others
hl.window_rule({ match = { class = "TestWin" }, pin = true })
