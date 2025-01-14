import { bind } from "astal";
import { Astal } from "astal/gtk3";
import Bluetooth from "gi://AstalBluetooth";
import Network from "gi://AstalNetwork";

const bluetooth = Bluetooth.get_default();
const network = Network.get_default();

export default function SystemPanel() {

    return <box className={"system_panel"}>
        <button className={"network"} >
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
                                    90: "network-wireless-20",
                                    80: "network-wireless-40",
                                    70: "network-wireless-60",
                                    67: "network-wireless-80",
                                    30: "network-wireless-100",
                                }

                                const strengthIcon = [30, 67, 70, 80, 90].find(threshold => threshold >= s);

                                // @ts-ignore
                                return strengthIcons[strengthIcon];
                            })} />
                    }
                })
            }
        </button>
        <button className={"bluetooth"}>
            <icon icon={bind(bluetooth, "isPowered").as((powered) => powered ? "bluetooth-active" : "bluetooth-disabled")} />
        </button>
        <button
            className={"tray_button"}
            label={""}
        />
    </box>
}