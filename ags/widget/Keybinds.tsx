import { Accessor, createState } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import App from "ags/gtk4/app"
import { exec } from "ags/process";


export default function Keybinds() {

    const [search, searchSet] = createState("");
    const [searchValueReset, searchValueResetSet] = createState(false);

    const [binds, bindsSet] = createState(getKeybinds());

    const [nbBinds, nbBindsSet] = createState(0);

    Object.keys(binds.get()).forEach(key => {
        nbBindsSet(nbBinds.get() + binds.get()[key].length + 1);
    });

    const [nbLines, nbLinesSet] = createState(Math.ceil(nbBinds.get() / Math.min(Math.ceil(Math.sqrt(nbBinds.get())), 4)));

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
            <box spacing={10}>
                <entry
                    class={"search"}
                    hexpand
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
                <button class={"refresh"} label={""} cursor={Gdk.Cursor.new_from_name("pointer", null)} onClicked={() => {
                    bindsSet(getKeybinds());

                    nbBindsSet(0);
                    Object.keys(binds.get()).forEach(key => {
                        nbBindsSet(nbBinds.get() + binds.get()[key].length + 1);
                    });

                    nbLinesSet(Math.ceil(nbBinds.get() / Math.min(Math.ceil(Math.sqrt(nbBinds.get())), 4)));
                }} />
            </box>
            <scrolledwindow
                class={"list"}
                minContentHeight={Math.min(nbLines.get() * 40 - 20, 800)}
                overlayScrolling={false}
                hscrollbarPolicy={Gtk.PolicyType.NEVER}
                vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}>
                <Gtk.Grid
                    class={"grid"}
                    hexpand
                    vexpand
                    columnSpacing={30}
                    rowSpacing={20}
                    columnHomogeneous
                    $={(self) => {
                        addKeybinds(self, binds.get(), nbBinds.get(), nbLines.get(), search);

                        binds.subscribe(() => {
                            addKeybinds(self, binds.get(), nbBinds.get(), nbLines.get(), search);
                        })
                    }} />
            </scrolledwindow>
        </box>
    </window >
}

function addKeybinds(self: Gtk.Grid, binds: { [category: string]: { bind: string, description: string }[] }, nbBinds: number, nbLines: number, search: Accessor<string>) {
    let child = self.get_first_child();

    while (child) {
        self.remove(child);
        child = self.get_first_child();
    }

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
