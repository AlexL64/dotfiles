import { createState, For, With, } from "ags";
import { Astal, Gtk } from "ags/gtk4";
import { exec } from "ags/process";
import { createPoll } from "ags/time";
import App from "ags/gtk4/app";

const [visible, visibleSet] = createState(false)

const memory = createPoll<string>("", 3000, (): string | Promise<string> => {
    if (visible.get()) {
        return exec(
            [
                'bash',
                '-c',
                `ps aux --sort=-%mem | awk '{a[$11]+=$6} END {for (i in a) if (a[i] > 0) print i, a[i]}' | sort -k2 -nr`
            ]
        );
    } else {
        return memory.get();
    }
})

export default function Memory() {

    return <window
        name={"Memory"}
        marginTop={10}
        marginRight={214}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}
        onNotifyVisible={(self) => {
            visibleSet(self.visible);
        }}>
        <box class={"memory"}>
            <scrolledwindow hscrollbarPolicy={Gtk.PolicyType.NEVER} vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC} overlayScrolling={false}>
                <With value={memory}>
                    {(memory) => {
                        if (memory != "") {
                            return <box class={"process"} orientation={Gtk.Orientation.VERTICAL}>
                                {
                                    memory.split("\n").map((process) => {

                                        const processSplit = process.split(" ");

                                        return <box spacing={50}>
                                            <label label={processSplit[0]} vexpand hexpand xalign={Gtk.Align.FILL} />
                                            <label label={formatSize(Number(processSplit[1]) * 1024)} />
                                        </box>
                                    })
                                }
                            </box>
                        } else {
                            return <label label={"Empty"} vexpand hexpand />
                        }
                    }}
                </With>
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