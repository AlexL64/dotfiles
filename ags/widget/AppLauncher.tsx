import { Astal, Gdk, Gtk } from "ags/gtk4";
import App from "ags/gtk4/app"
import Apps from "gi://AstalApps?version=0.1"
import { createState, For, With } from "ags";

var apps = new Apps.Apps();

export default function AppLauncher() {

    const itemsPerPage = 8;

    const [text, textSet] = createState("");
    const [textReset, textResetSet] = createState(false);

    const [selectedId, selectedIdSet] = createState(0);
    const [selectedApp, selectedAppSet] = createState(apps.list[0]);
    const [selectedPage, selectedPageSet] = createState(0);

    const [itemsOnLastPage, itemsOnLastPageSet] = createState(0);
    const [nbItems, nbItemsSet] = createState(0);
    const [nbPages, nbPagesSet] = createState(0);

    return <window
        name={"AppLauncher"}
        exclusivity={Astal.Exclusivity.NORMAL}
        layer={Astal.Layer.OVERLAY}
        keymode={Astal.Keymode.EXCLUSIVE}
        application={App}
        visible={false}
        onNotifyVisible={(self) => {
            if (!self.visible) {
                textResetSet(true);
                selectedIdSet(0);
                selectedPageSet(0);

                apps = new Apps.Apps();
            }
        }}
        $={(self) => {
            const eventControllerKey = new Gtk.EventControllerKey();

            self.add_controller(eventControllerKey);

            eventControllerKey.connect("key-pressed", (_, keyval, keycode, state) => {
                switch (keyval) {
                    case Gdk.KEY_Up:
                        if (selectedId.get() == 0) {
                            if (selectedPage.get() == 0) {
                                selectedIdSet(itemsOnLastPage.get() - 1);
                                selectedPageSet(nbPages.get() - 1);
                            } else {
                                selectedIdSet(itemsPerPage - 1);
                                selectedPageSet(selectedPage.get() - 1);
                            }
                        } else {
                            selectedIdSet(selectedId.get() - 1);
                        }
                        break;
                    case Gdk.KEY_Down:
                        if (selectedId.get() + 1 == itemsPerPage || (selectedPage.get() + 1 == nbPages.get() && selectedId.get() + 1 == itemsOnLastPage.get())) {
                            selectedIdSet(0);
                            if (selectedPage.get() == nbPages.get() - 1) {
                                selectedPageSet(0);
                            } else {
                                selectedPageSet(selectedPage.get() + 1);
                            }
                        } else {
                            selectedIdSet(selectedId.get() + 1);
                        }
                        break;
                    case Gdk.KEY_Escape:
                        self.hide();
                        break;
                }
            })
        }}>
        <box class={"app_launcher"} orientation={Gtk.Orientation.VERTICAL} spacing={10} vexpand hexpand>
            <entry
                class={"search"}
                onNotifyText={(self) => {
                    textSet(self.text);

                    selectedIdSet(0);
                    selectedPageSet(0);
                }}
                onActivate={(self) => {
                    selectedApp.get().launch();
                    App.get_window("AppLauncher")?.hide();
                }}
                $={(self) => {
                    textReset.subscribe(() => {
                        if (textReset.get()) {
                            self.text = "";
                            textResetSet(false);
                        }
                    })
                }}
            />
            <box>
                <With value={selectedPage}>
                    {(p) => {
                        let i = 0;

                        const list = text(text => {

                            const searchResult = search(text);
                            i = 0;

                            nbItemsSet(searchResult.length);
                            itemsOnLastPageSet((searchResult.length % itemsPerPage) || itemsPerPage);
                            nbPagesSet(Math.ceil(searchResult.length / itemsPerPage));

                            return searchResult.slice(p * itemsPerPage, (p * itemsPerPage) + itemsPerPage)
                        });

                        return <box>
                            <With value={list}>
                                {(l) => {
                                    return <box
                                        class={"apps"}
                                        orientation={Gtk.Orientation.VERTICAL}
                                        spacing={5}
                                        vexpand
                                        hexpand>
                                        <For each={list}>
                                            {(app) => {
                                                const id = i;
                                                i++;

                                                let lastClick = 0;

                                                return <box cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                                >
                                                    <Gtk.GestureClick
                                                        propagationPhase={Gtk.PropagationPhase.CAPTURE}
                                                        button={Gdk.BUTTON_PRIMARY}
                                                        onPressed={(event) => {
                                                            if (event.get_current_event_time() - lastClick < 200) {
                                                                app.launch();
                                                                App.get_window("AppLauncher")?.hide();
                                                            } else {
                                                                selectedIdSet(id);
                                                            }
                                                            lastClick = event.get_current_event_time();
                                                        }}
                                                    />
                                                    <box
                                                        class={"app"}
                                                        heightRequest={64}
                                                        hexpand
                                                        $={(self) => {
                                                            if (id == selectedId.get()) {
                                                                self.add_css_class("toggled");
                                                                selectedAppSet(app);
                                                            }

                                                            selectedId.subscribe(() => {
                                                                id == selectedId.get() ? self.add_css_class("toggled") : self.remove_css_class("toggled");

                                                                if (id == selectedId.get()) {
                                                                    selectedAppSet(app);
                                                                }
                                                            })
                                                        }}>
                                                        <image class={"icon"} iconName={app.iconName} pixelSize={54} />
                                                        <box class={"infos"} orientation={Gtk.Orientation.VERTICAL}>
                                                            <label class={"name"} label={app.name.trim()} halign={Gtk.Align.START} />
                                                            <label
                                                                class={"description"}
                                                                label={app.description}
                                                                halign={Gtk.Align.START}
                                                                valign={Gtk.Align.START}
                                                                maxWidthChars={55}
                                                                lines={2}
                                                            />
                                                        </box>
                                                    </box>
                                                </box>
                                            }}
                                        </For>
                                    </box>
                                }}
                            </With>

                        </box>
                    }}
                </With>
            </box>
            <box
                class={"pages"}
                spacing={10}
                halign={Gtk.Align.END}
                valign={Gtk.Align.END}
                visible={nbItems.as((e) => e == 0 ? false : true)}>
                <button
                    label={""}
                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                    canFocus={false}
                    onClicked={() => {
                        selectedIdSet(0);
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
                        selectedIdSet(0);
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

    </window >
}

function search(text: string) {
    var result: Apps.Application[] = [];

    let list = apps.fuzzy_query(null);

    if (text != "") {
        list.forEach((app) => {
            if (app.name.toLowerCase().includes(text.toLowerCase()) ||
                app.entry.toLowerCase().includes(text.toLowerCase()) ||
                app.keywords.some(keyword => keyword.toLowerCase().includes(text.toLowerCase()))
            ) {
                result.push(app);
            }
        })

        list.forEach((app) => {
            if (app.description != undefined && app.description.toLowerCase().includes(text.toLowerCase())) {
                if (!result.includes(app)) {
                    result.push(app);
                }
            }
        })

        list.forEach((app) => {
            if (app.categories.some(categorie => categorie.toLowerCase().includes(text.toLowerCase()))) {
                if (!result.includes(app)) {
                    result.push(app);
                }
            }
        })

        return result;
    } else {
        return list;
    }
}