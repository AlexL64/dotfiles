local gears = require("gears")
local awful = require("awful")
local wibox = require("wibox")
local beautiful = require("beautiful")



local fs_widget = require("widgets.fs-widget")
local cpu_widget = require("widgets.cpu-widget.cpu-widget")
local batteryarc_widget = require("widgets.batteryarc-widget.batteryarc")
local brightness_widget = require("widgets.brightness-widget.brightness")
local ram_widget = require("widgets.ram-widget")
local logout_menu_widget = require("widgets.logout-menu-widget.logout-menu")

require 'main.wallpaper'

-- {{{ Wibar
-- Create a textclock widget
mytextclock = wibox.widget.textclock()

-- Create a wibox for each screen and add it
local taglist_buttons = gears.table.join(awful.button({}, 1, function(t)
    t:view_only()
end), awful.button({modkey}, 1, function(t)
    if client.focus then
        client.focus:move_to_tag(t)
    end
end), awful.button({}, 3, awful.tag.viewtoggle), awful.button({modkey}, 3, function(t)
    if client.focus then
        client.focus:toggle_tag(t)
    end
end), awful.button({}, 4, function(t)
    awful.tag.viewnext(t.screen)
end), awful.button({}, 5, function(t)
    awful.tag.viewprev(t.screen)
end))

local tasklist_buttons = gears.table.join(awful.button({}, 1, function(c)
    if c == client.focus then
        c.minimized = true
    else
        c:emit_signal("request::activate", "tasklist", {
            raise = true
        })
    end
end), awful.button({}, 3, function()
    awful.menu.client_list({
        theme = {
            width = 250
        }
    })
end), awful.button({}, 4, function()
    awful.client.focus.byidx(1)
end), awful.button({}, 5, function()
    awful.client.focus.byidx(-1)
end))

awful.screen.connect_for_each_screen(function(s)

    -- Each screen has its own tag table.
    awful.tag({"1", "2", "3", "4", "5", "6", "7", "8", "9"}, s, awful.layout.layouts[1])

    -- Create a promptbox for each screen
    s.mypromptbox = awful.widget.prompt()
    -- Create an imagebox widget which will contain an icon indicating which layout we're using.
    -- We need one layoutbox per screen.
    s.mylayoutbox = awful.widget.layoutbox(s)
    s.mylayoutbox:buttons(gears.table.join(awful.button({}, 1, function()
        awful.layout.inc(1)
    end), awful.button({}, 3, function()
        awful.layout.inc(-1)
    end), awful.button({}, 4, function()
        awful.layout.inc(1)
    end), awful.button({}, 5, function()
        awful.layout.inc(-1)
    end)))
    -- Create a taglist widget
    s.mytaglist = awful.widget.taglist {
        screen = s,
        filter = awful.widget.taglist.filter.all,
        buttons = taglist_buttons
    }

    -- Create a tasklist widget
    s.mytasklist = awful.widget.tasklist {
        screen = s,
        -- filter = awful.widget.tasklist.filter.currenttags,
        -- buttons = tasklist_buttons,
    }

    -- Create the wibox
    s.mywibox = awful.wibar({
        position = "top",
        screen = s,
        width = 2530,
        visible = true
    })


    -- Add widgets to the wibox
    s.mywibox:setup{
        layout = wibox.layout.align.horizontal,
        { -- Left widgets
            layout = wibox.layout.fixed.horizontal,
            mylauncher,
            s.mytaglist,
            s.mypromptbox,
            wibox.widget.systray(),
        },
        s.mytasklist, -- Middle widget
        { -- Right widgets
            layout = wibox.layout.fixed.horizontal,
            fs_widget(),
            cpu_widget({
                width = 75,
                step_width = 5,
                step_spacing = 1,
                color = '#FFFFFF',
            }),
		    ram_widget(),
            batteryarc_widget({
                show_current_level = true,
                arc_thickness = 1,
                size = 28,
                bg_color = '#FFFFFF',
            }),
            brightness_widget({
                type = 'icon_and_text',
                program = 'light',
                step = 5,
                tooltip = true,
                percentage = true, 
            }),
            -- mykeyboardlayout,
            mytextclock,
            logout_menu_widget{
                font = 'Hack Nerd Font',
                onlock = function() awful.spawn.with_shell("sh " .. gears.filesystem.get_configuration_dir() .. "scripts/lockscreen.sh") end
            }
        }
    }
end)
-- }}}