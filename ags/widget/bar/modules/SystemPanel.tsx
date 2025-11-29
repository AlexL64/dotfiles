import { createBinding, With } from "ags";
import App from "ags/gtk4/app"
import Bluetooth from "gi://AstalBluetooth?version=0.1";
import Network from "gi://AstalNetwork?version=0.1";
import { Gdk, Gtk } from "ags/gtk4";
import Mullvad from "../../../services/Mullvad";

const bluetooth = Bluetooth.get_default();
const network = Network.get_default();

export default function SystemPanel() {

    const mullvad = Mullvad.get_default();

    const status = createBinding(mullvad, "status");

    return <box class={"system_panel"}>
        <button
            class={"network"}
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            onClicked={() => {
                App.toggle_window("Network");
            }}>
            <box>
                <box>
                    <With value={createBinding(network, "primary")}>
                        {(type) => {
                            switch (type) {
                                case 0:
                                    return <image iconName={"network-wired-disconnected-symbolic"} />
                                case 1:
                                    return <image iconName={"network-wired-symbolic"} />
                                case 2:
                                    return <image iconName={createBinding(network.wifi, "strength").as((s) => {

                                        const icons = {
                                            100: "network-wireless-100",
                                            80: "network-wireless-80",
                                            60: "network-wireless-60",
                                            40: "network-wireless-40",
                                            20: "network-wireless-20",
                                        }

                                        const icon = [20, 40, 60, 80, 100].find(threshold => threshold >= s) as keyof typeof icons;

                                        return `${icons[icon]}`;
                                    })} />
                            }
                        }}
                    </With>
                </box>
                <label halign={Gtk.Align.END} $={(self) => {
                    switch (mullvad.status.state) {
                        case "connected":
                            self.label = "";
                            self.set_css_classes(["connected"]);
                            break;
                        case "disconnected":
                            self.label = "";
                            self.set_css_classes(["disconnected"]);
                            break;
                        default:
                            self.label = "";
                            self.set_css_classes(["other"]);
                            break;
                    }

                    status.subscribe(() => {
                        switch (mullvad.status.state) {
                            case "connected":
                                self.label = "";
                                self.set_css_classes(["connected"]);
                                break;

                            case "disconnected":
                                self.label = "";
                                self.set_css_classes(["disconnected"]);
                                break;
                            default:
                                self.label = "";
                                self.set_css_classes(["other"]);
                                break;
                        }
                    })
                }} />
            </box>
        </button>
        <box class={"separator"} />
        <button
            class={"bluetooth"}
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            onClicked={() => {
                App.toggle_window("Bleutooth");
            }}>
            <image iconName={createBinding(bluetooth, "isPowered").as((powered) => powered ? "bluetooth-active" : "bluetooth-disabled")} />
        </button>
        <box class={"separator"} />
        <button
            class={"tray"}
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            label={""}
            onClicked={() => {
                App.toggle_window("Tray");
            }}
        />
        <box class={"separator"} />
        <button
            class={"power"}
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            label={""}
            onClicked={() => {
                App.toggle_window("Power");
            }}
        />
    </box>
}