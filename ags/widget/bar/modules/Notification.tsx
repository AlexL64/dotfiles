import { createState } from "ags";
import { Gdk, Gtk } from "ags/gtk4";
import { execAsync, subprocess } from "ags/process";


export default function Notifications() {

    const [icon, setIcon] = createState("󰂚")
    const [number, setNumber] = createState("0")

    subprocess(
        ['bash', '-c', 'swaync-client -swb'],
        (output) => {
            const response = JSON.parse(output);
            setNumber(response.text);
            response.class.includes("dnd") || response.class[0].includes("dnd") ? setIcon("󰂛") : setIcon("󰂚");
        },
    )

    return <box class={"notifications"}>
        <button
            cursor={Gdk.Cursor.new_from_name("pointer", null)}>
            <Gtk.GestureClick
                propagationPhase={Gtk.PropagationPhase.CAPTURE}
                button={Gdk.BUTTON_PRIMARY}
                onPressed={() => execAsync("swaync-client -t -sw")}
            />
            <Gtk.GestureClick
                propagationPhase={Gtk.PropagationPhase.CAPTURE}
                button={Gdk.BUTTON_SECONDARY}
                onPressed={() => execAsync("swaync-client -d -sw")}
            />
            <box>
                <label class={"icon"} label={icon} />
                <label class={"number"} label={number} />
            </box>
        </button>
    </box>
}