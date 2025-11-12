import { Astal, Gdk, Gtk } from "ags/gtk4";
import Brightness from "../services/Brightness";
import Wp from "gi://AstalWp?version=0.1"
import App from "ags/gtk4/app"

const audio = Wp.get_default()!.audio;

const speaker = audio.defaultSpeaker;
const mic = audio.defaultMicrophone;

let toastTimeout: ReturnType<typeof setTimeout> | null = null;
let isToastVisible = false;

export default function Toast() {

    const brightness = Brightness.get_default();

    return <window
        name={"toast"}
        anchor={Astal.WindowAnchor.BOTTOM}
        marginBottom={200}
        exclusivity={Astal.Exclusivity.NORMAL}
        layer={Astal.Layer.OVERLAY}
        application={App}
        visible={false}>
        <box class={'toast'} vexpand hexpand>
            <label
                vexpand
                hexpand
                $={(self) => {

                    speaker.connect("notify::volume", () => {
                        self.label = `${Math.round(speaker.volume * 100)} % ${getVolumeIcon(speaker.volume)}`;
                        showToast();
                    });

                    speaker.connect("notify::mute", () => {
                        self.label = speaker.mute ? "" : `${Math.round(speaker.volume * 100)} % ${getVolumeIcon(speaker.volume)}`;
                        showToast();
                    });

                    mic.connect("notify::volume", () => {
                        self.label = `${Math.round(mic.volume * 100)} % `;
                        showToast();
                    });

                    mic.connect("notify::mute", () => {
                        self.label = mic.mute ? " " : `${Math.round(mic.volume * 100)} % `;
                        showToast();
                    });

                    brightness!.connect("notify::screen", () => {
                        self.label = `${Math.round(brightness!.screen * 100)} % ${getBrightnessIcon(brightness!.screen)}`;
                        showToast();
                    });
                }}
            />
        </box>
    </window>
}

function getVolumeIcon(volume: number) {
    const icons = {
        65: " ",
        33: "",
        1: "",
        0: "",
    }

    const icon = [65, 33, 1, 0].find(threshold => threshold <= volume * 100) as keyof typeof icons;

    return `${icons[icon]}`;
}

function getBrightnessIcon(value: number) {
    const icons = {
        84: "󰃠",
        70: "󰃟",
        56: "󰃞",
        42: "󰃝",
        28: "󰃜",
        14: "󰃛",
        0: "󰃚"
    }

    const icon = [84, 70, 56, 42, 28, 14, 0].find(threshold => threshold <= value * 100) as keyof typeof icons;

    return `${icons[icon]}`;
}

async function showToast(): Promise<void> {
    const toastWindow = App.get_window("toast");

    if (toastWindow) {
        if (!isToastVisible) {
            App.toggle_window("toast");
            isToastVisible = true;
        }

        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        toastTimeout = setTimeout(() => {
            toastWindow.hide();
            isToastVisible = false;
        }, 1000);
    }
}
