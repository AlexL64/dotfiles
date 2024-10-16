const hyprland = await Service.import("hyprland")

export function Workspaces() {
    const focusedId = hyprland.active.workspace.bind("id");
    const activeIds = hyprland.bind("workspaces");
    const dispatch = ws => hyprland.messageAsync(`dispatch workspace ${ws}`);

    return Widget.Box({
        class_name: "workspaces",
        children: Array.from({ length: 9 }, (_, i) => i + 1).map(i => Widget.Button({
            attribute: {
                id: i,
                isUrgent: false,
            },
            label: `${i}`,
            onClicked: () => dispatch(i),
            setup: self => {
                self.hook(hyprland, () => {
                    if (!self.attribute.isUrgent) {
                        if (self.attribute.id == focusedId.emitter.id) {
                            if (activeIds.emitter.getWorkspace(self.attribute.id)?.lastwindow != "0x0") {
                                self.class_name = "active-focused";
                            } else {
                                self.class_name = "inactive-focused";
                            }
                        } else {
                            if (activeIds.emitter.getWorkspace(self.attribute.id) != undefined) {
                                self.class_name = "active-unfocused";
                            } else {
                                self.class_name = "inactive-unfocused";
                            }
                        }
                    } else if (self.attribute.id == hyprland.active.workspace.id) {
                        self.attribute.isUrgent = false;
                    }
                })
                self.hook(hyprland, (_, address) => {
                    if (address != undefined) {
                        if (hyprland.getClient(address)?.workspace.id == self.attribute.id) {
                            self.attribute.isUrgent = true;
                            self.class_name = "urgent";
                        }
                    }
                }, "urgent-window")
            }
        })),

    })
}