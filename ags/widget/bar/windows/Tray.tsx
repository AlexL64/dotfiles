import { Astal, Gdk, Gtk } from "ags/gtk4";
import AstalTray from "gi://AstalTray?version=0.1";
import App from "ags/gtk4/app";
import { createBinding, For } from "ags";

export default function Tray() {

    const tray = AstalTray.get_default();
    const items = createBinding(tray, "items");

    return <window
        name={"Tray"}
        marginTop={10}
        marginRight={10}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}>
        <box class={"tray"}>
            <Gtk.Grid columnSpacing={4} rowSpacing={4} $={(self) => {

                createBinding(tray, "items").subscribe(() => {

                    let child = self.get_first_child();

                    while (child) {
                        self.remove(child);
                        child = self.get_first_child();
                    }

                    const items = tray.items;

                    const nbColumns = Math.ceil(Math.sqrt(items.length));

                    let i = 0;
                    let j = 0;

                    items.forEach((item: AstalTray.TrayItem) => {

                        const init = (btn: Gtk.PopoverMenu, item: AstalTray.TrayItem) => {
                            btn.menuModel = item.menuModel
                            btn.insert_action_group("dbusmenu", item.actionGroup)
                            item.connect("notify::action-group", () => {
                                btn.insert_action_group("dbusmenu", item.actionGroup)
                            })
                        }

                        const menu = <Gtk.PopoverMenu $={(self) => init(self, item)} position={Gtk.PositionType.BOTTOM} /> as Gtk.PopoverMenu;

                        const button = <button class={"item"}>
                            <Gtk.GestureClick
                                propagationPhase={Gtk.PropagationPhase.CAPTURE}
                                button={Gdk.BUTTON_PRIMARY}
                                onPressed={() => {
                                    item.activate(0, 0);
                                    App.get_window("Tray")?.hide();
                                }} />
                            <Gtk.GestureClick
                                propagationPhase={Gtk.PropagationPhase.CAPTURE}
                                button={Gdk.BUTTON_SECONDARY}
                                onPressed={() => {
                                    menu.set_parent(button);
                                    menu.popup();
                                }} />
                            <image gicon={createBinding(item, "gicon")} pixelSize={16}/>
                        </button> as Gtk.Widget;


                        self.attach(button, i, j, 1, 1);

                        if (i + 1 >= nbColumns) {
                            i = 0;
                            j++;
                        } else {
                            i++;
                        }

                    })
                })
            }} />
        </box>
    </window >
}