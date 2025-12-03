import { Astal, Gdk, Gtk } from "ags/gtk4";
import App from "ags/gtk4/app";
import { createBinding, With } from "ags";
import Mullvad from "../../../services/Mullvad";
import { exec } from "ags/process";

export default function Network() {

    const mullvad = Mullvad.get_default();

    const status = createBinding(mullvad, "status");

    return <window
        name={"Network"}
        marginTop={10}
        marginRight={10}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}>
        <box class={"network"} valign={Gtk.Align.START}>
            <box class={"mullvad"} orientation={Gtk.Orientation.VERTICAL} hexpand>
                <label label={"Mullvad VPN Status"} halign={Gtk.Align.START} />
                <centerbox class={"status"}>
                    <label
                        $type="start"
                        class={status.as((s) => {
                            switch (s.state) {
                                case "connected":
                                    return "connected";
                                case "disconnected":
                                    return "disconnected"
                                default:
                                    return "other";
                            }
                        })}
                        label={status.as((s) => s.state.charAt(0).toUpperCase() + s.state.slice(1))} />
                    <switch
                        $type="end"
                        cursor={Gdk.Cursor.new_from_name("pointer", null)}
                        $={(self) => {
                            if (mullvad.status.state == "connected" || mullvad.status.state == "connecting") {
                                self.active = true;
                            }

                            self.active ? self.add_css_class("activated") : self.remove_css_class("activated");

                            status.subscribe(() => {
                                if (mullvad.status.state == "connected") {
                                    self.active = true;
                                } else if (mullvad.status.state == "disconnected") {
                                    self.active = false;
                                }
                            })
                        }}
                        onNotifyActive={(self) => {
                            self.active ? self.add_css_class("activated") : self.remove_css_class("activated");

                            if (mullvad.status.state != "error" && mullvad.status.state != "discconnecting" && mullvad.status.state != "connecting") {
                                self.active ? exec(["bash", "-c", `mullvad connect`]) : exec(["bash", "-c", `mullvad disconnect`]);
                            }
                        }}
                    />
                </centerbox>
                <box class={"separator"} visible={status.as((s) => {
                    if (s.infos.city != undefined || s.infos.country != undefined || s.infos.hostname != undefined || s.infos.ipv4 != undefined) {
                        return true;
                    }
                    return false;
                })} />
                <With value={status}>
                    {(status) => {
                        return <box class={"infos"} orientation={Gtk.Orientation.VERTICAL} visible={true}>
                            <box visible={status.infos.country != undefined}>
                                <label class={"label"} label={"Country: "} />
                                <label class={"info"} label={status.infos.country} />
                            </box>
                            <box visible={status.infos.city != undefined}>
                                <label class={"label"} label={"City: "} />
                                <label class={"info"} label={status.infos.city} />
                            </box>
                            <box visible={status.infos.hostname != undefined}>
                                <label class={"label"} label={"Server: "} />
                                <label class={"info"} label={status.infos.hostname} />
                            </box>
                            <box visible={status.infos.ipv4 != undefined}>
                                <label class={"label"} label={"IP: "} />
                                <label class={"info"} label={status.infos.ipv4} />
                            </box>
                        </box>
                    }}
                </With>
            </box>
        </box>
    </window >
}