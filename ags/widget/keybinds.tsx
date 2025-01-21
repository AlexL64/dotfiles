import { exec, Variable } from "astal";
import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import { GtkGrid } from "../my_types";


export default function Keybinds() {

    const search = Variable("");
    const searchValueReset = Variable(false);

    const binds = getKeybinds();

    let nbBinds = 0;

    Object.keys(binds).forEach(key => {
        nbBinds += binds[key].length + 1;
    });

    const nbLines = Math.ceil(nbBinds / Math.min(Math.ceil(Math.sqrt(nbBinds)), 4));

    return <window
        name={"keybinds"}
        exclusivity={Astal.Exclusivity.NORMAL}
        layer={Astal.Layer.OVERLAY}
        keymode={Astal.Keymode.EXCLUSIVE}
        application={App}
        visible={false}
        onKeyPressEvent={(self, event: Gdk.Event) => {
            if (event.get_keyval()[1] == Gdk.KEY_Escape) {
                searchValueReset.set(true);
                self.hide();
            }
        }}>
        <box className={"keybinds"} vertical>
            <entry
                className={"search"}
                onChanged={(self) => {
                    search.set(self.text);
                }}
                setup={(self) => {
                    self.hook(searchValueReset, (reset) => {
                        if (reset) {
                            self.text = "";
                            searchValueReset.set(false);
                        }
                    })
                }}
            />
            <scrollable
                className={"list"}
                minContentHeight={Math.min(nbLines * 40 - 20, 800)}
                overlayScrolling={false}
                hscroll={Gtk.PolicyType.NEVER}
                vscroll={Gtk.PolicyType.AUTOMATIC}>
                <GtkGrid
                    className={"grid"}
                    expand
                    columnSpacing={30}
                    rowSpacing={20}
                    columnHomogeneous
                    setup={(self) => {

                        let i = 0;
                        let j = 0;

                        Object.keys(binds).forEach(categorie => {

                            if (j + 1 >= nbLines) {
                                j = 0;
                                i++;
                            }

                            self.attach(<box className={"categorie"}>
                                <label label={categorie} />
                            </box>, i, j, 1, 1);

                            j++;

                            binds[categorie].forEach(line => {
                                self.attach(<box className={"keybind"}>
                                    <label
                                        className={"bind"}
                                        label={line.bind}
                                        xalign={Gtk.Align.FILL}
                                        setup={(self) => {
                                            self.hook(search, (_, s) => {
                                                self.toggleClassName(
                                                    "highlight",
                                                    (s != "" && line.bind.toLowerCase().includes(s.toLowerCase()))
                                                );
                                            })
                                        }}
                                    />
                                    <label label={": "} />
                                    <label
                                        label={line.description}
                                        xalign={Gtk.Align.FILL}
                                        setup={(self) => {
                                            self.hook(search, (_, s) => {
                                                self.toggleClassName(
                                                    "highlight",
                                                    (s != "" && line.description.toLowerCase().includes(s.toLowerCase()))
                                                );
                                            })
                                        }}
                                    />
                                </box>, i, j, 1, 1);

                                if (j + 1 >= nbLines) {
                                    j = 0;
                                    i++;
                                } else {
                                    j++;
                                }
                            });
                        });
                    }} />
            </scrollable>
        </box>
    </window >

}

function getKeybinds(): { [category: string]: { bind: string, description: string, }[] } {

    let result: { [category: string]: { bind: string, description: string, }[] } = {};

    const list = exec(
        [
            "bash",
            "-c",
            "hyprctl binds | grep description"
        ]
    ).split(/\n\t/)
        .map(line => line.replace("description:", "").trim())
        .filter(line => line !== "")
        .map(line => {
            const match = line.match(/"([^"]+)"\s+"([^"]+)"\s+"([^"]+)"/);
            if (match) {
                return {
                    categorie: match[1],
                    bind: match[2],
                    description: match[3]
                };
            }
            return null;
        }).filter(Boolean);

    list.forEach((line) => {
        if (line != null) {
            if (line.categorie in result) {
                result[line.categorie].push({
                    bind: line.bind,
                    description: line.description
                })
            } else {
                result[line.categorie] = [];
                result[line.categorie].push({
                    bind: line.bind,
                    description: line.description
                })
            }
        }
    })

    return result;
}
