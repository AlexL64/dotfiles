const audio = await Service.import("audio")
const bluetooth = await Service.import("bluetooth")

export function AudioOutput() {

    const icons = {
        65: " ",
        33: "",
        1: "",
        0: "",
    }

    function getIcon() {
        if (!audio.speaker.is_muted) {
            const icon = audio.speaker.is_muted ? 0 : [65, 33, 1, 0].find(threshold => threshold <= audio.speaker.volume * 100);

            return isBluetooth() ? `${icons[icon]} ` : `${icons[icon]}`;
        } else {
            return "";
        }
    }

    function getVolume() {
        const volume = audio.speaker.volume * 100

        if (audio.speaker.is_muted) {
            return "";
        } else {
            return `${Math.round(volume)}%`
        }
    }

    function isBluetooth() {
        var isBluetooth = false;
        bluetooth.connected_devices.forEach(device => {
            console.log(device.type);
            device.type == "Headset" ? isBluetooth = true : isBluetooth = false;
        })
        return isBluetooth;
    }

    const volume = Widget.Label({
        class_name: "output-text",
        label: Utils.watch(getVolume(), audio.speaker, getVolume),
    })

    const icon = Widget.Label({
        class_name: "output-icon",
        label: Utils.watch(getIcon(), audio.speaker, getIcon),
    })

    return Widget.Button({
        on_clicked: () => Utils.exec("pactl set-sink-mute 0 toggle"),
        on_secondary_click: () =>Utils.execAsync("pavucontrol -t 3"),
        on_scroll_up: () => Utils.exec("pactl set-sink-volume 0 +1%"),
        on_scroll_down: () => Utils.exec("pactl set-sink-volume 0 -1%"),
        child: Widget.Box({
            spacing: 8,
            children: [volume, icon],
            setup: self => {
                self.hook(audio, () => {
                    audio.speaker.is_muted ? self.spacing = 0 : self.spacing = 8;
                })
            }
        }),
        setup: self => {
            self.hook(audio, () => {
                audio.speaker.is_muted ? self.class_name = "audio-output-muted" : self.class_name = "audio-output";
            })
        }
    })
}