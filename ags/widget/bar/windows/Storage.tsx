import { Astal, Gtk } from "ags/gtk4";
import StorageService from "../../../services/Storage";
import App from "ags/gtk4/app";
import { createBinding, For } from "ags";

type Partition = {
    partlabel: string;
    mountpoints: string[];
    path: string;
    fstype: string;
    fsused: number;
    size: number;
}

export default function Storage() {

    const storage = StorageService.get_default();

    const devices = createBinding(storage, "devices");

    return <window
        name={"Storage"}
        marginTop={10}
        marginRight={214}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        defaultHeight={-1}
        defaultWidth={-1}
        visible={false}>
        <box class={"storage"} valign={Gtk.Align.START}>
            <scrolledwindow overlayScrolling={false} vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC} $={(self) => {
                devices.subscribe(() => {
                    const child_height = self.get_first_child()?.get_first_child()?.measure(Gtk.Orientation.VERTICAL, 999)[0];

                    if (child_height != undefined && child_height > 0) {
                        self.heightRequest = child_height;
                    }
                })
            }}>
                <box orientation={Gtk.Orientation.VERTICAL} spacing={10} valign={Gtk.Align.START}>
                    <For each={devices}>
                        {(device) => {
                            const partitions = device.children;
                            return <box class={"device"} orientation={Gtk.Orientation.VERTICAL} vexpand={false}>
                                <box class={"overview"}>
                                    <image class={"icon"} $={(self) => {
                                        switch (device.tran) {
                                            case "nvme":
                                                self.iconName = "drive-harddisk";
                                                break;
                                            case "usb":
                                                self.iconName = "drive-harddisk-usb-symbolic";
                                                break;
                                            default:
                                                self.iconName = "dialog-question-symbolic";
                                                break;
                                        }
                                    }} />
                                    <box class={"infos"} orientation={Gtk.Orientation.VERTICAL}>
                                        <label
                                            class={"model"}
                                            label={device.model}
                                            xalign={Gtk.Align.FILL}
                                        />
                                        <box>
                                            <label
                                                class={"path"}
                                                label={device.path}
                                                vexpand
                                                hexpand
                                                xalign={Gtk.Align.FILL}
                                            />
                                            <label
                                                class={"size"}
                                                label={formatSize(device.size)}
                                            />
                                        </box>
                                    </box>
                                </box>
                                <box class={"partitions"} orientation={Gtk.Orientation.VERTICAL}>
                                    {
                                        partitions.map((partition, index) => {

                                            if (partition.children != undefined) {
                                                return partition.children.map((subPartition, subIndex) => {
                                                    if (subPartition.partlabel == null) {
                                                        subPartition.partlabel = partition.partlabel;
                                                    }

                                                    return getPartition(subPartition, index, partitions.length, subIndex, partition.children.length);
                                                })
                                            } else {
                                                return getPartition(partition, index, partitions.length, null, null);
                                            }
                                        })
                                    }
                                </box>
                            </box>
                        }}
                    </For>
                </box>
            </scrolledwindow>
        </box >
    </window >
}

function formatSize(bytes: number): string {

    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const value = bytes / Math.pow(k, i);

    const decimals = value < 10 ? 2 : value < 100 ? 1 : 0;

    return `${value.toFixed(decimals)} ${sizes[i]}`;
}


function getPartition(partition: Partition, index: number, nbIndex: number, subIndex: number | null, nbSubIndex: number | null) {

    return <box class={"partition"} orientation={Gtk.Orientation.VERTICAL}>
        <box>
            <label
                class={"label"}
                label={partition.partlabel || "Partition"}
                xalign={Gtk.Align.FILL}
                vexpand
                hexpand
            />
            <label class={"mount"} label={partition.mountpoints[0]} />
        </box>

        <box spacing={10}>
            <label class={"path"} label={partition.path} />
            <label
                class={"fstype"}
                label={partition.fstype}
                vexpand
                hexpand
                xalign={Gtk.Align.FILL}
            />
            <label
                class={"size"}
                $={(self) => {
                    if (partition.fsused != null) {
                        self.label = formatSize(partition.fsused) + " / " + formatSize(partition.size);
                    } else {
                        self.label = formatSize(partition.size);
                    }
                }}
            />
        </box>
        <box
            class={"separator"}
            $={(self => {
                if (subIndex != null && nbSubIndex != null) {
                    if (index + 1 == nbIndex && subIndex + 1 == nbSubIndex) {
                        self.visible = false;
                    } else {
                        self.visible = true;
                    }
                } else {
                    if (index + 1 == nbIndex) {
                        self.visible = false;
                    } else {
                        self.visible = true;
                    }
                }
            })}
        />
    </box>
}