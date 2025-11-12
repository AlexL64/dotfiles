import { createState } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import App from "ags/gtk4/app"
import { execAsync } from "ags/process";


export default function PowerSelector() {

    const [selected, selectedSet] = createState(0);

    return <window
        name={"PowerSelector"}
        exclusivity={Astal.Exclusivity.NORMAL}
        layer={Astal.Layer.OVERLAY}
        keymode={Astal.Keymode.EXCLUSIVE}
        application={App}
        visible={false}
        onNotifyVisible={(self) => {
            if (self.visible) {
                selectedSet(0);
            }
        }}
        $={(self) => {
            const eventControllerKey = new Gtk.EventControllerKey();

            self.add_controller(eventControllerKey);

            eventControllerKey.connect("key-pressed", (_, keyval, keycode, state) => {
                switch (keyval) {
                    case Gdk.KEY_Left:
                        if (selected.get() - 1 < 0) {
                            selectedSet(4);
                        } else {
                            selectedSet(selected.get() - 1);
                        }
                        break;
                    case Gdk.KEY_Right:
                        if (selected.get() + 1 > 4) {
                            selectedSet(0);
                        } else {
                            selectedSet(selected.get() + 1);
                        }
                        break;
                    case Gdk.KEY_Return:
                        switch (selected.get()) {
                            case 0:
                                execAsync("hyprlock");
                                break;
                            case 1:
                                execAsync("systemctl suspend");
                                break;
                            case 2:
                                execAsync("hyprctl dispatch exit");
                                break;
                            case 3:
                                execAsync("reboot");
                                break;
                            case 4:
                                execAsync("shutdown now");
                                break;
                        }
                        self.hide();
                    case Gdk.KEY_Escape:
                        self.hide();
                }
            });
        }}>
        <box class={"power_selector"} spacing={10}>
            <box
                class={"lock"}
                cursor={Gdk.Cursor.new_from_name("pointer", null)}
                $={(self) => {
                    const id = 0;

                    selected.get() == id ? self.add_css_class("selected") : self.remove_css_class("selected");

                    selected.subscribe(() => {
                        selected.get() == id ? self.add_css_class("selected") : self.remove_css_class("selected");
                    })
                }}>
                <Gtk.GestureClick
                    propagationPhase={Gtk.PropagationPhase.CAPTURE}
                    button={Gdk.BUTTON_PRIMARY}
                    onPressed={(event) => {
                        selectedSet(0);
                        execAsync("hyprlock");
                        App.get_window("PowerSelector")?.hide();
                    }} />
                <box orientation={Gtk.Orientation.VERTICAL}>
                    <label class={"icon"} label={""} vexpand hexpand />
                    <label class={"label"} label={"Lock"} vexpand hexpand />
                </box>
            </box>
            <box
                class={"sleep"}
                cursor={Gdk.Cursor.new_from_name("pointer", null)}
                $={(self) => {
                    const id = 1;

                    selected.get() == id ? self.add_css_class("selected") : self.remove_css_class("selected");

                    selected.subscribe(() => {
                        selected.get() == id ? self.add_css_class("selected") : self.remove_css_class("selected");
                    })
                }}>
                <Gtk.GestureClick
                    propagationPhase={Gtk.PropagationPhase.CAPTURE}
                    button={Gdk.BUTTON_PRIMARY}
                    onPressed={(event) => {
                        selectedSet(1);
                        execAsync("systemctl suspend");
                        App.get_window("PowerSelector")?.hide();
                    }} />
                <box orientation={Gtk.Orientation.VERTICAL}>
                    <label class={"icon"} label={""} vexpand hexpand />
                    <label class={"label"} label={"Sleep"} vexpand hexpand />
                </box>
            </box>
            <box
                class={"logout"}
                cursor={Gdk.Cursor.new_from_name("pointer", null)}
                $={(self) => {
                    const id = 2;

                    selected.get() == id ? self.add_css_class("selected") : self.remove_css_class("selected");

                    selected.subscribe(() => {
                        selected.get() == id ? self.add_css_class("selected") : self.remove_css_class("selected");
                    })
                }}>
                <Gtk.GestureClick
                    propagationPhase={Gtk.PropagationPhase.CAPTURE}
                    button={Gdk.BUTTON_PRIMARY}
                    onPressed={(event) => {
                        selectedSet(2);
                        execAsync("hyprctl dispatch exit");
                    }} />
                <box orientation={Gtk.Orientation.VERTICAL}>
                    <label class={"icon"} label={""} vexpand hexpand />
                    <label class={"label"} label={"Logout"} vexpand hexpand />
                </box>
            </box>
            <box
                class={"reboot"}
                cursor={Gdk.Cursor.new_from_name("pointer", null)}
                $={(self) => {
                    const id = 3;

                    selected.get() == id ? self.add_css_class("selected") : self.remove_css_class("selected");

                    selected.subscribe(() => {
                        selected.get() == id ? self.add_css_class("selected") : self.remove_css_class("selected");
                    })
                }}>
                <Gtk.GestureClick
                    propagationPhase={Gtk.PropagationPhase.CAPTURE}
                    button={Gdk.BUTTON_PRIMARY}
                    onPressed={(event) => {
                        selectedSet(3);
                        execAsync("reboot");
                    }} />
                <box orientation={Gtk.Orientation.VERTICAL}>
                    <label class={"icon"} label={""} vexpand hexpand />
                    <label class={"label"} label={"Reboot"} vexpand hexpand />
                </box>
            </box>
            <box
                class={"shutdown"}
                cursor={Gdk.Cursor.new_from_name("pointer", null)}
                $={(self) => {
                    const id = 4;

                    selected.get() == id ? self.add_css_class("selected") : self.remove_css_class("selected");

                    selected.subscribe(() => {
                        selected.get() == id ? self.add_css_class("selected") : self.remove_css_class("selected");
                    })
                }}>
                <Gtk.GestureClick
                    propagationPhase={Gtk.PropagationPhase.CAPTURE}
                    button={Gdk.BUTTON_PRIMARY}
                    onPressed={(event) => {
                        selectedSet(4);
                        execAsync("shutdown now");
                    }} />
                <box orientation={Gtk.Orientation.VERTICAL}>
                    <label class={"icon"} label={""} vexpand hexpand />
                    <label class={"label"} label={"Shutdown"} vexpand hexpand />
                </box>
            </box>
        </box>
    </window>
}