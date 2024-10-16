const battery = await Service.import("battery");

export function Battery() {
    const percentage = Widget.Label({
        class_name: "battery-text",
        label: "0%",
        setup: self => {
            self.hook(battery, () => {
                self.label = `${battery.percent}%`;
            })
        }
    })

    const icon = Widget.Icon({
        class_name: "battery-icon",
        icon: battery.bind("icon_name"),
    })

    return Widget.Button({
        onPrimaryClick: () => {
            App.toggleWindow("power");
            App.windows.forEach(e => !e.name?.includes("bar") && !e.name?.includes("power") ? e.hide() : null);
        },
        child: Widget.Box({
            spacing: 8,
            children: [percentage, icon],
        }),
        setup: self => {
            self.hook(battery, () => {
                if (battery.charged) {
                    self.class_name = "battery-charged";
                } else if (battery.charging) {
                    self.class_name = "battery-charging"
                } else {
                    self.class_name = "battery-discharging"
                }
            })
        }
    })
}