import AstalTray from "gi://AstalTray"
import { bind, Gio, Variable } from "astal";
import { Gdk, Gtk } from "astal/gtk3";

export default function Tray() {

    const tray = AstalTray.get_default();

    return <box className={"tray"} spacing={8}>
        {
            bind(tray, "items").as((items) => items.map((item) => {

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


                return <eventbox
                    className={"item"}
                    tooltipMarkup={bind(item, "tooltipMarkup")}
                    onClickRelease={(self, event) => {
                        switch (event.button) {
                            case 1:
                                item.activate(0, 0);
                                break;
                            case 3:
                                menu?.popup_at_widget(self, Gdk.Gravity.NORTH, Gdk.Gravity.SOUTH, null);
                                break;
                        }
                    }}
                    onDestroy={() => {
                        menu?.destroy();
                        entryBinding.drop();
                    }}>
                    <icon gicon={bind(item, "gicon")} className={"icon"} />
                </eventbox>
            })
            )}
    </box>
}