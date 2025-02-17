import { bind, Gio, Variable } from "astal";
import { App, Astal, Gdk, Gtk } from "astal/gtk3";
import { GtkGrid } from "../../../my_types";
import AstalTray from "gi://AstalTray";

export default function Tray() {

    const tray = AstalTray.get_default();

    return <window
        name={"tray"}
        marginTop={10}
        marginRight={10}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}>
        <box className={"tray"}>
            <GtkGrid columnSpacing={4} rowSpacing={4} setup={(self) => {

                self.hook(bind(tray, "items"), (_, items) => {

                    const nbColumns = Math.ceil(Math.sqrt(items.length));

                    self.get_children().forEach((child) => {
                        self.remove(child);
                    })

                    let i = 0;
                    let j = 0;

                    items.forEach((item: AstalTray.TrayItem) => {
                        const createMenu = (menuModel: Gio.MenuModel, actionGroup: Gio.ActionGroup | null): Gtk.Menu => {
                            const menu = Gtk.Menu.new_from_model(menuModel);
                            menu.insert_action_group('dbusmenu', actionGroup);

                            return menu;
                        };

                        let menu: Gtk.Menu;

                        const entryBinding = Variable.derive(
                            [bind(item, 'menuModel'), bind(item, 'actionGroup')],
                            (menuModel, actionGroup) => {
                                if (!menuModel) {
                                    return console.error(`Menu Model not found for ${item.id}`);
                                }
                                if (!actionGroup) {
                                    return console.error(`Action Group not found for ${item.id}`);
                                }

                                menu = createMenu(menuModel, actionGroup);
                            },
                        );

                        self.attach(
                            <button
                                className={"item"}
                                cursor={"pointer"}
                                tooltipMarkup={bind(item, "tooltipMarkup")}
                                onClickRelease={(self, event) => {
                                    switch (event.button) {
                                        case 1:
                                            item.activate(0, 0);
                                            App.get_window("tray")?.hide();
                                            break;
                                        case 3:
                                            menu?.popup_at_widget(self, Gdk.Gravity.SOUTH_WEST, Gdk.Gravity.NORTH_EAST, null);
                                            break;
                                    }
                                }}
                                onDestroy={() => {
                                    menu?.destroy();
                                    entryBinding.drop();
                                }}>
                                <icon gicon={bind(item, "gicon")} className={"icon"} />
                            </button>, i, j, 1, 1);

                        if (i + 1 >= nbColumns) {
                            i = 0;
                            j++;
                        } else {
                            i++;
                        }
                    });
                })
            }} />
        </box>
    </window >
}