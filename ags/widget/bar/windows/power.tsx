import { exec } from "astal";
import { App, Astal, Gtk } from "astal/gtk3";

export default function Power() {
    return <window
        name={"power"}
        marginTop={10}
        marginRight={10}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}>
        <box className={"power"} vertical>
            <button onClick={() => {
                exec("hyprlock");
            }}>
                <label className={"lock"} label={"  Lock"} xalign={Gtk.Align.FILL} />
            </button>
            <button onClick={() => {
                exec("systemctl suspend");
            }}>
                <label className={"sleep"} label={"  Sleep"} xalign={Gtk.Align.FILL} />
            </button>
            <button onClick={() => {
                exec("hyprctl dispatch exit");
            }}>
                <label className={"logout"} label={"  Logout"} xalign={Gtk.Align.FILL} />
            </button>
            <button onClick={() => {
                exec("systemctl reboot");
            }}>
                <label className={"reboot"} label={"  Reboot"} xalign={Gtk.Align.FILL} />
            </button>
            <button onClick={() => {
                exec("shutdown now");
            }}>
                <label className={"shutdown"} label={"  Shutdown"} xalign={Gtk.Align.FILL} />
            </button>
        </box>
    </window>
}