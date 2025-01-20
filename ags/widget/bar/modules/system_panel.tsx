import { bind } from "astal";
import { App, Astal } from "astal/gtk3";
import Bluetooth from "gi://AstalBluetooth";
import Network from "gi://AstalNetwork";

const bluetooth = Bluetooth.get_default();
const network = Network.get_default();

export default function SystemPanel() {

    return <box className={"system_panel"}>
        <button className={"network"}>
            {
                bind(network, "primary").as((type) => {
                    switch (type) {
                        case 0:
                            return <icon icon={"network-wired-disconnected-symbolic"} />
                        case 1:
                            return <icon icon={"network-wired-symbolic"} />
                        case 2:
                            return <icon icon={bind(network.wifi, "strength").as((s) => {

                                const strengthIcons = {
                                    100: "network-wireless-100",
                                    80: "network-wireless-80",
                                    60: "network-wireless-60",
                                    40: "network-wireless-40",
                                    20: "network-wireless-20",
                                }

                                const strengthIcon = [20, 40, 60, 80, 100].find(threshold => threshold >= s);

                                // @ts-ignore
                                return strengthIcons[strengthIcon];
                            })} />
                    }
                })
            }
        </button>
        <button
            className={"bluetooth"}
            onClicked={() => {
                App.toggle_window("bleutooth");
            }}>
            <icon icon={bind(bluetooth, "isPowered").as((powered) => powered ? "bluetooth-active" : "bluetooth-disabled")} />
        </button>
        <button
            className={"tray"}
            label={""}
            onClicked={() => {
                App.toggle_window("tray");
            }}
        />
    </box>
}