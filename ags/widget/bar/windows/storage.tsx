import { bind } from "astal";
import { App, Astal, Gtk } from "astal/gtk3";
import StorageSerice from "../../../services/storage";

type Partition = {
    partlabel: string;
    mountpoints: string[];
    path: string;
    fstype: string;
    fsavail: number;
    size: number;
}

export default function Storage() {

    const storage = StorageSerice.get_default();
    
    return <window
        name={"storage"}
        marginTop={10}
        marginRight={170}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}>
        <box className={"storage"}>
            <scrollable overlayScrolling={false} vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}>
                <box vertical spacing={10}>
                    {
                        bind(storage, "devices").as((devices) => devices.map((device) => {

                            const partitions = device.children;

                            return <box className={"device"} vertical vexpand={false}>
                                <box className={"overview"}>
                                    <icon
                                        className={"icon"}
                                        setup={(self) => {
                                            switch (device.tran) {
                                                case "nvme":
                                                    self.icon = "drive-harddisk";
                                                    break;
                                                case "usb":
                                                    self.icon = "drive-harddisk-usb-symbolic";
                                                    break;
                                                default:
                                                    self.icon = "dialog-question-symbolic";
                                                    break;
                                            }
                                        }}
                                    />
                                    <box className={"infos"} vertical>
                                        <label
                                            className={"model"}
                                            label={device.model}
                                            xalign={Gtk.Align.FILL}
                                        />
                                        <box>
                                            <label
                                                className={"path"}
                                                label={device.path}
                                                expand
                                                xalign={Gtk.Align.FILL}
                                            />
                                            <label
                                                className={"size"}
                                                label={formatSize(device.size)}
                                            />
                                        </box>
                                    </box>
                                </box>
                                <box className={"partitions"} vertical>
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
                        }))
                    }
                </box>
            </scrollable>
        </box >
    </window >
}

function formatSize(bytes: number): string {

    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const value = bytes / Math.pow(k, i);

    const decimals = value < 10 ? 2 : value < 100 ? 1 : 0;

    return `${value.toFixed(decimals)} ${sizes[i]}`;
}


function getPartition(partition: Partition, index: number, nbIndex: number, subIndex: number | null, nbSubIndex: number | null) {

    return <box className={"partition"} vertical>
        <box>
            <label
                className={"label"}
                label={partition.partlabel || "Partition"}
                xalign={Gtk.Align.FILL}
                expand
            />
            <label className={"mount"} label={partition.mountpoints[0]} />
        </box>

        <box spacing={10}>
            <label className={"path"} label={partition.path} />
            <label
                className={"fstype"}
                label={partition.fstype}
                expand
                xalign={Gtk.Align.FILL}
            />
            <label
                className={"size"}
                setup={(self) => {
                    if (partition.fsavail != null) {
                        self.label = formatSize(partition.size - partition.fsavail) + " / " + formatSize(partition.size);
                    } else {
                        self.label = formatSize(partition.size);
                    }
                }}
            />
        </box>
        <box
            className={"separator"}
            setup={(self => {
                if (subIndex != null && nbSubIndex != null) {
                    if (index + 1 == nbIndex && subIndex + 1 == nbSubIndex) {
                        self.visible = false;
                    } else {
                        self.visible = true;
                    }
                } else {
                    if (index + 1 == nbIndex) {
                        self.visible = true;
                    }
                }
            })}
        />
    </box>
}