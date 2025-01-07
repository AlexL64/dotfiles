import { bind, GLib } from "astal";
import { App, Astal } from "astal/gtk3";
import Wp from "gi://AstalWp";
import BrightnessService from "./../services/brightness";

// @ts-ignore
const audio = Wp.get_default().audio;

const speaker = audio.defaultSpeaker;
const mic = audio.defaultMicrophone;

let toastTimeout: ReturnType<typeof setTimeout> | null = null;
let isToastVisible = false;

export default function Toast() {

    return <window
        name={"toast"}
        clickThrough
        anchor={Astal.WindowAnchor.BOTTOM}
        marginBottom={300}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}>
        <box className={'toast'} expand>
            <label
                expand
                setup={(self) => {
                    self.hook(bind(speaker, "volume"), (_, v) => {
                        self.label = `${Math.round(speaker.volume * 100)} % ${getVolumeIcon(speaker.volume)}`;
                        showToast();
                    })

                    self.hook(bind(mic, "volume"), (_, v) => {
                        self.label = `${Math.round(v * 100)} % `;
                        showToast();
                    })

                    self.hook(bind(speaker, "mute"), (_, m) => {
                        self.label = m ? "" : `${Math.round(speaker.volume * 100)} % ${getVolumeIcon(speaker.volume)}`;
                        showToast();
                    })

                    self.hook(bind(mic, "mute"), (_, m) => {
                        self.label = m ? " " : `${Math.round(mic.volume * 100)} % `;
                        showToast();
                    })

                    self.hook(bind(BrightnessService, "screenValue"), (_, v) => {
                        self.label = `${Math.round(v * 100)} % ${getBrightnessIcon(v)}`;
                        showToast();
                    })
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

    const icon = [65, 33, 1, 0].find(threshold => threshold <= volume * 100);

    // @ts-ignore
    return icons[icon];
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

    const icon = [84, 70, 56, 42, 28, 14, 0].find(threshold => threshold <= value * 100);

    // @ts-ignore
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
