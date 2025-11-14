import App from "ags/gtk4/app"
import { Astal, Gdk, Gtk } from "ags/gtk4";
import ClipboardService from "../services/Clipboard";
import { execAsync } from "ags/process";
import { createBinding, createState, With } from "ags";
import Pango from "gi://Pango?version=1.0";

const [searchValue, searchValueSet] = createState("");
const [searchValueReset, searchValueResetSet] = createState(false);

const itemsPerPage = 8;
const [itemsOnLastPage, itemsOnLastPageSet] = createState(0);

const [nbEntries, nbEntriesSet] = createState(0);

const [nbPages, nbPagesSet] = createState(0);
const [selectedPage, selectedPageSet] = createState(0);
const [selectedLine, selectedLineSet] = createState(0);
const [selectedId, selectedIdSet] = createState(0);

const clipboard = ClipboardService.get_default();

export default function Clipboard() {

    return <window
        name={"Clipboard"}
        exclusivity={Astal.Exclusivity.NORMAL}
        layer={Astal.Layer.OVERLAY}
        keymode={Astal.Keymode.EXCLUSIVE}
        application={App}
        visible={false}
        onNotifyVisible={(self) => {
            if (!self.visible) {
                selectedLineSet(0);
                selectedPageSet(0);
                searchValueResetSet(true);
            }
        }}
        $={(self) => {
            const eventControllerKey = new Gtk.EventControllerKey();

            self.add_controller(eventControllerKey);

            eventControllerKey.connect("key-pressed", (_, keyval, keycode, state) => {
                switch (keyval) {
                    case Gdk.KEY_Up:
                        if (selectedLine.get() == 0) {
                            if (selectedPage.get() == 0) {
                                selectedLineSet(itemsOnLastPage.get() - 1);
                                selectedPageSet(nbPages.get() - 1);
                            } else {
                                selectedLineSet(itemsPerPage - 1);
                                selectedPageSet(selectedPage.get() - 1);
                            }
                        } else {
                            selectedLineSet(selectedLine.get() - 1);
                        }
                        break;
                    case Gdk.KEY_Down:
                        if (selectedLine.get() + 1 == itemsPerPage || (selectedPage.get() + 1 == nbPages.get() && selectedLine.get() + 1 == itemsOnLastPage.get())) {
                            selectedLineSet(0);
                            if (selectedPage.get() == nbPages.get() - 1) {
                                selectedPageSet(0);
                            } else {
                                selectedPageSet(selectedPage.get() + 1);
                            }
                        } else {
                            selectedLineSet(selectedLine.get() + 1);
                        }
                        break;
                    case Gdk.KEY_Escape:
                        self.hide();
                        break;
                }
            })
        }}>
        <box class={"clipboard"} orientation={Gtk.Orientation.VERTICAL}>
            <box class={"controls"} spacing={10}>
                <entry
                    class={"search"}
                    hexpand
                    onNotifyText={(self) => {
                        searchValueSet(self.text);
                    }}
                    onActivate={(self) => {
                        execAsync(["bash", "-c", `cliphist list | grep ${selectedId.get()} | cliphist decode | wl-copy`]);
                        App.get_window("Clipboard")?.hide();
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
                <button
                    label={"Clear"}
                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                    canFocus={false}
                    onClicked={() => execAsync(["bash", "-c", `cliphist wipe && wl-copy ""`])}
                />
            </box>
            <box>
                <With value={searchValue}>
                    {
                        (value) => list(value)
                    }
                </With>
            </box>
            <box
                class={"pages"}
                spacing={10}
                halign={Gtk.Align.END}
                valign={Gtk.Align.END}
                hexpand
                vexpand
                visible={nbEntries.as((e) => e == 0 ? false : true)}>
                <button
                    label={""}
                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                    canFocus={false}
                    onClicked={() => {
                        selectedLineSet(0);
                        if (selectedPage.get() == 0) {
                            selectedPageSet(nbPages.get() - 1);
                        } else {
                            selectedPageSet(selectedPage.get() - 1);
                        }
                    }}
                />
                <button
                    label={""}
                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                    canFocus={false}
                    onClicked={() => {
                        selectedLineSet(0);
                        if (selectedPage.get() == nbPages.get() - 1) {
                            selectedPageSet(0);
                        } else {
                            selectedPageSet(selectedPage.get() + 1);
                        }
                    }}
                />
                <box spacing={3}>
                    <label label={selectedPage.as((p) => `${p + 1}`)} />
                    <label label={"/"} />
                    <label label={nbPages.as((p) => `${p}`)} />
                </box>
            </box>
        </box>
    </window>
}

function list(value: string) {

    return <box orientation={Gtk.Orientation.VERTICAL}>
        <With value={createBinding(clipboard, "entries")}>
            {(entries: { id: number, text: string }[]) => {
                if (value != "") {
                    entries = search(entries, value);
                }

                nbEntriesSet(entries.length);

                itemsOnLastPageSet((entries.length % itemsPerPage) || itemsPerPage);
                nbPagesSet(Math.ceil(entries.length / itemsPerPage));
                selectedPageSet(0);
                selectedLineSet(0);

                if (entries.length > 0) {
                    return <box class={"entries"} orientation={Gtk.Orientation.VERTICAL}>
                        <With value={selectedPage}>
                            {(p) => {
                                let i = 0;

                                const page = paginate(entries)[p] as { id: number, text: string }[];

                                return (
                                    <box class={"entries"} orientation={Gtk.Orientation.VERTICAL}>
                                        {page.map((line) => {
                                            const id = i;
                                            i++;

                                            let lastClick = 0;

                                            return <box
                                                vexpand={false}
                                                cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                                class={"line"}
                                                $={(self) => {
                                                    if (id == selectedLine.get()) {
                                                        self.add_css_class("selected");
                                                        selectedLineSet(id);
                                                        selectedIdSet(line.id);
                                                    }

                                                    selectedLine.subscribe(() => {
                                                        if (selectedLine.get() == id) {
                                                            self.add_css_class("selected")
                                                            selectedIdSet(line.id);
                                                        } else {
                                                            self.remove_css_class("selected")
                                                        }
                                                    })
                                                }}>
                                                <Gtk.GestureClick
                                                    propagationPhase={Gtk.PropagationPhase.CAPTURE}
                                                    button={Gdk.BUTTON_PRIMARY}
                                                    onPressed={(event) => {
                                                        if (event.get_current_event_time() - lastClick < 200) {
                                                            execAsync(["bash", "-c", `cliphist list | grep ${selectedId.get()} | cliphist decode | wl-copy`]);
                                                            App.get_window("clipboard")?.hide();
                                                        } else {
                                                            selectedLineSet(id);
                                                        }
                                                        lastClick = event.get_current_event_time();
                                                    }}
                                                />
                                                <box spacing={20}>
                                                    <label class={"id"} label={`${line.id}`} />
                                                    <label
                                                        class={"text"} label={line.text}
                                                        vexpand
                                                        hexpand
                                                        halign={Gtk.Align.START}
                                                        ellipsize={Pango.EllipsizeMode.END}
                                                        maxWidthChars={75} />
                                                    <button
                                                        class={"trash"}
                                                        cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                                        label={""}
                                                        canFocus={false}
                                                        onClicked={() => {
                                                            execAsync(["bash", "-c", `cliphist list | grep ${line.id} | cliphist delete && wl-copy ""`])
                                                        }}
                                                    />
                                                </box>
                                            </box>
                                        })}
                                    </box>
                                );
                            }}
                        </With>
                    </box>
                } else {
                    return <label class={"empty"} label={"Empty"} vexpand hexpand />
                }
            }}
        </With>
    </box >
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

function paginate(entries: { id: number, text: string }[]) {

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