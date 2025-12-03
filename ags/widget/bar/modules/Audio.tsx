import WirePlumber from "gi://AstalWp?version=0.1"
import { createBinding } from "ags";
import { exec, subprocess } from "ags/process";
import App from "ags/gtk4/app"
import { Gdk, Gtk } from "ags/gtk4";

const audio = WirePlumber.get_default()!.audio;

const speakerVolume = createBinding(audio.default_speaker, "volume").as((s) => `${Math.round(s * 100)}%`);
const speakerMuted = createBinding(audio.default_speaker, "mute");
const micVolume = createBinding(audio.default_microphone, "volume").as((m) => `${Math.round(m * 100)}%`);
const micMuted = createBinding(audio.default_microphone, "mute");

function getIcon() {
    if (audio?.default_speaker.mute) {
        return "";
    } else {

        const icons = {
            65: " ",
            33: "",
            1: "",
            0: "",
        }

        const node_name = exec(['bash', '-c', `wpctl inspect ${audio?.default_speaker.id} | grep "node.name" | awk -F '"' '{print $2}'`]);

        const icon = [65, 33, 1, 0].find(threshold => threshold <= audio?.default_speaker.volume * 100) as keyof typeof icons;

        return node_name.includes("bluez") ? `${icons[icon]} ` : icons[icon];
    }
}

export default function Audio() {

    return <box class={"audio"}>
        <button
            class={"output"}
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            $={(self) => {
                const scroll = new Gtk.EventControllerScroll
                scroll.flags = Gtk.EventControllerScrollFlags.BOTH_AXES | Gtk.EventControllerScrollFlags.KINETIC

                self.add_controller(scroll)

                scroll.connect("scroll", (_, x, y) => {
                    y > 0 ? exec("pactl set-sink-volume 0 -1%") : exec("pactl set-sink-volume 0 +1%")
                })

                self.add_css_class("muted");

                speakerMuted.subscribe(() => {
                    audio?.default_speaker.mute ? self.add_css_class("muted") : self.remove_css_class("muted");
                })
            }}>
            <Gtk.GestureClick
                propagationPhase={Gtk.PropagationPhase.CAPTURE}
                button={Gdk.BUTTON_PRIMARY}
                onPressed={() => {
                    const window = App.get_window("AudioMenu");

                    if (window != undefined && window.title != "Output Devices") {
                        window.set_title("Output Devices");
                    }

                    App.toggle_window("AudioMenu");
                }}
            />
            <Gtk.GestureClick
                propagationPhase={Gtk.PropagationPhase.CAPTURE}
                button={Gdk.BUTTON_MIDDLE}
                onPressed={() => subprocess("pavucontrol -t 3")}
            />
            <Gtk.GestureClick
                propagationPhase={Gtk.PropagationPhase.CAPTURE}
                button={Gdk.BUTTON_SECONDARY}
                onPressed={() => exec("pactl set-sink-mute 0 toggle")}
            />
            <box spacing={5}>
                <label
                    label={speakerVolume}
                    visible={false}
                    $={(self) => {
                        speakerMuted.subscribe(() => {
                            if (audio?.default_speaker.mute) {
                                self.visible = false;
                            } else {
                                self.visible = true;
                            }
                        })
                    }}
                />
                <label
                    $={(self) => {
                        speakerVolume.subscribe(() => {
                            self.label = getIcon();
                        })

                        speakerMuted.subscribe(() => {
                            self.label = getIcon();
                        })
                    }}
                />
            </box>
        </button>
        <box class={"separator"} />
        <button
            class={"input"}
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            $={(self) => {
                const scroll = new Gtk.EventControllerScroll
                scroll.flags = Gtk.EventControllerScrollFlags.BOTH_AXES | Gtk.EventControllerScrollFlags.KINETIC

                self.add_controller(scroll)

                scroll.connect("scroll", (_, x, y) => {
                    y > 0 ? exec("pactl set-source-volume 0 -1%") : exec("pactl set-source-volume 0 +1%")
                })

                self.add_css_class("muted");

                micMuted.subscribe(() => {
                    audio?.default_microphone.mute ? self.add_css_class("muted") : self.remove_css_class("muted");
                })
            }}>
            <Gtk.GestureClick
                propagationPhase={Gtk.PropagationPhase.CAPTURE}
                button={Gdk.BUTTON_PRIMARY}
                onPressed={() => {
                    const window = App.get_window("AudioMenu");

                    if (window != undefined && window.title != "Input Devices") {
                        window.set_title("Input Devices");
                    }

                    App.toggle_window("AudioMenu");
                }}
            />
            <Gtk.GestureClick
                propagationPhase={Gtk.PropagationPhase.CAPTURE}
                button={Gdk.BUTTON_MIDDLE}
                onPressed={() => subprocess("pavucontrol -t 4")}
            />
            <Gtk.GestureClick
                propagationPhase={Gtk.PropagationPhase.CAPTURE}
                button={Gdk.BUTTON_SECONDARY}
                onPressed={() => exec("pactl set-source-mute 0 toggle")}
            />
            <box spacing={5}>
                <label
                    label={micVolume}
                    visible={false}
                    $={(self) => {
                        micMuted.subscribe(() => {
                            audio?.default_microphone.mute ? self.visible = false : self.visible = true;
                        })
                    }}
                />
                <label
                    $={(self) => {
                        micVolume.subscribe(() => {
                            self.label = audio?.default_microphone.mute ? "󰍭" : "󰍬";
                        })

                        micMuted.subscribe(() => {
                            self.label = audio?.default_microphone.mute ? "󰍭" : "󰍬";
                        })
                    }}
                />
            </box>
        </button>

    </box>
}