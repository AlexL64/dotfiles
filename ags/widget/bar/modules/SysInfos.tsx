import { createBinding } from "gnim";
import Brightness from "../../../services/Brightness"
import Battery from "gi://AstalBattery?version=0.1"
import App from "ags/gtk4/app"
import { Gdk, Gtk } from "ags/gtk4";
import { createPoll } from "ags/time";

export default function SysInfos() {

    const cpu = createPoll("", 10000, [
        'bash',
        '-c',
        `top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk '{printf "%.0f%\\n", 100 - $1"%"}'`
    ])

    const memory = createPoll("", 30000, [
        'bash',
        '-c',
        `free -m | grep "Mem" | awk '{printf "%.0f%\\n", ($3*100)/$2}'`
    ])

    const storage = createPoll("", 300000, [
        'bash',
        '-c',
        `df | grep '.* /$' | awk '{print $5}'`
    ])

    const brightness = Brightness.get_default();

    const battery = Battery.get_default();

    const idle = App.get_window("Idle");

    return <box class={"sysinfos"}>
        <button class={"cpu"}>
            <box spacing={8}>
                <label label={cpu} />
                <label label={""} />
            </box>
        </button>
        <button
            class={"memory"}
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            onClicked={() => {
                App.toggle_window("Memory");
            }}>
            <box spacing={8}>
                <label label={memory} />
                <label label={""} />
            </box>
        </button>
        <button
            class={"storage"}
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            onClicked={() => {
                App.toggle_window("Storage");
            }}>
            <box spacing={8}>
                <label label={storage} />
                <label label={"󰋊"} />
            </box>
        </button>
        <button
            class={"brightness"}
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            onClicked={() => {
                App.toggle_window("Brightness");
            }}
            $={(self) => {
                const scroll = new Gtk.EventControllerScroll;
                scroll.flags = Gtk.EventControllerScrollFlags.BOTH_AXES | Gtk.EventControllerScrollFlags.KINETIC;

                self.add_controller(scroll);

                scroll.connect("scroll", (_, x, y) => {
                    y > 0 ? brightness.screen -= 0.01 : brightness.screen += 0.01;
                })
            }}>
            <box spacing={8}>
                <label label={createBinding(brightness, "screen").as((b) => `${Math.floor(b * 100)}%`)} />
                <label label={createBinding(brightness, "screen").as((b) => {
                    const icons = {
                        84: "󰃠",
                        70: "󰃟",
                        56: "󰃞",
                        42: "󰃝",
                        28: "󰃜",
                        14: "󰃛",
                        0: "󰃚"
                    }

                    const icon = [84, 70, 56, 42, 28, 14, 0].find(threshold => threshold <= b * 100) as keyof typeof icons;

                    return `${icons[icon]}`;
                })} />
            </box>
        </button>
        <button
            class={"battery"}
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            onClicked={() => {
                App.toggle_window("Battery");
            }}
            $={(self) => {
                switch (battery.state) {
                    case 1:
                        self.add_css_class("charging")
                        break;
                    case 2:
                        self.add_css_class("discharging")
                        break;
                    case 4:
                        self.add_css_class("charged")
                        break;
                    default:
                        break;
                }

                createBinding(battery, "state").subscribe(() => {
                    switch (battery.state) {
                        case 1:
                            self.add_css_class("charging")
                            self.remove_css_class("discharging")
                            self.remove_css_class("charged")
                            break;
                        case 2:
                            self.remove_css_class("charging")
                            self.add_css_class("discharging")
                            self.remove_css_class("charged")
                            break;
                        case 4:
                            self.remove_css_class("charging")
                            self.remove_css_class("discharging")
                            self.add_css_class("charged")
                            break;
                        default:
                            break;
                    }
                })
            }}>
            <box
                spacing={8}
                tooltipText={""}
                $={(self) => {
                    battery.time_to_full ? self.tooltipText = `Charging: ${formatTime(battery.time_to_full)} left` : null;
                    battery.time_to_empty ? self.tooltipText = `Discharging: ${formatTime(battery.time_to_empty)} left` : null;
                    battery.state == 4 ? self.tooltipText = "Charged" : null;

                    createBinding(battery, "timeToFull").subscribe(() => {
                        self.tooltipText = battery.time_to_full ? `Charging: ${formatTime(battery.time_to_full)} left` : "";
                    })

                    createBinding(battery, "timeToEmpty").subscribe(() => {
                        self.tooltipText = battery.time_to_empty ? `Discharging: ${formatTime(battery.time_to_empty)} left` : "";
                    })

                    createBinding(battery, "state").subscribe(() => {
                        battery.state == 4 ? self.tooltipText = "Charged" : null;
                    })
                }}>
                <label label={createBinding(battery, "percentage").as((b) => `${Math.round(b * 100)}%`)} />
                <box class={"icons"}>
                    <image iconName={createBinding(battery, "icon_name")} />
                    <label class={"idle"} label={""} visible={idle != null && createBinding(idle, "visible")} />
                </box>
            </box>
        </button>
    </box>
}

function formatTime(seconds: number): string {
    const totalMinutes = Math.floor(seconds / 60);
    if (totalMinutes < 60) {
        return `${totalMinutes}min`;
    } else {
        const hours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
        return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
    }
}