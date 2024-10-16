import { getSettings } from "../menus/audio.js";
import Gtk from "../../../types/@girs/gtk-3.0/gtk-3.0.js";


const audio = await Service.import("audio")

export function AudioInput() {

    function getIcon() {
        return audio.microphone.is_muted ? "󰍭" : "󰍬";
    }

    function getVolume() {
        const volume = audio.microphone.volume * 100

        if (audio.microphone.is_muted) {
            return "";
        } else {
            return `${Math.round(volume)}%`
        }
    }

    const volume = Widget.Label({
        class_name: "input-text",
        label: Utils.watch(getVolume(), audio.microphone, getVolume),
    })

    const icon = Widget.Label({
        class_name: "input-icon",
        label: Utils.watch(getIcon(), audio.microphone, getIcon)
    })

    return Widget.Button({
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
            children: [volume, icon],
            setup: self => {
                self.hook(audio, () => {
                    audio.microphone.is_muted ? self.spacing = 0 : self.spacing = 8;
                })
            }
        }),
        setup: self => {
            self.hook(audio, () => {
                audio.microphone.is_muted ? self.class_name = "audio-input-muted" : self.class_name = "audio-input";
            })
        }
    })
}