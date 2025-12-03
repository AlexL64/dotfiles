import { Astal, Gdk, Gtk } from "ags/gtk4";
import AstalBattery from "gi://AstalBattery?version=0.1";
import PowerProfiles from "gi://AstalPowerProfiles?version=0.1";
import App from "ags/gtk4/app";
import { exec, execAsync } from "ags/process";
import { createBinding, For } from "ags";
import Pango from "gi://Pango?version=1.0";

export default function Battery() {

    const battery = AstalBattery.get_default();
    const upower = new AstalBattery.UPower;
    const powerProfiles = PowerProfiles.get_default();

    const devices = createBinding(upower, "devices");

    return <window
        name={"Battery"}
        marginTop={10}
        marginRight={214}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        defaultHeight={-1}
        defaultWidth={-1}
        visible={false}>
        <box class={'battery'} orientation={Gtk.Orientation.VERTICAL} spacing={10} valign={Gtk.Align.START}>
            <box class={"main_battery"} orientation={Gtk.Orientation.VERTICAL}>
                <box class={"controls"} spacing={10}>
                    <button
                        class={"idle"}
                        label={"󰒲"}
                        cursor={Gdk.Cursor.new_from_name("pointer", null)}
                        onClicked={() => App.toggle_window("Idle")}
                        $={(self) => {

                            const idle = App.get_window("Idle");

                            if (idle != undefined) {
                                idle.connect("notify::visible", (idle) => {
                                    idle.visible ? self.label = "󰒳" : self.label = "󰒲";
                                    idle.visible ? self.add_css_class("toggled") : self.remove_css_class("toggled");
                                })
                            }
                        }} />
                    <button
                        class={"saving"}
                        label={"󱈑"}
                        cursor={Gdk.Cursor.new_from_name("pointer", null)}
                        onClicked={(self) => {
                            const status = exec(["bash", "-c", "lenopow -s | grep -oP '(?<=Battery protection: ).*'"])

                            status == "DISABLED" ? exec("sudo lenopow -e") : exec("sudo lenopow -d");
                            status == "DISABLED" ? self.add_css_class("toggled") : self.remove_css_class("toggled");
                        }}
                        $={(self) => {
                            const status = exec(["bash", "-c", "lenopow -s | grep -oP '(?<=Battery protection: ).*'"])

                            status != "DISABLED" ? self.add_css_class("toggled") : self.remove_css_class("toggled");
                        }} />
                </box>
                <box class={"separator"} />
                <box>
                    <image iconName={createBinding(battery, "iconName")} class={"icon"} pixelSize={26} />
                    <box orientation={Gtk.Orientation.VERTICAL}>
                        <box homogeneous class={"top"}>
                            <label label={"Battery"} halign={Gtk.Align.START} />
                            <label
                                halign={Gtk.Align.END}
                                label={createBinding(battery, "state").as((s) => {
                                    switch (s) {
                                        case 1:
                                            return "Chaging";
                                        case 2:
                                            return "Dischaging";
                                        case 3:
                                            return "Empty";
                                        case 4:
                                            return "Charged";
                                        default:
                                            return "Unknown";
                                    }
                                })}
                            />
                        </box>
                        <levelbar
                            class={"bar"}
                            mode={Gtk.LevelBarMode.CONTINUOUS}
                            widthRequest={300}
                            heightRequest={6}
                            value={createBinding(battery, "percentage")}
                        />
                        <box homogeneous class={"bottom"}>
                            <label
                                halign={Gtk.Align.START}
                                $={(self) => {
                                    battery.connect("notify::time-to-empty", () => {
                                        self.label = formatTime(battery.timeToEmpty);
                                    })

                                    battery.connect("notify::time-to-full", () => {
                                        self.label = formatTime(battery.timeToFull);
                                    })
                                }}
                            />
                            <label
                                halign={Gtk.Align.END}
                                label={createBinding(battery, "percentage").as((p) => `${Math.round(p * 100)}%`)}
                            />
                        </box>
                    </box>
                </box>
                <box class={"separator"} />
                <box class={"profile"}>
                    <label label={""} class={"icon"} />
                    <box class={"selector"} orientation={Gtk.Orientation.VERTICAL}>
                        <centerbox>
                            <label $type="start" label={"Power saver"} />
                            <label $type="center" label={"Balanced"} />
                            <label $type="end" label={"Performance"} />
                        </centerbox>
                        <centerbox class={"indicators"}>
                            <box $type="start" />
                            <box $type="center" />
                            <box $type="end" />
                        </centerbox>
                        <slider
                            hexpand
                            valuePos={3}
                            drawValue
                            min={0.1}
                            max={0.3}
                            value={createBinding(powerProfiles, "activeProfile").as((p) => {
                                switch (p) {
                                    case "power-saver":
                                        return 0.1;
                                    case "balanced":
                                        return 0.2;
                                    case "performance":
                                        return 0.3;
                                    default:
                                        return 0.1
                                }
                            })}
                            onValueChanged={(self) => {
                                switch (self.value) {
                                    case 0.1:
                                        execAsync(["bash", "-c", "powerprofilesctl set power-saver"]);
                                        break;
                                    case 0.2:
                                        execAsync(["bash", "-c", "powerprofilesctl set balanced"]);
                                        break;
                                    case 0.3:
                                        execAsync(["bash", "-c", "powerprofilesctl set performance"]);
                                        break;
                                }
                            }}
                        />
                    </box>
                </box>
            </box>
            <box
                class={"devices"}
                vexpand={false}
                orientation={Gtk.Orientation.VERTICAL} spacing={10}
                visible={createBinding(upower, "devices").as((d) => Object.values(d).filter(d => d.deviceType >= 3).length > 0)}>
                <For each={devices}>
                    {(device) => {
                        return <box class={"device"} visible={createBinding(device, "deviceType").as((t) => t >= 3)}>
                            <image class={"icon"} iconName={createBinding(device, "batteryIconName")} pixelSize={26}/>
                            <box orientation={Gtk.Orientation.VERTICAL} vexpand hexpand>
                                <box homogeneous class={"top"}>
                                    <label
                                        label={createBinding(device, "model")}
                                        halign={Gtk.Align.START}
                                        maxWidthChars={20}
                                        ellipsize={Pango.EllipsizeMode.END}
                                    />
                                    <label
                                        label={createBinding(device, "state").as((s) => {
                                            switch (s) {
                                                case 0:
                                                    return "Unknown";
                                                case 1:
                                                    return "Charging";
                                                case 2:
                                                    return "Discharging";
                                                case 3:
                                                    return "Empty";
                                                case 4:
                                                    return "Charged";
                                                case 5:
                                                    return "Pending Charge";
                                                case 6:
                                                    return "Pending Discharge";
                                                default:
                                                    return "";
                                            }
                                        })}
                                        halign={Gtk.Align.END} />
                                </box>
                                <levelbar
                                    class={"bar"}
                                    mode={Gtk.LevelBarMode.CONTINUOUS}
                                    widthRequest={300}
                                    heightRequest={6}
                                    value={createBinding(device, "percentage")}
                                />
                                <label class={"bottom"} label={createBinding(device, "percentage").as((p) => `${Math.round(p * 100)}%`)} halign={Gtk.Align.END} />
                            </box>
                        </box>
                    }}
                </For>
            </box>
        </box>
    </window >
}

function formatTime(seconds: number): string {

    if (seconds == 0) {
        return "";
    } else {
        const totalMinutes = Math.floor(seconds / 60);
        if (totalMinutes < 60) {
            return `${totalMinutes}min`;
        } else {
            const hours = Math.floor(totalMinutes / 60);
            const remainingMinutes = totalMinutes % 60;
            return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
        }
    }

}
