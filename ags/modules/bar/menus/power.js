const battery = await Service.import('battery');
const powerProfiles = await Service.import('powerprofiles');
import devicesBattery from './../../../services/devicesBattery.js';

const devices = devicesBattery.bind("devices");

function DevicesBattery(device) {
    return Widget.Box({
        css: "margin-top: 10px;",
        className: "power-battery",
        children: [
            Widget.Icon({
                className: "power-battery-icon",
                icon: device.icon_name,
            }),
            Widget.Box({
                vertical: true,
                children: [
                    Widget.CenterBox({
                        className: "power-battery-text",
                        start_widget: Widget.Label({
                            hpack: "start",
                            label: device.model,
                            maxWidthChars: 20,
                            truncate: "end",
                        }),
                        end_widget: Widget.Label({
                            hpack: "end",
                            setup: (self) => {
                                self.hook(devicesBattery, (self) => {
                                    switch (device.state) {
                                        case "charging":
                                            self.label = "Charging";
                                            break;
                                        case "discharging":
                                            self.label = "Discharging";
                                            break;
                                        case "charged":
                                            self.label = "Charged";
                                            break;
                                    }
                                })
                            },
                        })
                    }),
                    Widget.LevelBar({
                        className: "power-battery-bar",
                        barMode: "continuous",
                        widthRequest: 300,
                        heightRequest: 6,
                        max_value: 100,
                        value: device.percentage,
                    }),
                    Widget.CenterBox({
                        className: "power-battery-status",
                        end_widget: Widget.Label({
                            hpack: "end",
                            label: `${device.percentage}%`,
                        })
                    }),
                ],
            }),
        ]
    })
}

