export function IdleInhibitor() {
    return Widget.Button({
        class_name: "idle-inhibitor",
        on_clicked: () => Utils.subprocess(
            ['bash', '-c', '~/.config/ags/modules/bar/scripts/switchInhibitor.sh'],
            (output) => console.log(output),
            (err) => console.log(err)
        ),
        child: Widget.Box({
            class_name: "idle-inhibitor-inactive",
            child: Widget.Label({
                class_name: "idle-inhibitor-icon",
                label: "󰈉",
            }),
            setup: self => {
                if (Utils.exec("pgrep -l hypridle") == "") {
                    self.class_name = "idle-inhibitor-active";
                    self.child.label = "󰈈";
                } else {
                    self.class_name = "idle-inhibitor-inactive";
                    self.child.label = "󰈉";
                }
            }
        }),
        setup: self => {
            self.on("clicked", () => {
                if (Utils.exec("pgrep -l hypridle") != "") {
                    self.child.class_name = "idle-inhibitor-active";
                    self.child.child.label = "󰈈";
                } else {
                    self.child.class_name = "idle-inhibitor-inactive";
                    self.child.child.label = "󰈉";
                }
            })
        }
    })
}