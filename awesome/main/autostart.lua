local awful = require("awful")

-- awful.spawn.with_shell("picom --experimental-backends")
awful.spawn.with_shell("picom")
awful.spawn.with_shell("xss-lock -- bash ~/.config/awesome/scripts/lockscreen.sh --nofork")
awful.spawn.with_shell("xautolock -locker 'bash ~/.config/awesome/scripts/lockscreen.sh' -time 10 -corners +00-")
awful.spawn.with_shell("numlockx on")
-- awful.spawn.with_shell("bash ~/.config/polybar/launch.sh")
awful.spawn.with_shell("greenclip daemon")
awful.spawn.with_shell("lxqt-policykit-agent")

-- awful.spawn.with_shell("xss-lock -- systemctl suspend")
-- awful.spawn.with_shell("xautolock -locker 'systemctl suspend' -time 10 -corners +00-")
