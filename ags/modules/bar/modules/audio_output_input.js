const audio = await Service.import("audio")
const bluetooth = await Service.import("bluetooth")

function getOutputVolume() {
    const volume = audio.speaker.volume * 100

    if (audio.speaker.is_muted) {
        return "";
    } else {
        return `${Math.round(volume)}%`
    }
}

function getInputVolume() {
    const volume = audio.microphone.volume * 100

    if (audio.microphone.is_muted) {
        return "";
    } else {
        return `${Math.round(volume)}%`
    }
}

function isBluetooth() {
    var isBluetooth = false;
    bluetooth.connected_devices.forEach(device => {
        device.type == "Headset" ? isBluetooth = true : isBluetooth = false;
    })
    return isBluetooth;
}

const output_icons = {
    65: " ",
    33: "",
    1: "",
    0: "",
}

function getOutputIcon() {
    if (!audio.speaker.is_muted) {
        const icon = audio.speaker.is_muted ? 0 : [65, 33, 1, 0].find(threshold => threshold <= audio.speaker.volume * 100);

        return isBluetooth() ? `${output_icons[icon]} ` : `${output_icons[icon]}`;
    } else {
        return "";
    }
}

function getInputIcon() {
    return audio.microphone.is_muted ? "󰍭" : "󰍬";
}

export function AudioOutputInput() {
    return Widget.Box({
        className: "audio-output-input",
        children: [
            Widget.Button({
                className: "audio-output",
                onPrimaryClick: () => {
                    App.toggleWindow("audio");
                    App.windows.forEach(e => !e.name?.includes("bar") && !e.name?.includes("audio") ? e.hide() : null);
                },
                onSecondaryClick: () => Utils.exec("pactl set-sink-mute 0 toggle"),
                onMiddleClick: () => Utils.execAsync("pavucontrol -t 3"),
                onScrollUp: () => Utils.exec("pactl set-sink-volume 0 +1%"),
                onScrollDown: () => Utils.exec("pactl set-sink-volume 0 -1%"),
                child: Widget.Box({
                    spacing: 8,
                    children: [
                        Widget.Label({
                            label: Utils.watch(getOutputVolume(), audio.speaker, getOutputVolume),
                        }),
                        Widget.Label({
                            label: Utils.watch(getOutputIcon(), audio.speaker, getOutputIcon),
                        }),
                    ],
                    setup: (self) => {
                        self.hook(audio.speaker, () => {
                            audio.speaker.is_muted ? self.spacing = 0 : self.spacing = 8;
                        })
                    }
                }),
                setup: (self) => {
                    self.hook(audio.speaker, () => {
                        audio.speaker.is_muted ? self.class_name = "audio-output-muted" : self.class_name = "audio-output";
                    })
                }
            }),
            Widget.Button({
                className: "audio-input",
                onPrimaryClick: () => {
                    App.toggleWindow("audio");
                    App.windows.forEach(e => !e.name?.includes("bar") && !e.name?.includes("audio") ? e.hide() : null);
                },
                onSecondaryClick: () => Utils.exec("pactl set-source-mute 0 toggle"),
                onMiddleClick: () => Utils.execAsync("pavucontrol -t 4"),
                onScrollUp: () => Utils.exec("pactl set-source-volume 0 +1%"),
                onScrollDown: () => Utils.exec("pactl set-source-volume 0 -1%"),
                child: Widget.Box({
                    spacing: 8,
                    children: [
                        Widget.Label({
                            label: Utils.watch(getInputVolume(), audio.microphone, getInputVolume),
                        }),
                        Widget.Label({
                            label: Utils.watch(getInputIcon(), audio.microphone, getInputIcon),
                        }),
                    ],
                    setup: (self) => {
                        self.hook(audio.microphone, () => {
                            audio.microphone.is_muted ? self.spacing = 0 : self.spacing = 8;
                        })
                    }
                }),
                setup: (self) => {
                    self.hook(audio.microphone, () => {
                        audio.microphone.is_muted ? self.class_name = "audio-input-muted" : self.class_name = "audio-input";
                    })
                }
            }),
        ]
    });
}