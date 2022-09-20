local awful = require("awful")

awful.spawn.with_shell("picom --experimental-backends")
awful.spawn.with_shell("xss-lock -- bash ~/.config/awesome/scripts/lockscreen.sh --nofork")
awful.spawn.with_shell("xautolock -locker 'bash ~/.config/awesome/scripts/lockscreen.sh' -time 10")