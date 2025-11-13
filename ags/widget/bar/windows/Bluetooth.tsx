import { Astal, Gdk, Gtk } from "ags/gtk4";
import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import App from "ags/gtk4/app";
import { createBinding, With } from "ags";

const bluetooth = AstalBluetooth.get_default();
const adapter = bluetooth.adapter;

export default function Bluetooth() {

    const devices = createBinding(bluetooth, "devices");

    return <window
        name={"Bleutooth"}
        marginTop={10}
        marginRight={10}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}>
        <box
            class={"bluetooth"}
            orientation={Gtk.Orientation.VERTICAL}
            spacing={10}
            heightRequest={10}
            valign={Gtk.Align.START}
            $={(self) => {
                devices.subscribe(() => {
                    self.heightRequest = 100;
                    self.queue_resize();
                })
            }}>
            <box class={"controls"} spacing={10}>
                <label
                    label={createBinding(adapter, "powered").as((p) => p ? " Bluetooth Enabled" : " Bluetooth Disabled")}
                    hexpand
                    halign={Gtk.Align.START}
                />
                <button
                    class={"search"}
                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                    label={createBinding(adapter, "discovering").as((d) => d ? "" : "")}
                    visible={createBinding(bluetooth, "isPowered")}
                    onClicked={() => {
                        if (adapter.discovering) {
                            adapter.stop_discovery();
                        } else {
                            adapter.start_discovery();
                        }
                    }}
                    $={(self) => {
                        adapter.discovering ? self.add_css_class("discover") : self.remove_css_class("discover");

                        adapter.connect("notify::discovering", () => {
                            adapter.discovering ? self.add_css_class("discover") : self.remove_css_class("discover");
                        })
                    }}
                />
                <switch
                    active={createBinding(adapter, "powered")}
                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                    $={(self) => {
                        adapter.powered ? self.add_css_class("activated") : self.remove_css_class("activated");

                        adapter.connect("notify::powered", () => {
                            adapter.powered ? self.add_css_class("activated") : self.remove_css_class("activated");
                        })
                    }}
                    onNotifyActive={(self) => {
                        if (self.active != adapter.powered) {
                            self.active ? self.add_css_class("activated") : self.remove_css_class("activated");
                            adapter.set_powered(self.active);
                        }
                    }}
                />
            </box>
            <scrolledwindow
                overlayScrolling={false}
                vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
                visible={createBinding(bluetooth, "devices").as((d) => Object.values(d).filter(d => d.name !== null).length > 0)}
                $={(self) => {
                    self.minContentHeight = getHeight(bluetooth.devices);

                    bluetooth.connect("notify::devices", () => {
                        self.minContentHeight = getHeight(bluetooth.devices);
                    })

                    adapter.connect("notify::powered", async () => {
                        self.minContentHeight = getHeight(bluetooth.devices);
                    })
                }}>
                <box>
                    <With value={devices}>
                        {(devices) => {
                            const sortedDevices = devices
                                .filter(device => device.name !== null)
                                .filter(device => adapter.powered || device.paired)
                                .sort((a, b) => {
                                    if (a.paired !== b.paired) {
                                        return Number(b.paired) - Number(a.paired);
                                    }
                                    return a.name!.localeCompare(b.name!);
                                });

                            return <box
                                class={"devices"}
                                orientation={Gtk.Orientation.VERTICAL}
                                spacing={10}
                                hexpand>
                                {
                                    sortedDevices.map((device) => {
                                        return <box
                                            class={"device"}
                                            spacing={10}
                                            vexpand={false}
                                            visible={createBinding(adapter, "powered").as((p) => {
                                                if (!bluetooth.devices.includes(device)) {
                                                    return false;
                                                }

                                                return p || device.paired
                                            })}>
                                            <image class={"icon"} iconName={createBinding(device, "icon").as((i) => i != null ? i : "bluetooth")} />
                                            <box class={"infos"} orientation={Gtk.Orientation.VERTICAL} vexpand hexpand>
                                                <label class={"name"} label={createBinding(device, "alias")} halign={Gtk.Align.START} />
                                                <label class={"address"} label={createBinding(device, "address")} halign={Gtk.Align.START} />
                                            </box>
                                            <box spacing={5}>
                                                <box class={"status"} orientation={Gtk.Orientation.VERTICAL} spacing={3}>
                                                    <label class={"trust"} label={""} visible={createBinding(device, "trusted")} />
                                                    <label class={"block"} label={""} visible={createBinding(device, "blocked")} />
                                                </box>
                                                <button
                                                    class={"connect"}
                                                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                                    visible={createBinding(device, "paired")}
                                                    $={(self) => {
                                                        device.connected ? self.add_css_class("connected") : self.remove_css_class("connected");

                                                        device.connect("notify::connected", () => {
                                                            device.connected ? self.add_css_class("connected") : self.remove_css_class("connected");
                                                        })
                                                    }}
                                                    onClicked={() => {
                                                        if (device.connected) {
                                                            device.disconnect_device(() => null);
                                                        } else {
                                                            device.connect_device(() => null);
                                                        }
                                                    }}>
                                                    <With value={createBinding(device, "connecting")}>
                                                        {(connecting) => {
                                                            if (connecting) {
                                                                return <Gtk.Spinner $={(self) => self.start()} />
                                                            } else {
                                                                return <label label={createBinding(device, "connected").as((c) => c ? "Disconnect" : "Connect")} />
                                                            }
                                                        }}
                                                    </With>
                                                </button>
                                                <button
                                                    class={"pair"}
                                                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                                    visible={createBinding(device, "paired").as((p) => !p)}
                                                    label={createBinding(device, "paired").as((p) => p ? "unpair" : "pair")}
                                                    onClicked={() => {
                                                        device.pair();

                                                        if (adapter.discovering) {
                                                            adapter.stop_discovery();
                                                        }
                                                    }}
                                                />
                                                <menubutton class={"options"} label={""} direction={Gtk.ArrowType.NONE} cursor={Gdk.Cursor.new_from_name("pointer", null)}>

                                                    <popover>
                                                        <box orientation={Gtk.Orientation.VERTICAL} spacing={5}>
                                                            <button
                                                                label={createBinding(device, "paired").as((d) => d ? "Remove" : "Add")}
                                                                onClicked={() => {
                                                                    adapter.remove_device(device);
                                                                }} />
                                                            <button
                                                                label={createBinding(device, "trusted").as((d) => d ? "Untrust" : "Trust")}
                                                                onClicked={() => {
                                                                    device.set_trusted(!device.get_trusted());
                                                                }} />
                                                            <button
                                                                label={createBinding(device, "blocked").as((d) => d ? "Unblock" : "Block")}
                                                                onClicked={() => {
                                                                    device.set_blocked(!device.get_blocked());
                                                                }} />
                                                        </box>
                                                    </popover>
                                                </menubutton>
                                            </box>
                                        </box>
                                    })
                                }
                            </box>
                        }}
                    </With>
                </box>
            </scrolledwindow>
        </box >
    </window >
}

function getHeight(devices: AstalBluetooth.Device[]) {
    const length = devices.filter(device => device.name !== null).length;

    if (length < 5) {
        return (length * 57) + ((length - 1) * 10);
    } else {
        return 300;
    }
}