import { Workspaces } from "./modules/workspaces.js";
import { AudioOutput } from "./modules/audio_output.js";
import { AudioInput } from "./modules/audio_input.js";
import { Date } from "./modules/date.js";
import { Battery } from "./modules/battery.js"
import { Brightness } from "./modules/brightness.js";
import { Cpu } from "./modules/cpu.js";
import { Ram } from "./modules/ram.js";
import { Storage } from "./modules/storage.js";
import { Tray } from "./modules/tray.js";
import { Notifications } from "./modules/notifications.js";
import { Mpris } from "./modules/mpris.js";
import { Media } from "./menus/media.js"
import { Calendar } from "./menus/calendar.js";
import { Power } from "./menus/power.js";
import { Audio } from "./menus/audio.js";


function Left() {
    return Widget.Box({
        spacing: 10,
        children: [
            Workspaces(),
            Widget.Box({
                children: [
                    AudioOutput(),
                    AudioInput(),
                ]
            })
        ],
    })
}

function Center() {
    return Widget.Box({
        spacing: 10,
        children: [
            Mpris(),
            Date(),
        ],
    })
}

function Right() {
    return Widget.Box({
        hpack: "end",
        spacing: 10,
        children: [
            Notifications(),
            Widget.Box({
                children: [
                    Cpu(),
                    Ram(),
                    Storage(),
                    Brightness(),
                    Battery(),
                ]
            }),
            Tray(),
        ],
    })
}

function Bar(monitor = 0) {
    return Widget.Window({
        name: `bar-${monitor}`,
        class_name: "bar",
        monitor,
        height_request: 36,
        margins: [10, 10, 0, 10],
        anchor: ["top", "left", "right"],
        exclusivity: "exclusive",
        child: Widget.CenterBox({
            start_widget: Left(),
            center_widget: Center(),
            end_widget: Right(),
        }),
    })
}

App.config({
    style: "./style.css",
    windows: [
        Bar(),
        Media(),
        Calendar(),
        Power(),
        Audio(),
    ],
})

export { }