import { bind, exec, Variable } from "astal";
import Brightness from "./../../../services/brightness"
import Battery from "gi://AstalBattery";
import { App } from "astal/gtk3";

export default function SysInfos() {

    const cpu = Variable("").poll(
        10000,
        [
            'bash',
            '-c',
            `top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk '{printf "%.0f%\\n", 100 - $1"%"}'`
        ]
    );

    const memory = Variable("").poll(
        30000,
        [
            'bash',
            '-c',
            `free -m | grep "Mem" | awk '{printf "%.0f%\\n", ($3*100)/$2}'`
        ]
    );

    const storage = Variable("").poll(
        300000,
        [
            'bash',
            '-c',
            `df | grep '.* /$' | awk '{print $5}'`
        ]
    );

    const brightness = Brightness.get_default();

    const battery = Battery.get_default();

    const idle = App.get_window("idle");

    return <box className={"sysinfos"}>
        <button className={"cpu"}>
            <box spacing={8}>
                <label label={bind(cpu)} />
                <label label={""} />
            </box>
        </button>
        <button
            className={"memory"}
            cursor={"pointer"}
            onClicked={() => {
                App.toggle_window("memory");
            }}>
            <box spacing={8}>
                <label label={bind(memory)} />
                <label label={""} />
            </box>
        </button>
        <button
            className={"storage"}
            cursor={"pointer"}
            onClicked={() => {
                App.toggle_window("storage");
            }}>
            <box spacing={8}>
                <label label={bind(storage)} />
                <label label={"󰋊"} />
            </box>
        </button>
        <button
            className={"brightness"}
            cursor={"pointer"}
            onClicked={() => {
                App.toggle_window("brightness");
            }}
            onScroll={(self, event) => {
                event.delta_y > 0 ? exec(["bash", "-c", "brightnessctl set 1%-"]) : exec(["bash", "-c", "brightnessctl set +1%"]);
            }}>
            <box spacing={8}>
                <label label={bind(brightness, "screen").as((b) => `${Math.ceil(b * 100)}%`)} />
                <label label={bind(brightness, "screen").as((b) => {
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
            className={"battery"}
            cursor={"pointer"}
            onClicked={() => {
                App.toggle_window("battery");
            }}
            setup={(self) => {
                switch (battery.state) {
                    case 1:
                        self.toggleClassName("charging", true)
                        break;
                    case 2:
                        self.toggleClassName("discharging", true)
                        break;
                    case 4:
                        self.toggleClassName("charged", true)
                        break;
                    default:
                        break;
                }

                self.hook(bind(battery, "state"), (_, state) => {
                    switch (state) {
                        case 1:
                            self.toggleClassName("charging", true)
                            self.toggleClassName("discharging", false)
                            self.toggleClassName("charged", false)
                            break;
                        case 2:
                            self.toggleClassName("charging", false)
                            self.toggleClassName("discharging", true)
                            self.toggleClassName("charged", false)
                            break;
                        case 4:
                            self.toggleClassName("charging", false)
                            self.toggleClassName("discharging", false)
                            self.toggleClassName("charged", true)
                            break;
                        default:
                            break;
                    }
                })
            }}
        >
            <box
                spacing={8}
                tooltipText={""}
                setup={(self) => {
                    battery.time_to_full ? self.tooltipText = `Charging: ${formatTime(battery.time_to_full)} left` : null;
                    battery.time_to_empty ? self.tooltipText = `Discharging: ${formatTime(battery.time_to_empty)} left` : null;
                    battery.state == 4 ? self.tooltipText = "Charged" : null;

                    self.hook(bind(battery, "timeToFull"), (_, time) => {
                        self.tooltipText = `Charging: ${formatTime(time)} left`;
                    })

                    self.hook(bind(battery, "timeToEmpty"), (_, time) => {
                        self.tooltipText = time ? `Discharging: ${formatTime(time)} left` : "";
                    })

                    self.hook(bind(battery, "state"), (_, state) => {
                        state == 4 ? self.tooltipText = "Charged" : null;
                    })
                }}
            >
                <label label={bind(battery, "percentage").as((b) => `${Math.round(b * 100)}%`)} />
                <box className={"icons"}>
                    <icon icon={bind(battery, "icon_name")} />
                    <label className={"idle"} label={""} visible={idle != null && bind(idle, "visible")} />
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