import { Astal, Gdk, Gtk } from "ags/gtk4";
import App from "ags/gtk4/app"
import { exec } from "ags/process";

export default function Power() {
    return <window
        name={"Power"}
        marginTop={10}
        marginRight={10}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}>
        <box class={"power"} orientation={Gtk.Orientation.VERTICAL}>
            <button cursor={Gdk.Cursor.new_from_name("pointer", null)} onClicked={() => {
                exec("hyprlock");
            }}>
                <label class={"lock"} label={"  Lock"} xalign={Gtk.Align.FILL} />
            </button>
            <button cursor={Gdk.Cursor.new_from_name("pointer", null)} onClicked={() => {
                exec("systemctl suspend");
            }}>
                <label class={"sleep"} label={"  Sleep"} xalign={Gtk.Align.FILL} />
            </button>
            <button cursor={Gdk.Cursor.new_from_name("pointer", null)} onClicked={() => {
                exec("hyprctl dispatch exit");
            }}>
                <label class={"logout"} label={"  Logout"} xalign={Gtk.Align.FILL} />
            </button>
            <button cursor={Gdk.Cursor.new_from_name("pointer", null)} onClicked={() => {
                exec("reboot");
            }}>
                <label class={"reboot"} label={"  Reboot"} xalign={Gtk.Align.FILL} />
            </button>
            <button cursor={Gdk.Cursor.new_from_name("pointer", null)} onClicked={() => {
                exec("shutdown now");
            }}>
                <label class={"shutdown"} label={"  Shutdown"} xalign={Gtk.Align.FILL} />
            </button>
        </box>
    </window>
}