import WirePlumber from "gi://AstalWp";
import { bind, exec, subprocess } from "astal";
import { App } from "astal/gtk3";

const audio = WirePlumber.get_default()?.audio;

const icons = {
    65: " ",
    33: "",
    1: "",
    0: "",
}

// @ts-ignore
const speakerVolume = bind(audio.default_speaker, "volume").as((s) => `${Math.round(s * 100)}%`);
// @ts-ignore
const speakerMuted = bind(audio.default_speaker, "mute");
// @ts-ignore
const micVolume = bind(audio.default_microphone, "volume").as((m) => `${Math.round(m * 100)}%`);
// @ts-ignore
const micMuted = bind(audio.default_microphone, "mute");

function getIcon() {
    if (audio?.default_speaker.mute) {
        return "";
    } else {

        const node_name = exec(['bash', '-c', `wpctl inspect ${audio?.default_speaker.id} | grep "node.name" | awk -F '"' '{print $2}'`]);

        // @ts-ignore
        const icon = [65, 33, 1, 0].find(threshold => threshold <= audio?.default_speaker.volume * 100);
        // @ts-ignore
        return node_name.includes("bluez") ? `${icons[icon]} ` : icons[icon];
    }
}

export default function Audio() {

    return <box className={"audio"}>
        <button
            className={"output"}
            onClick={(self, event) => {
                switch (event.button) {
                    case 1:
                        App.toggle_window("audioMenu");
                        break;
                    case 2:
                        subprocess("pavucontrol -t 3");
                        break;
                    case 3:
                        exec("pactl set-sink-mute 0 toggle")
                        break;
                }
            }}
            onScroll={(self, event) => {
                event.delta_y > 0 ? exec("pactl set-sink-volume 0 -1%") : exec("pactl set-sink-volume 0 +1%")
            }}
            setup={(self) => {
                self.toggleClassName("muted", true);

                self.hook(speakerMuted, (_, mute) => {
                    self.toggleClassName("muted", mute);
                })
            }}
        >
            <box spacing={5}>
                <label
                    label={speakerVolume}
                    visible={false}
                    setup={(self) => {
                        self.hook(speakerMuted, (_, mute) => {
                            mute ? self.visible = false : self.visible = true;
                        })
                    }}
                />
                <label
                    setup={(self) => {
                        self.hook(speakerVolume, (self) => {
                            self.label = getIcon();
                        })

                        self.hook(speakerMuted, (self) => {
                            self.label = getIcon();
                        })
                    }}
                />
            </box>
        </button>
        <button
            className={"input"}
            onClick={(self, event) => {
                switch (event.button) {
                    case 1:
                        App.toggle_window("audioMenu");
                        break;
                    case 2:
                        subprocess("pavucontrol -t 4");
                        break;
                    case 3:
                        exec("pactl set-source-mute 0 toggle")
                        break;
                }
            }}
            onScroll={(self, event) => {
                event.delta_y > 0 ? exec("pactl set-source-volume 0 -1%") : exec("pactl set-source-volume 0 +1%")
            }}
            setup={(self) => {
                self.toggleClassName("muted", true);

                self.hook(micMuted, (_, mute) => {
                    self.toggleClassName("muted", mute);
                })
            }}
        >
            <box spacing={5}>
                <label
                    label={micVolume}
                    visible={false}
                    setup={(self) => {
                        self.hook(micMuted, (_, mute) => {
                            mute ? self.visible = false : self.visible = true;
                        })
                    }}
                />
                <label
                    setup={(self) => {
                        self.hook(micVolume, (self) => {
                            self.label = audio?.default_microphone.mute ? "󰍭" : "󰍬";
                        })

                        self.hook(micMuted, (self) => {
                            self.label = audio?.default_microphone.mute ? "󰍭" : "󰍬";
                        })
                    }}
                />
            </box>
        </button>

    </box>
}