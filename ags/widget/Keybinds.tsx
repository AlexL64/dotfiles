// import { GtkGrid } from "../my_types";

import { createState } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import App from "ags/gtk4/app"
import { exec } from "ags/process";


export default function Keybinds() {

    const [search, searchSet] = createState("");
    const [searchValueReset, searchValueResetSet] = createState(false);

    const binds = getKeybinds();

    let nbBinds = 0;

    Object.keys(binds).forEach(key => {
        nbBinds += binds[key].length + 1;
    });

    const nbLines = Math.ceil(nbBinds / Math.min(Math.ceil(Math.sqrt(nbBinds)), 4));

    return <window
        name={"Keybinds"}
        exclusivity={Astal.Exclusivity.NORMAL}
        layer={Astal.Layer.OVERLAY}
        keymode={Astal.Keymode.EXCLUSIVE}
        application={App}
        visible={false}
        $={(self) => {
            const eventControllerKey = new Gtk.EventControllerKey();

            self.add_controller(eventControllerKey);

            eventControllerKey.connect("key-pressed", (_, keyval, keycode, state) => {
                if (keyval == Gdk.KEY_Escape) {
                    searchValueResetSet(true);
                    self.hide();
                }
            });
        }}>
        <box class={"keybinds"} orientation={Gtk.Orientation.VERTICAL}>
            <entry
                class={"search"}
                onNotifyText={(self) => {
                    searchSet(self.text);
                }}
                $={(self) => {
                    searchValueReset.subscribe(() => {
                        if (searchValueReset.get()) {
                            self.text = "";
                            searchValueResetSet(false);
                        }
                    })
                }}
            />
            <scrolledwindow
                class={"list"}
                minContentHeight={Math.min(nbLines * 40 - 20, 800)}
                overlayScrolling={false}
                hscrollbarPolicy={Gtk.PolicyType.NEVER}
                vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            >
                <Gtk.Grid
                    class={"grid"}
                    hexpand
                    vexpand
                    columnSpacing={30}
                    rowSpacing={20}
                    columnHomogeneous
                    $={(self) => {

                        let i = 0;
                        let j = 0;

                        Object.keys(binds).forEach(categorie => {

                            if (j + 1 >= nbLines) {
                                j = 0;
                                i++;
                            }

                            self.attach(<box class={"categorie"}>
                                <label label={categorie} />
                            </box> as Gtk.Widget, i, j, 1, 1);

                            j++;

                            binds[categorie].forEach(line => {
                                self.attach(<box class={"keybind"}>
                                    <label
                                        class={"bind"}
                                        label={line.bind}
                                        xalign={Gtk.Align.FILL}
                                        $={(self) => {
                                            search.subscribe(() => {
                                                const s = search.get();

                                                s != "" && line.bind.toLowerCase().includes(s.toLowerCase()) ? self.add_css_class("highlight") : self.remove_css_class("highlight");
                                            })
                                        }}
                                    />
                                    <label label={": "} />
                                    <label
                                        label={line.description}
                                        xalign={Gtk.Align.FILL}
                                        $={(self) => {
                                            search.subscribe(() => {
                                                const s = search.get();

                                                s != "" && line.description.toLowerCase().includes(s.toLowerCase()) ? self.add_css_class("highlight") : self.remove_css_class("highlight");
                                            })
                                        }}
                                    />
                                </box> as Gtk.Widget, i, j, 1, 1);

                                if (j + 1 >= nbLines) {
                                    j = 0;
                                    i++;
                                } else {
                                    j++;
                                }
                            });
                        });
                    }} />
            </scrolledwindow>
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
