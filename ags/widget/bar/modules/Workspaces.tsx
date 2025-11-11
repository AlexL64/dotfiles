import Hyprland from "gi://AstalHyprland?version=0.1";
import { createBinding, onCleanup } from "ags"
import Gdk from "gi://Gdk?version=4.0";

export default function Workspaces() {

    const hyprland = Hyprland.get_default();

    return <box class={"workspaces"}>
        {
            Array.from({ length: 9 }, (_, i) => i + 1).map(i => <button
                class={"workspace"}
                cursor={Gdk.Cursor.new_from_name("pointer", null)}
                label={i.toString()}

                onClicked={() => {
                    hyprland.dispatch("workspace", i.toString());
                }}
                $={(self) => {
                    i == hyprland.get_focused_workspace().id ? self.add_css_class("focused") : self.remove_css_class("focused");
                    hyprland.get_workspace_by_name(i.toString())?.get_clients() != undefined ? self.add_css_class("active") : self.remove_css_class("active");

                    const focusedWorkspace = hyprland.connect("notify::focused-workspace", (hyprland) => {
                        i == hyprland.focusedWorkspace.id ? self.add_css_class("focused") : self.remove_css_class("focused");
                        self.remove_css_class("urgent");
                    })

                    const urgent = hyprland.connect("urgent", (_, urgent) => {
                        if (urgent != null) {
                            i == urgent.workspace.id ? self.add_css_class("urgent") : self.remove_css_class("urgent");
                        }
                    })

                    const clientAdded = hyprland.connect("client-added", (_, client) => {
                        if (client.workspace.id == i) {
                            self.add_css_class("active");
                        }
                    })

                    const clientRemoved = hyprland.connect("client-removed", (_, client) => {
                        hyprland.workspaces.forEach((w) => {
                            if (w.clients.length == 0 && w.name == i.toString()) {
                                self.remove_css_class("active");
                            }
                        })
                    })

                    const clientMoved = hyprland.connect("client-moved", (_, client) => {
                        if (client.workspace.name == i.toString()) {
                            self.add_css_class("active");
                        }
                    })

                    const workspaceRemoved = hyprland.connect("workspace-removed", (_, workspace) => {
                        if (workspace == i) {
                            self.remove_css_class("active");
                        }
                    })

                    onCleanup(() => {
                        hyprland.disconnect(focusedWorkspace)
                        hyprland.disconnect(urgent)
                        hyprland.disconnect(clientAdded)
                        hyprland.disconnect(clientRemoved)
                        hyprland.disconnect(clientMoved)
                        hyprland.disconnect(workspaceRemoved)
                    })
                }}
            />)
        }
    </box >
}