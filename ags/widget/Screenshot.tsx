import { Astal, Gdk, Gtk } from "ags/gtk4";
import App from "ags/gtk4/app"
import { execAsync } from "ags/process";
import { timeout } from "ags/time";

export default function Screenshot() {

    return <window
        name={"Screenshot"}
        anchor={Astal.WindowAnchor.TOP}
        exclusivity={Astal.Exclusivity.IGNORE}
        layer={Astal.Layer.OVERLAY}
        marginTop={6}
        application={App}
        visible={false}
        onNotifyVisible={(self) => {
            if (self.visible) {
                self.set_opacity(1);
            }
        }}
        onNotifyOpacity={(self) => {
            if (self.opacity == 0) {
                timeout(10, () => {
                    self.hide();
                })
            }
        }}>
        <box class={"screenshot"} spacing={4}>
            <button
                class={"select"}
                label={""}
                tooltipText={"Select"}
                cursor={Gdk.Cursor.new_from_name("pointer", null)} />
            <Gtk.GestureClick
                propagationPhase={Gtk.PropagationPhase.CAPTURE}
                button={Gdk.BUTTON_PRIMARY}
                onPressed={(event) => {
                    execAsync(["bash", "-c", "killall slurp & hyprshot -m region -o ~/Pictures/Screenshots/"]);
                }} />
            <Gtk.GestureClick
                propagationPhase={Gtk.PropagationPhase.CAPTURE}
                button={Gdk.BUTTON_SECONDARY}
                onPressed={(event) => {
                    execAsync(["bash", "-c", "killall slurp & hyprshot -z -m region -o ~/Pictures/Screenshots/"]);
                }} />
            <button
                class={"window"}
                label={""}
                tooltipText={"Window"}
                cursor={Gdk.Cursor.new_from_name("pointer", null)} />
            <Gtk.GestureClick
                propagationPhase={Gtk.PropagationPhase.CAPTURE}
                button={Gdk.BUTTON_PRIMARY}
                onPressed={(event) => {
                    execAsync(["bash", "-c", "killall slurp & hyprshot -m window -o ~/Pictures/Screenshots/"]);
                }} />
            <Gtk.GestureClick
                propagationPhase={Gtk.PropagationPhase.CAPTURE}
                button={Gdk.BUTTON_SECONDARY}
                onPressed={(event) => {
                    execAsync(["bash", "-c", "killall slurp & hyprshot -z -m window -o ~/Pictures/Screenshots/"]);
                }} />
            <button
                class={"screen"}
                label={""}
                tooltipText={"Screen"}
                cursor={Gdk.Cursor.new_from_name("pointer", null)} />
            <Gtk.GestureClick
                propagationPhase={Gtk.PropagationPhase.CAPTURE}
                button={Gdk.BUTTON_PRIMARY}
                onPressed={(event) => {
                    execAsync(["bash", "-c", "killall slurp & hyprshot -m output -o ~/Pictures/Screenshots/"]);
                }} />
            <Gtk.GestureClick
                propagationPhase={Gtk.PropagationPhase.CAPTURE}
                button={Gdk.BUTTON_SECONDARY}
                onPressed={(event) => {
                    execAsync(["bash", "-c", "killall slurp & hyprshot -z -m output -o ~/Pictures/Screenshots/"]);
                }} />
        </box>
    </window>
}