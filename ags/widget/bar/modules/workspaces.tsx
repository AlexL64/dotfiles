import Hyprland from "gi://AstalHyprland";
import { bind, exec } from "astal";

export default function Workspaces() {

    const hyprland = Hyprland.get_default();
    const focusedWorkspace = bind(hyprland, "focusedWorkspace").as((w) => w.name);

    return <box className={"workspaces"}>
        {
            Array.from({ length: 9 }, (_, i) => i + 1).map(i => <button
                className={"workspace"}
                label={i.toString()}
                onClicked={() => {
                    hyprland.dispatch("workspace", i.toString());
                }}
                setup={(self) => {
                    self.toggleClassName("focused", i.toString() == hyprland.get_focused_workspace().name);
                    self.toggleClassName("active", hyprland.get_workspace_by_name(i.toString())?.get_clients() != undefined);

                    self.hook(focusedWorkspace, (_) => {
                        self.toggleClassName("focused", i.toString() == hyprland.get_focused_workspace().name);
                        self.toggleClassName("urgent", false);
                    })

                    self.hook(hyprland, "urgent", (_, client) => {
                        if (client != null) {
                            self.toggleClassName("urgent", i.toString() == client.workspace.name);
                        }

                    },)

                    self.hook(hyprland, "client-added", (_, client) => {
                        if (client.workspace.name == i.toString()) {
                            self.toggleClassName("active", true);
                        }
                    })

                    self.hook(hyprland, "client-removed", (_) => {
                        hyprland.workspaces.forEach((w) => {
                            if (w.clients.length == 0 && w.name == i.toString()) {
                                self.toggleClassName("active", false);
                            }
                        })
                    })

                    self.hook(hyprland, "client-moved", (_, client) => {
                        if (client.workspace.name == i.toString()) {
                            self.toggleClassName("active", true);
                        }
                    })

                    self.hook(hyprland, "workspace-removed", (_, workspace) => {
                        if (workspace == i.toString()) {
                            self.toggleClassName("active", false);
                        }
                    })
                }}
            />)
        }
    </box >
}