export function Power() {
    return Widget.Window({
        name: "power",
        anchor: ["top", "right"],
        exclusivity: "normal",
        margins: [10, 10, 0, 0],
        layer: "top",
        visible: false,
        css: "background-color: transparent",
        child: Widget.Box({
            className: "power",
            vertical: true,
            children: [
                Widget.Box({
                    className: "power-battery",
                    vertical: true,
                    children: [
                        Widget.Box({
                            spacing: 8,
                            children: [
                                Widget.Button({
                                    className: "power-idle-inhibitor",
                                    widthRequest: 64,
                                    onPrimaryClick: (self) => {
                                        if (Utils.exec("pgrep -l hypridle")) {
                                            Utils.execAsync("bash -c 'killall hypridle'")
                                            self.class_name = "power-idle-inhibitor-toggled";
                                            self.child.label = "󰒳"
                                        } else {
                                            Utils.execAsync("bash -c 'hypridle&'")
                                            self.class_name = "power-idle-inhibitor";
                                            self.child.label = "󰒲";
                                        }
                                    },
                                    setup: (self) => {
                                        if (Utils.exec("pgrep -l hypridle")) {
                                            self.class_name = "power-idle-inhibitor";
                                            self.child.label = "󰒲";
                                        } else {
                                            self.class_name = "power-idle-inhibitor-toggled";
                                            self.child.label = "󰒳"
                                        }
                                    },
                                    child: Widget.Label({
                                        className: "power-idle-inhibitor-icon",
                                    })
                                }),
                                Widget.Button({
                                    className: "power-battery-saving",
                                    widthRequest: 64,
                                    onPrimaryClick: (self) => {
                                        if (Utils.exec(`bash -c "lenopow -s | grep -oP '(?<=Battery protection: ).*'"`) == "DISABLED") {
                                            console.log(Utils.exec("sudo lenopow -e"));
                                            self.class_name = "power-battery-saving-toggled";
                                        } else {
                                            console.log(Utils.exec("sudo lenopow -d"));
                                            self.class_name = "power-battery-saving";
                                        }
                                    },
                                    setup: (self) => {
                                        if (Utils.exec(`bash -c "lenopow -s | grep -oP '(?<=Battery protection: ).*'"`) == "DISABLED") {
                                            self.class_name = "power-battery-saving";
                                        } else {
                                            self.class_name = "power-battery-saving-toggled";
                                        }
                                    },
                                    child: Widget.Label({
                                        className: "power-battery-saving-icon",
                                        label: "󱈑",
                                    })
                                }),
                            ]
                        }),
                        Widget.Separator({
                            className: "power-separator",
                            vertical: false,
                        }),
                        Widget.Box({
                            css: "margin-right: 3px",
                            children: [
                                Widget.Icon({
                                    className: "power-battery-icon",
                                    icon: battery.bind("icon_name"),
                                }),
                                Widget.Box({
                                    vertical: true,
                                    children: [
                                        Widget.CenterBox({
                                            className: "power-battery-text",
                                            start_widget: Widget.Label({
                                                hpack: "start",
                                                label: "Battery"
                                            }),
                                            end_widget: Widget.Label({
                                                hpack: "end",
                                                setup: (self) => {
                                                    self.hook(battery, () => {
                                                        if (battery.charging) {
                                                            self.label = "Charging";
                                                        } else if (battery.charged) {
                                                            self.label = "Charged";
                                                        } else {
                                                            self.label = "Discharging";
                                                        }
                                                    })
                                                },
                                            })
                                        }),
                                        Widget.LevelBar({
                                            className: "power-battery-bar",
                                            barMode: "continuous",
                                            widthRequest: 300,
                                            heightRequest: 6,
                                            max_value: 100,
                                            value: battery.bind("percent"),
                                        }),
                                        Widget.CenterBox({
                                            className: "power-battery-status",
                                            start_widget: Widget.Label({
                                                hpack: "start",
                                                setup: (self) => {
                                                    self.hook(battery, () => {
                                                        var hours = Math.floor(battery.time_remaining / 3600);
                                                        var minutes = Math.floor((battery.time_remaining - (hours * 3600)) / 60);

                                                        if (hours == 0 && minutes == 0) {
                                                            self.label = "";
                                                        } else {
                                                            if (minutes < 10) {
                                                                self.label = `${hours}:0${minutes}`;
                                                            } else {
                                                                self.label = `${hours}:${minutes}`;
                                                            }
                                                        }
                                                    })
                                                },
                                            }),
                                            end_widget: Widget.Label({
                                                hpack: "end",
                                                setup: (self) => {
                                                    self.hook(battery, () => {
                                                        self.label = `${battery.percent}%`;
                                                    })
                                                },
                                            })
                                        }),
                                    ],
                                }),
                            ]
                        }),
                        Widget.Separator({
                            className: "power-separator",
                            vertical: false,
                        }),
                        Widget.Box({
                            children: [
                                Widget.Label({
                                    className: "power-profile-icon",
                                    label: "",
                                }),
                                Widget.Slider({
                                    className: "power-slider",
                                    expand: true,
                                    valuePos: 3,
                                    drawValue: true,
                                    min: 0.1,
                                    max: 0.3,
                                    value: powerProfiles.bind("active_profile").as(p => {
                                        switch (powerProfiles.active_profile) {
                                            case "power-saver":
                                                return 0.1;
                                            case "balanced":
                                                return 0.2;
                                            case "performance":
                                                return 0.3;
                                            default:
                                                return 0.1
                                        }
                                    }),
                                    marks: [
                                        [0.1, 'Power saver'],
                                        [0.2, 'Balanced'],
                                        [0.3, 'Performance'],
                                    ],
                                    onChange: (self) => {
                                        switch (self.value) {
                                            case 0.1:
                                                powerProfiles.active_profile = "power-saver";
                                                break;
                                            case 0.2:
                                                powerProfiles.active_profile = "balanced";
                                                break;
                                            case 0.3:
                                                powerProfiles.active_profile = "performance";
                                                break;
                                        }
                                    },
                                }),
                            ]
                        })
                    ],
                }),
                Widget.Box({
                    vertical: true,
                    children: devices.as(d => d.map(DevicesBattery)),
                }),
            ]
        }),
    })
}