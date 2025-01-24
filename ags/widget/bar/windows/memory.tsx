import { bind, exec, Variable } from "astal";
import { App, Astal, Gtk } from "astal/gtk3";

const visible = Variable(false);

const memory = new Variable<string>("").poll(
    3000,
    (): string | Promise<string> => {
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
    }
);

export default function Memory() {

    return <window
        name={"memory"}
        marginTop={10}
        marginRight={170}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}
        setup={(self) => {
            self.hook(bind(self, "visible"), (_, v) => {
                visible.set(v);
            })
        }}>
        <box className={"memory"}>
            <scrollable hscroll={Gtk.PolicyType.NEVER} vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC} overlayScrolling={false}>
                <box vertical>
                    {
                        bind(memory).as((memory) => {
                            if (memory != "") {
                                return memory.split("\n").map((process) => {

                                    const processSplit = process.split(" ");

                                    return <box spacing={50}>
                                        <label label={processSplit[0]} expand xalign={Gtk.Align.FILL} />
                                        <label label={formatSize(Number(processSplit[1]) * 1024)} />
                                    </box>
                                })
                            } else {
                                return <label label={"Empty"} expand />
                            }
                        })
                    }
                </box>
            </scrollable>
        </box>
    </window>
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