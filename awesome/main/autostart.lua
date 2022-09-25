local awful = require("awful")

awful.spawn.with_shell("picom --experimental-backends")
awful.spawn.with_shell("xss-lock -- bash ~/.config/awesome/scripts/lockscreen.sh --nofork")
awful.spawn.with_shell("xautolock -locker 'bash ~/.config/awesome/scripts/lockscreen.sh' -time 10")
awful.spawn.with_shell("numlockx on")
-- awful.spawn.with_shell("bash ~/.config/polybar/launch.sh")
awful.spawn.with_shell("greenclip daemon")
