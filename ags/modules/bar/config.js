import { Workspaces } from "./modules/workspaces.js";
import { AudioOutput } from "./modules/audio_output.js";
import { AudioInput } from "./modules/audio_input.js";
import { Date } from "./modules/date.js";
import { IdleInhibitor } from "./modules/idle_inhibitor.js"

const date = Variable("", {
    poll: [1000, 'date +"%A, %d. %b  %H:%M"'],
})

function Media() {
}

function Clock() {
    return Widget.Label({
        class_name: "clock",
        label: date.bind(),
    })
}

function SysRessources() {
}

function Notifications() {
}

function Battery() {
}

function Network() {
}

function Bluetooth() {
}


function SysTray() {
}


// layout of the bar
function Left() {
    return Widget.Box({
        spacing: 10,
        children: [
            Workspaces(),
            IdleInhibitor(),
            AudioOutput(),
            AudioInput(),
        ],
    })
}

function Center() {
    return Widget.Box({
        spacing: 10,
        children: [
            Date(),
        ],
    })
}

function Right() {
    return Widget.Box({
        hpack: "end",
        spacing: 10,
        children: [
        ],
    })
}

function Bar(monitor = 0) {
    return Widget.Window({
        name: `bar-${monitor}`, // name has to be unique
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
    ],
})

export { }