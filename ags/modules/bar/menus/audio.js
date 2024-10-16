const audio = await Service.import("audio");

const output = audio.bind("speakers");
const input = audio.bind("microphones");
const apps = audio.bind("apps");

const setting = Variable('audio-output');

const audio_settings = Widget.Box({
    className: "audio-settings",
    setup: (self) => {
        self.child = getSettings(setting.value);
    },
})

export function getSettings(setting) {
    switch (setting) {
        case "audio-output":
            return audioOutputs();
        case "audio-input":
            return audioInputs();
        case "applications":
            return applications();
        default:
            return audioOutputs()
    }
}

function audioOutputs() {
    return Widget.Box({
        vertical: true,
        spacing: 10,
        expand: true,
        children: output.as(o => o.map(audioOutput))
    });
}

function audioOutput(output) {
    return Widget.Box({
        className: "audio-device",
        vertical: true,
        children: [
            Widget.CenterBox({
                start_widget: Widget.Label({
                    className: "audio-device-name",
                    hpack: "start",
                    label: output.bind("description"),
                    maxWidthChars: 35,
                    truncate: "end",
                }),
                endWidget: Widget.Button({
                    className: "audio-device-settings",
                    hpack: "end",
                    child: Widget.Label({
                        label: "",
                    })
                })
            }),
            Widget.CenterBox({
                homogeneous: true,
                start_widget: Widget.Button({
                    className: "audio-device-toggle",
                    hpack: "start",
                    onPrimaryClick: () => {
                        Utils.exec(`pactl set-sink-mute ${output.stream.index} toggle`);
                    },
                    child: Widget.Label({
                        setup: (self) => {
                            self.hook(audio, (self) => {
                                const icons = { 65: " ", 33: "", 1: "", 0: "", }

                                if (!output.is_muted) {
                                    const icon = output.is_muted ? 0 : [65, 33, 1, 0].find(threshold => threshold <= output.volume * 100);

                                    self.label = `${icons[icon]}`;
                                } else {
                                    self.label = "";
                                }
                            })
                        }
                    })
                }),
                center_widget: Widget.Slider({
                    className: "audio-device-volume-bar",
                    hpack: "center",
                    widthRequest: 269,
                    drawValue: true,
                    roundDigits: 0,
                    min: 0,
                    max: 100,
                    setup: (self) => {
                        self.hook(output, (self) => {
                            self.value = Math.round(output.volume * 100);
                        })
                    },
                    onChange: (self) => {
                        output.volume = self.value / 100
                    },
                }),
                end_widget: Widget.Label({
                    className: "audio-device-volume-percentage",
                    hpack: "end",
                    label: `${Math.round(output.volume * 100)}%`,
                    setup: (self) => {
                        self.hook(output, (self) => {
                            self.label = `${Math.round(output.volume * 100)}%`;
                        })
                    }
                })
            }),
        ],
    });
}

function audioInputs() {
    return Widget.Box({
        vertical: true,
        spacing: 10,
        expand: true,
        children: input.as(o => o.map(audioInput))
    });
}

function audioInput(input) {
    return Widget.Box({
        className: "audio-device",
        vertical: true,
        children: [
            Widget.CenterBox({
                start_widget: Widget.Label({
                    className: "audio-device-name",
                    hpack: "start",
                    label: input.bind("description"),
                    maxWidthChars: 35,
                    truncate: "end",
                }),
                endWidget: Widget.Button({
                    className: "audio-device-settings",
                    hpack: "end",
                    child: Widget.Label({
                        label: "",
                    })
                })
            }),
            Widget.CenterBox({
                start_widget: Widget.Button({
                    className: "audio-device-toggle",
                    hpack: "start",
                    onPrimaryClick: () => {
                        Utils.exec(`pactl set-source-mute ${input.stream.index} toggle`);
                    },
                    child: Widget.Label({
                        setup: (self) => {
                            self.hook(audio, (self) => {
                                input.is_muted ? self.label = "󰍭" : self.label = "󰍬";
                            })
                        }
                    })
                }),
                center_widget: Widget.Slider({
                    className: "audio-device-volume-bar",
                    hpack: "center",
                    widthRequest: 269,
                    drawValue: true,
                    roundDigits: 0,
                    min: 0,
                    max: 100,
                    setup: (self) => {
                        self.hook(input, (self) => {
                            self.value = Math.round(input.volume * 100);
                        })
                    },
                    onChange: (self) => {
                        input.volume = self.value / 100
                    }
                }),
                end_widget: Widget.Label({
                    className: "audio-device-volume-percentage",
                    hpack: "end",
                    label: `${Math.round(input.volume * 100)}%`,
                    setup: (self) => {
                        self.hook(input, (self) => {
                            self.label = `${Math.round(input.volume * 100)}%`;
                        })
                    }
                })
            }),
        ],
    });
}

function applications() {
    return Widget.Box({
        vertical: true,
        spacing: 10,
        expand: true,
        children: apps.as(o => o.map(application))
    });
}

