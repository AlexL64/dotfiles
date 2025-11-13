import { Astal, Gtk } from "ags/gtk4";
import App from "ags/gtk4/app";

export default function Idle() {

    var cookie: number = 0;

    return <window
        name={"Idle"}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
        exclusivity={Astal.Exclusivity.IGNORE}
        layer={Astal.Layer.BACKGROUND}
        application={App}
        visible={false}
        css={"background-color:red;"}
        onNotifyVisible={(self) => {
            if (self.visible) {
                cookie = App.inhibit(self, Gtk.ApplicationInhibitFlags.IDLE, "");
            } else if (cookie != 0) {
                App.uninhibit(cookie);
                cookie = 0;
            }
        }} />
}