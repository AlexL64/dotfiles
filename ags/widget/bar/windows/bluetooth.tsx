import { bind } from "astal";
import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { GtkMenu, GtkMenuItem } from "../../../my_types";
import AstalBluetooth from "gi://AstalBluetooth";

const bluetooth = AstalBluetooth.get_default();
const adapter = bluetooth.adapter;

export default function Bluetooth() {

    return <window
        name={"bleutooth"}
        marginTop={10}
        marginRight={10}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}>
        <box className={"bluetooth"} vertical spacing={10}>
            <box className={"controls"} spacing={10}>
                <label
                    label={bind(adapter, "powered").as((p) => p ? " Bluetooth Enabled" : " Bluetooth Disabled")}
                    expand
                    halign={Gtk.Align.START}
                />
                <button
                    className={"search"}
                    label={bind(adapter, "discovering").as((d) => d ? "" : "")}
                    visible={bind(bluetooth, "isPowered")}
                    onClick={() => {
                        if (adapter.discovering) {
                            adapter.stop_discovery();
                        } else {
                            adapter.start_discovery();
                        }
                    }}
                    setup={(self) => {
                        self.toggleClassName("discover", !adapter.discovering);

                        self.hook(bind(adapter, "discovering"), (_, d) => {
                            self.toggleClassName("discover", !d);
                        })
                    }}
                />
                <switch
                    active={bind(adapter, "powered")}
                    setup={(self) => {
                        self.toggleClassName("activated", adapter.powered);

                        self.hook(bind(adapter, "powered"), (_, powered) => {
                            self.toggleClassName("activated", powered);
                        })
                    }}
                    onNotifyActive={(self) => {
                        if (self.active != adapter.powered) {
                            self.toggleClassName("activated", self.active);
                            adapter.set_powered(self.active);
                        }
                    }}
                />
            </box>
            <scrollable
                overlayScrolling={false}
                vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
                minContentHeight={bind(bluetooth, "devices").as((d) => {
                    const length = d.filter(e => e.name !== null).length;

                    if (length < 4) {
                        return (length * 57) + ((length - 1) * 10);
                    } else {
                        return 300;
                    }

                })}>
                <box
                    className={"devices"}
                    vertical
                    spacing={10}
                    visible={bind(bluetooth, "devices").as((d) => Object.values(d).filter(d => d.name !== null).length > 0)}>
                    {
                        bind(bluetooth, "devices").as((devices) => devices.map((device) => {

                            if (device.name !== null) {

                                return <box className={"device"} spacing={10} expand={false}>
                                    <icon className={"icon"} icon={bind(device, "icon").as((i) => i != null ? i : "bluetooth")} />
                                    <box className={"infos"} vertical expand>
                                        <label className={"name"} label={bind(device, "alias")} halign={Gtk.Align.START} />
                                        <label className={"address"} label={bind(device, "address")} halign={Gtk.Align.START} />
                                    </box>
                                    <box spacing={5}>
                                        <box className={"status"} vertical spacing={3}>
                                            <label className={"trust"} label={""} visible={bind(device, "trusted")} />
                                            <label className={"block"} label={""} visible={bind(device, "blocked")} />
                                        </box>
                                        <button
                                            className={"connect"}
                                            visible={bind(device, "paired")}
                                            label={bind(device, "connected").as((c) => c ? "Disconnect" : "Connect")}
                                            setup={(self) => {
                                                self.toggleClassName("connected", device.connected);

                                                self.hook(bind(device, "connected"), (_, connected) => {
                                                    self.toggleClassName("connected", connected);
                                                })
                                            }}
                                            onClick={() => {
                                                if (device.connected) {
                                                    device.disconnect_device(() => null);
                                                } else {
                                                    device.connect_device(() => null);
                                                }
                                            }}
                                        />
                                        <button
                                            className={"pair"}
                                            visible={bind(device, "paired").as((p) => !p)}
                                            label={bind(device, "paired").as((p) => p ? "unpair" : "pair")}
                                            onClick={() => {
                                                device.pair();

                                                if (adapter.discovering) {
                                                    adapter.stop_discovery();
                                                }
                                            }}
                                        />
                                        <button
                                            className={"options"}
                                            visible={bind(device, "paired")}
                                            label={""}
                                            onClick={(self) => {
                                                const menu = optionsMenu(device);
                                                // @ts-ignore
                                                menu.popup_at_widget(self, Gdk.Gravity.SOUTH_EAST, Gdk.Gravity.NORTH_EAST, null);
                                            }} />
                                    </box>
                                </box>
                            } else {
                                return <box visible={false} />;
                            }
                        }))
                    }
                </box>
            </scrollable>
        </box>
    </window >
}

function optionsMenu(device: AstalBluetooth.Device) {

    return <GtkMenu>
        <GtkMenuItem
            onActivate={() => {
                adapter.remove_device(device);

                adapter.start_discovery();
                setTimeout(() => {
                    adapter.stop_discovery();
                }, 500);
            }}>
            <label setup={(self) => self.label = device.paired ? "Remove" : "Add"} />
        </GtkMenuItem>
        <GtkMenuItem
            onActivate={() => {
                device.set_trusted(!device.get_trusted());
            }}>
            <label setup={(self) => self.label = device.trusted ? "Untrust" : "Trust"} />
        </GtkMenuItem>
        <GtkMenuItem
            onActivate={() => {
                device.set_blocked(!device.get_blocked());
            }}>
            <label setup={(self) => self.label = device.blocked ? "Unblock" : "Block"} />
        </GtkMenuItem>
    </GtkMenu>
}