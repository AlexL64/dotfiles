import { bind, Variable } from "astal";
import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import Apps from "gi://AstalApps";

const apps = new Apps.Apps();

export default function AppLauncher() {

    const itemsPerPage = 8;

    const text = Variable("");
    const textReset = Variable(false);

    const selectedId = Variable(0);
    const selectedApp = Variable(apps.list[0]);
    const selectedPage = Variable(0);

    const itemsOnLastPage = Variable(0);
    const nbItems = Variable(0);
    const nbPages = Variable(0);

    return <window
        name={"app_launcher"}
        exclusivity={Astal.Exclusivity.NORMAL}
        layer={Astal.Layer.OVERLAY}
        keymode={Astal.Keymode.EXCLUSIVE}
        application={App}
        visible={false}
        onKeyPressEvent={(self, event: Gdk.Event) => {
            switch (event.get_keyval()[1]) {
                case Gdk.KEY_Up:
                    if (selectedId.get() == 0) {
                        if (selectedPage.get() == 0) {
                            selectedId.set(itemsOnLastPage.get() - 1);
                            selectedPage.set(nbPages.get() - 1);
                        } else {
                            selectedId.set(itemsPerPage - 1);
                            selectedPage.set(selectedPage.get() - 1);
                        }
                    } else {
                        selectedId.set(selectedId.get() - 1);
                    }
                    break;
                case Gdk.KEY_Down:
                    if (selectedId.get() + 1 == itemsPerPage || (selectedPage.get() + 1 == nbPages.get() && selectedId.get() + 1 == itemsOnLastPage.get())) {
                        selectedId.set(0);
                        if (selectedPage.get() == nbPages.get() - 1) {
                            selectedPage.set(0);
                        } else {
                            selectedPage.set(selectedPage.get() + 1);
                        }
                    } else {
                        selectedId.set(selectedId.get() + 1);
                    }
                    break;
                case Gdk.KEY_Return:
                    self.hide();
                    selectedApp.get().launch();
                    textReset.set(true);
                    break;
                case Gdk.KEY_Escape:
                    textReset.set(true);
                    self.hide();
                    break;
            }
        }}>
        <box className={"app_launcher"} vertical spacing={10}>
            <entry
                className={"search"}
                onChanged={(self) => {
                    text.set(self.text);

                    selectedId.set(0);
                    selectedPage.set(0);

                    if (!self.isFocus) {
                        self.isFocus = true;
                    }
                }}
                setup={(self) => {
                    self.hook(textReset, (_, reset) => {
                        if (reset) {
                            self.text = "";
                            textReset.set(false);
                        }
                    })
                }}
            />
            {
                bind(selectedPage).as((p) => {

                    let i = 0;

                    const list = text(text => {

                        const searchResult = search(text);
                        i = 0;

                        nbItems.set(searchResult.length);
                        itemsOnLastPage.set((searchResult.length % itemsPerPage) || itemsPerPage);
                        nbPages.set(Math.ceil(searchResult.length / itemsPerPage));

                        return searchResult.slice(p * itemsPerPage, (p * itemsPerPage) + itemsPerPage)
                    });

                    return <box
                        className={"apps"}
                        vertical
                        expand
                        spacing={5}>
                        {
                            list.as((list) => list.map((app) => {

                                const id = i;
                                i++;

                                return <eventbox
                                    onClick={() => selectedId.set(id)}>
                                    <box
                                        className={"app"}
                                        expand={false}
                                        setup={(self) => {
                                            if (id == selectedId.get()) {
                                                self.toggleClassName("toggled");
                                                selectedApp.set(app);
                                            }

                                            self.hook(selectedId, (_, selectedId) => {
                                                self.toggleClassName("toggled", id == selectedId);

                                                if (id == selectedId) {
                                                    selectedApp.set(app);
                                                }
                                            })
                                        }}>
                                        <icon className={"icon"} icon={app.iconName} />
                                        <box className={"infos"} vertical>
                                            <label className={"name"} label={app.name.trim()} halign={Gtk.Align.START} />
                                            <label
                                                className={"description"}
                                                label={app.description}
                                                halign={Gtk.Align.START}
                                                valign={Gtk.Align.START}
                                                truncate
                                                maxWidthChars={55}
                                                lines={2}
                                                expand />
                                        </box>
                                    </box>
                                </eventbox>
                            }))
                        }
                    </box>
                })
            }
            <box
                spacing={3}
                halign={Gtk.Align.END}
                valign={Gtk.Align.END}
                visible={bind(nbItems).as((e) => e == 0 ? false : true)}>
                <label label={bind(selectedPage).as((p) => `${p + 1}`)} />
                <label label={"/"} />
                <label label={bind(nbPages).as((p) => `${p}`)} />
            </box>
        </box>

    </window >
}

function search(text: string) {
    var result: Apps.Application[] = [];

    apps.fuzzy_query(null).forEach((a) => {
        if (a.name.toLocaleLowerCase().includes(text.toLocaleLowerCase())) {
            result.push(a);
        } else if (a.description != undefined) {
            if (a.description.toLocaleLowerCase().includes(text.toLocaleLowerCase())) {
                result.push(a);
            }
        }
    })

    return result;
}