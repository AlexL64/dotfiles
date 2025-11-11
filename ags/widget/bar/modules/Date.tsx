import { Gdk } from "ags/gtk4";
import App from "ags/gtk4/app"
import { createPoll } from "ags/time";
import GLib from "gi://GLib?version=2.0";

export default function Date() {
    const date = createPoll("", 1000, () => {
        return GLib.DateTime.new_now_local().format("%A, %d. %b  %H:%M")!
    })

    return <box class={"date"}>
        <button
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            onClicked={() => {
                App.toggle_window("calendar");
            }}>
            <label label={date} />
        </button>
    </box>
}