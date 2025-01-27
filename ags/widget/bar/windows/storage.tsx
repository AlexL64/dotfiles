import { bind } from "astal";
import { App, Astal, Gtk } from "astal/gtk3";
import StorageSerice from "../../../services/storage";

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
        {
            bind(storage, "devices").as((devices) => {

                return <box className={"storage"}>
                    <scrollable overlayScrolling={false} vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}>
                        <box
                            vertical
                            spacing={10}
                            setup={(self) => {
                                for (let i = 0; i < devices.length; i++) {
                                    self.add_child(
                                        Gtk.Builder.new(),
                                        <box className={"device"} vertical vexpand={false}>
                                            <box className={"overview"}>
                                                <icon
                                                    className={"icon"}
                                                    setup={(self) => {
                                                        switch (devices[i].tran) {
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
                                                        label={devices[i].model}
                                                        xalign={Gtk.Align.FILL}
                                                    />
                                                    <box>
                                                        <label
                                                            className={"path"}
                                                            label={devices[i].path}
                                                            expand
                                                            xalign={Gtk.Align.FILL}
                                                        />
                                                        <label
                                                            className={"size"}
                                                            label={formatSize(devices[i].size)}
                                                        />
                                                    </box>
                                                </box>
                                            </box>
                                            <box
                                                className={"partitions"}
                                                vertical
                                                setup={(self) => {

                                                    const partitions = devices[i].children;

                                                    for (let j = 0; j < partitions.length; j++) {

                                                        if (partitions[j].children != undefined) {
                                                            var partition = partitions[j].children[0];
                                                            partition.partlabel = partitions[j].partlabel;
                                                        } else {
                                                            var partition = partitions[j];
                                                        }


                                                        self.add_child(
                                                            Gtk.Builder.new(),
                                                            <box className={"partition"} vertical>
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
                                                                <box className={"separator"} visible={j + 1 < partitions.length} />
                                                            </box>,
                                                            null
                                                        )
                                                    }
                                                }}
                                            />
                                        </box>,
                                        null
                                    );
                                }
                            }}
                        />
                    </scrollable>
                </box>
            })
        }
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