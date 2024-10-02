const battery = await Service.import("battery")

export function Battery() {

    const iconsDischarging = {
        100: "󰁹",
        90: "󰂂",
        80: "󰂁",
        70: "󰂀",
        60: "󰁿",
        50: "󰁾",
        40: "󰁽",
        30: "󰁼",
        20: "󰁻",
        10: "󰁺",
        0: "󰂎",
    }

    const iconsCharging = {
        100: "󰂅",
        90: "󰂋",
        80: "󰂊",
        70: "󰢞",
        60: "󰂉",
        50: "󰢝",
        40: "󰂈",
        30: "󰂇",
        20: "󰂆",
        10: "󰢜",
        0: "󰢟",
    }

    function getIcon() {
        const icon = [100, 90, 80, 70, 60, 50, 40, 30, 10, 0].find(threshold => threshold <= battery.percent);

        return battery.charging ? `${iconsCharging[icon]}` : `${iconsDischarging[icon]}`;
    }

    const percentage = Widget.Label({
        class_name: "battery-text",
        label: "0%",
        setup: self => {
            self.hook(battery, () => {
                self.label = `${battery.percent}%`;
            })
        }
    })

    const icon = Widget.Label({
        class_name: "battery-icon",
        label: "󰂑",
        setup: self => {
            self.hook(battery, () => {
                self.label = getIcon();
            })
        }
    })

    return Widget.Button({
        on_clicked: () => console.log(getIcon()),
        child: Widget.Box({
            spacing: 8,
            children: [percentage, icon],
        }),
        setup: self => {
            self.hook(battery, () => {
                battery.charging ? self.class_name = "battery-charging" : self.class_name = "battery-discharging";
            })
        }
    })
}