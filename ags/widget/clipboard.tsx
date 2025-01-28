import { bind, execAsync, Variable } from "astal";
import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import ClipboardService from "./../services/clipboard"

const searchValue = Variable("");
const searchValueReset = Variable(false);

const itemsPerPage = 8;
const itemsOnLastPage = Variable(0);

const nbEntries = Variable(0);

const nbPages = Variable(0);
const selectedPage = Variable(0);
const selectedLine = Variable(0);
const selectedId = Variable(0);

const clipboard = ClipboardService.get_default();

export default function Clipboard() {

    return <window
        name={"clipboard"}
        exclusivity={Astal.Exclusivity.NORMAL}
        layer={Astal.Layer.OVERLAY}
        keymode={Astal.Keymode.EXCLUSIVE}
        application={App}
        visible={false}
        setup={(self) => {
            self.hook(bind(self, "visible"), (_, v) => {
                if (!v) {
                    selectedLine.set(0);
                    selectedPage.set(0);
                    searchValueReset.set(true);
                }
            })
        }}
        onKeyPressEvent={(self, event: Gdk.Event) => {
            switch (event.get_keyval()[1]) {
                case Gdk.KEY_Up:
                    if (selectedLine.get() == 0) {
                        if (selectedPage.get() == 0) {
                            selectedLine.set(itemsOnLastPage.get() - 1);
                            selectedPage.set(nbPages.get() - 1);
                        } else {
                            selectedLine.set(itemsPerPage - 1);
                            selectedPage.set(selectedPage.get() - 1);
                        }
                    } else {
                        selectedLine.set(selectedLine.get() - 1);
                    }
                    break;
                case Gdk.KEY_Down:
                    if (selectedLine.get() + 1 == itemsPerPage || (selectedPage.get() + 1 == nbPages.get() && selectedLine.get() + 1 == itemsOnLastPage.get())) {
                        selectedLine.set(0);
                        if (selectedPage.get() == nbPages.get() - 1) {
                            selectedPage.set(0);
                        } else {
                            selectedPage.set(selectedPage.get() + 1);
                        }
                    } else {
                        selectedLine.set(selectedLine.get() + 1);
                    }
                    break;
                case Gdk.KEY_Return:
                    execAsync(["bash", "-c", `cliphist list | grep ${selectedId.get()} | cliphist decode | wl-copy`]);
                    self.hide();
                    break;
                case Gdk.KEY_Escape:
                    self.hide();
                    break;
                case Gdk.KEY_Delete:
                    execAsync(["bash", "-c", `cliphist list | grep ${selectedId.get()} | cliphist delete && wl-copy ""`]);
                    break;
            }
        }}>
        <box className={"clipboard"} vertical>
            <box className={"controls"} spacing={10}>
                <entry
                    className={"search"}
                    hexpand
                    onChanged={(self) => searchValue.set(self.text)}
                    setup={(self) => {
                        self.hook(searchValueReset, (_, reset) => {
                            if (reset) {
                                self.text = "";
                                searchValueReset.set(false);
                            }
                        })
                    }}
                />
                <button
                    label={"Clear"}
                    onClick={() => execAsync(["bash", "-c", `cliphist wipe && wl-copy ""`])}
                />
            </box>
            <box>
                {
                    bind(searchValue).as((v) => {
                        return <box>{list(v)}</box>;
                    })
                }
            </box>
            <box
                spacing={3}
                halign={Gtk.Align.END}
                valign={Gtk.Align.END}
                visible={bind(nbEntries).as((e) => e == 0 ? false : true)}>
                <label label={bind(selectedPage).as((p) => `${p + 1}`)} />
                <label label={"/"} />
                <label label={bind(nbPages).as((p) => `${p}`)} />
            </box>
        </box>
    </window>
}

function list(value: string) {
    return bind(clipboard, "entries").as((entries) => {

        if (value != "") {
            entries = search(entries, value);
        }

        nbEntries.set(entries.length);

        itemsOnLastPage.set((entries.length % itemsPerPage) || itemsPerPage);
        nbPages.set(Math.ceil(entries.length / itemsPerPage));
        selectedPage.set(0);
        selectedLine.set(0);

        if (entries.length > 0) {
            return <box className={"entries"} vertical expand>
                {
                    bind(selectedPage).as((p) => {

                        let i = 0;
                        return pagintate(entries)[p].map((line) => {

                            const id = i;
                            i++;

                            return <eventbox
                                vexpand={false}
                                className={"line"}
                                setup={(self) => {
                                    if (id == selectedLine.get()) {
                                        self.toggleClassName("selected");
                                        selectedLine.set(id);
                                        selectedId.set(line.id);
                                    }

                                    self.hook(bind(selectedLine), (_, l) => {
                                        self.toggleClassName("selected", l == id);

                                        if (l == id) {
                                            selectedId.set(line.id);
                                        }
                                    })
                                }}
                                onClick={() => {
                                    selectedLine.set(id);
                                }}>
                                <box spacing={20}>
                                    <label className={"id"} label={`${line.id}`} />
                                    <label className={"text"} label={line.text} maxWidthChars={75} truncate expand halign={Gtk.Align.START} />
                                    <button
                                        className={"trash"}
                                        label={""}
                                        canFocus={false}
                                        onClick={() => {
                                            execAsync(["bash", "-c", `cliphist list | grep ${line.id} | cliphist delete && wl-copy ""`])
                                        }}
                                    />
                                </box>
                            </eventbox>
                        })
                    })
                }
            </box>
        } else {
            return <label className={"empty"} label={"Empty"} expand />
        }
    })
}

function search(entries: { id: number, text: string }[], value: string) {
    var result: { id: number; text: string; }[] = [];

    entries.forEach((e) => {
        if (e.text.toLocaleLowerCase().includes(value.toLocaleLowerCase())) {
            result.push(e);
        }
    })

    return result;
}

function pagintate(entries: { id: number, text: string }[]) {

    var i = 0;
    var result: { id: number; text: string; }[][] = [];
    var page: { id: number; text: string; }[] = [];

    entries.forEach((line, index) => {

        page.push(line);

        if (i < itemsPerPage - 1) {
            if (index + 1 == entries.length) {
                result.push(page);
            }
            i++;
        } else {
            result.push(page);
            page = [];
            i = 0;
        }
    })

    return result;
}