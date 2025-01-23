import AstalBattery from "gi://AstalBattery";
import PowerProfiles from "gi://AstalPowerProfiles";
import { bind, exec } from "astal";
import { App, Astal, Gtk } from "astal/gtk3";

export default function Battery() {

    const battery = AstalBattery.get_default();
    const upower = new AstalBattery.UPower;
    const powerProfiles = PowerProfiles.get_default();

    return <window
        name={"battery"}
        marginTop={10}
        marginRight={10}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}>
        <box className={'battery'} vertical spacing={10}>
            <box className={"main_battery"} vertical>
                <box className={"controls"} spacing={10}>
                    <button
                        className={"idle"}
                        label={"󰒲"}
                        onClick={(self) => {
                            App.toggle_window("idle");
                            const visible = App.get_window("idle")?.visible;

                            visible ? self.label = "󰒳" : self.label = "󰒲";
                            self.toggleClassName("toggled", visible);
                        }}
                        setup={(self) => {
                            const visible = App.get_window("idle")?.visible;

                            visible ? self.label = "󰒳" : self.label = "󰒲";
                            self.toggleClassName("toggled", visible);
                        }} />
                    <button
                        className={"saving"}
                        label={"󱈑"}
                        onClick={(self) => {
                            const status = exec(["bash", "-c", "lenopow -s | grep -oP '(?<=Battery protection: ).*'"])

                            status == "DISABLED" ? exec("sudo lenopow -e") : exec("sudo lenopow -d");
                            self.toggleClassName("toggled", status == "DISABLED")
                        }}
                        setup={(self) => {
                            const status = exec(["bash", "-c", "lenopow -s | grep -oP '(?<=Battery protection: ).*'"])

                            self.toggleClassName("toggled", status != "DISABLED")
                        }} />
                </box>
                <box className={"separator"} />
                <box>
                    <icon icon={bind(battery, "iconName")} className={"icon"} />
                    <box vertical>
                        <box homogeneous className={"top"}>
                            <label label={"Battery"} halign={Gtk.Align.START} />
                            <label
                                halign={Gtk.Align.END}
                                label={bind(battery, "state").as((s) => {
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
                            className={"bar"}
                            mode={Gtk.LevelBarMode.CONTINUOUS}
                            widthRequest={300}
                            heightRequest={6}
                            value={bind(battery, "percentage")}
                        />
                        <box homogeneous className={"bottom"}>
                            <label
                                halign={Gtk.Align.START}
                                setup={(self) => {
                                    self.hook(bind(battery, "timeToEmpty"), (_, time) => {
                                        self.label = formatTime(time);
                                    })

                                    self.hook(bind(battery, "timeToFull"), (_, time) => {
                                        self.label = formatTime(time);
                                    })
                                }}
                            />
                            <label
                                halign={Gtk.Align.END}
                                label={bind(battery, "percentage").as((p) => `${p * 100}%`)}
                            />
                        </box>
                    </box>
                </box>
                <box className={"separator"} />
                <box className={"profile"}>
                    <label label={""} className={"icon"} />
                    <slider
                        className={"selector"}
                        expand
                        valuePos={3}
                        drawValue
                        min={0.1}
                        max={0.3}
                        value={bind(powerProfiles, "activeProfile").as((p) => {
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
                        setup={(self) => {
                            self.add_mark(0.1, Gtk.PositionType.TOP, 'Power saver')
                            self.add_mark(0.2, Gtk.PositionType.TOP, 'Balanced')
                            self.add_mark(0.3, Gtk.PositionType.TOP, 'Performance')
                        }}
                        onDragged={(self) => {
                            switch (self.value) {
                                case 0.1:
                                    powerProfiles.activeProfile = "power-saver";
                                    break;
                                case 0.2:
                                    powerProfiles.activeProfile = "balanced";
                                    break;
                                case 0.3:
                                    powerProfiles.activeProfile = "performance";
                                    break;
                            }
                        }}
                    />
                </box>
            </box>
            <box
                className={"devices"}
                vertical spacing={10}
                visible={bind(upower, "devices").as((d) => Object.values(d).filter(d => d.deviceType >= 3).length > 0)}>
                {
                    bind(upower, "devices").as((devices) => devices.map((device) => {
                        return <box className={"device"} visible={bind(device, "deviceType").as((t) => t >= 3)}>
                            <icon className={"icon"} icon={bind(device, "batteryIconName")} />
                            <box vertical expand>
                                <box homogeneous className={"top"}>
                                    <label
                                        label={bind(device, "model")}
                                        halign={Gtk.Align.START}
                                        maxWidthChars={20}
                                        truncate />
                                    <label
                                        label={bind(device, "state").as((s) => {
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
                                            }
                                        })}
                                        halign={Gtk.Align.END} />
                                </box>
                                <levelbar
                                    className={"bar"}
                                    mode={Gtk.LevelBarMode.CONTINUOUS}
                                    widthRequest={300}
                                    heightRequest={6}
                                    value={bind(device, "percentage")}
                                />
                                <centerbox className={"bottom"}>
                                    <label label={bind(device, "percentage").as((p) => `${p * 100}%`)} halign={Gtk.Align.END} />
                                </centerbox>
                            </box>
                        </box>
                    }))
                }
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