function application(app) {
    return Widget.Box({
        height_request: 80,
        className: "audio-device",
        children: [
            Widget.Icon({
                className: "audio-device-icon",
                icon_name: app.bind("icon-name"),
                size: 48,
            }),
            Widget.Box({
                vertical: true,
                children: [
                    Widget.Box({
                        child: Widget.Label({
                            className: "audio-device-name",
                            hpack: "start",
                            label: app.bind("name"),
                            maxWidthChars: 45,
                            truncate: "end",
                        }),
                    }),
                    Widget.CenterBox({
                        homogeneous: true,
                        start_widget: Widget.Button({
                            className: "audio-device-toggle",
                            hpack: "start",
                            onPrimaryClick: () => {
                                Utils.exec(`pactl set-sink-input-mute ${app.stream.index} toggle`);
                            },
                            child: Widget.Label({
                                setup: (self) => {
                                    self.hook(audio, (self) => {
                                        const icons = { 65: " ", 33: "", 1: "", 0: "", }

                                        if (!app.is_muted) {
                                            const icon = app.is_muted ? 0 : [65, 33, 1, 0].find(threshold => threshold <= app.volume * 100);

                                            self.label = `${icons[icon]}`;
                                        } else {
                                            self.label = "";
                                        }
                                    })
                                }
                            })
                        }),
                        center_widget: Widget.Slider({
                            className: "audio-device-volume-bar",
                            hpack: "center",
                            widthRequest: 221,
                            drawValue: true,
                            roundDigits: 0,
                            min: 0,
                            max: 100,
                            setup: (self) => {
                                self.hook(app, (self) => {
                                    self.value = Math.round(app.volume * 100);
                                })
                            },
                            onChange: (self) => {
                                app.volume = self.value / 100
                            },
                        }),
                        end_widget: Widget.Label({
                            className: "audio-device-volume-percentage",
                            hpack: "end",
                            label: `${Math.round(app.volume * 100)}%`,
                            setup: (self) => {
                                self.hook(app, (self) => {
                                    self.label = `${Math.round(app.volume * 100)}%`;
                                })
                            }
                        })
                    }),
                ],
            })
        ],
    });
}

function getHeight(nb) {
    switch (nb) {
        case 0:
            return 140;
        case 1:
            return 140;
        default:
            return 60 + (nb * 80) + ((nb - 1) * 10)
    }
}

export function Audio() {
    return Widget.Window({
        name: "audio",
        anchor: ["top", "left"],
        exclusivity: "normal",
        margins: [10, 0, 0, 345],
        layer: "top",
        visible: false,
        widthRequest: 400,
        css: `background-color: transparent`,
        setup: (self) => {
            setting.connect('changed', ({ value }) => {
                switch (value) {
                    case "audio-output":
                        self.height_request = getHeight(output.emitter.speakers.length);
                        break;
                    case "audio-input":
                        self.height_request = getHeight(input.emitter.microphones.length);
                        break;
                    case "applications":
                        self.height_request = getHeight(apps.emitter.apps.length);
                        break;
                }
            });
            self.hook(audio, (self) => {
                switch (setting.value) {
                    case "audio-output":
                        self.height_request = getHeight(output.emitter.speakers.length);
                        break;
                    case "audio-input":
                        self.height_request = getHeight(input.emitter.microphones.length);
                        break;
                    case "applications":
                        self.height_request = getHeight(apps.emitter.apps.length);
                        break;
                }
            })
        },
        child: Widget.Box({
            className: "audio",
            vertical: true,
            children: [
                Widget.CenterBox({
                    className: "audio-menu",
                    start_widget: Widget.Button({
                        className: "audio-menu-button-selected",
                        onPrimaryClick: (self) => {
                            if (setting.value != "audio-output") {
                                self.parent.get_children().forEach((e) => {
                                    // @ts-ignore
                                    e.class_name = "audio-menu-button";
                                });
                                self.class_name = "audio-menu-button-selected";
                                setting.value = "audio-output";
                                audio_settings.child = getSettings(setting.value);
                            }
                        },
                        child: Widget.Label({
                            label: "Output Devices"
                        }),
                    }),
                    center_widget: Widget.Button({
                        className: "audio-menu-button",
                        onPrimaryClick: (self) => {
                            if (setting.value != "audio-input") {
                                self.parent.get_children().forEach((e) => {
                                    // @ts-ignore
                                    e.class_name = "audio-menu-button";
                                });
                                self.class_name = "audio-menu-button-selected";
                                setting.value = "audio-input";
                                audio_settings.child = getSettings(setting.value);
                            }
                        },
                        child: Widget.Label({
                            label: "Input Devices"
                        }),
                    }),
                    end_widget: Widget.Button({
                        className: "audio-menu-button",
                        onPrimaryClick: (self) => {
                            if (setting.value != "applications") {
                                self.parent.get_children().forEach((e) => {
                                    // @ts-ignore
                                    e.class_name = "audio-menu-button";
                                });
                                self.class_name = "audio-menu-button-selected";
                                setting.value = "applications";
                                audio_settings.child = getSettings(setting.value);
                            }
                        },
                        child: Widget.Label({
                            label: "Applications"
                        }),
                    }),
                }),
                audio_settings,
            ],
        }),
    })
}