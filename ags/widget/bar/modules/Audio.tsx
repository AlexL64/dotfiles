import WirePlumber from "gi://AstalWp?version=0.1"
import { createBinding, With } from "ags";
import { exec, subprocess } from "ags/process";
import App from "ags/gtk4/app"
import { Gdk, Gtk } from "ags/gtk4";

export default function Audio() {

    const audio = WirePlumber.get_default().audio;

    const speakers = createBinding(audio, "speakers");
    const mics = createBinding(audio, "microphones");

    return <box class={"audio"}>
        <box>
            <With value={speakers}>
                {(speakers) => {
                    if (speakers.length > 1 || (speakers.length == 1 && speakers[0].description != "Dummy Output")) {
                        const speakerVolume = createBinding(audio.defaultSpeaker, "volume").as((m) => `${Math.round(m * 100)}%`);
                        const speakerMuted = createBinding(audio.defaultSpeaker, "mute");

                        return <button
                            class={"output"}
                            cursor={Gdk.Cursor.new_from_name("pointer", null)}
                            $={(self) => {
                                const scroll = new Gtk.EventControllerScroll
                                scroll.flags = Gtk.EventControllerScrollFlags.BOTH_AXES | Gtk.EventControllerScrollFlags.KINETIC

                                self.add_controller(scroll)

                                scroll.connect("scroll", (_, x, y) => {
                                    y > 0 ? exec("pactl set-sink-volume 0 -1%") : exec("pactl set-sink-volume 0 +1%")
                                })

                                audio.defaultSpeaker.mute ? self.add_css_class("muted") : self.remove_css_class("muted");

                                speakerMuted.subscribe(() => {
                                    audio.defaultSpeaker.mute ? self.add_css_class("muted") : self.remove_css_class("muted");
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
                                    visible={!audio.defaultSpeaker.mute}
                                    $={(self) => {
                                        speakerMuted.subscribe(() => {
                                            audio.defaultSpeaker.mute ? self.visible = false : self.visible = true;
                                        })
                                    }}
                                />
                                <label
                                    label={getIcon(audio.defaultSpeaker)}
                                    $={(self) => {
                                        speakerVolume.subscribe(() => {
                                            self.label = getIcon(audio.defaultSpeaker);
                                        })

                                        speakerMuted.subscribe(() => {
                                            self.label = getIcon(audio.defaultSpeaker);
                                        })
                                    }}
                                />
                            </box>
                        </button>
                    } else {
                        return <button
                            class={"error"}
                            cursor={Gdk.Cursor.new_from_name("pointer", null)}
                            label={""}
                            tooltipText={"Microphone Error"}
                            onClicked={() => {
                                const window = App.get_window("AudioMenu");

                                if (window != undefined && window.title != "Devices") {
                                    window.set_title("Devices");
                                }

                                App.toggle_window("AudioMenu");
                            }} />
                    }
                }}
            </With>
        </box>
        <box class={"separator"} />
        <box>
            <With value={mics}>
                {(mics) => {
                    if (mics.length > 0) {
                        const micVolume = createBinding(audio.defaultMicrophone, "volume").as((m) => `${Math.round(m * 100)}%`);
                        const micMuted = createBinding(audio.defaultMicrophone, "mute");

                        return <button
                            class={"input"}
                            cursor={Gdk.Cursor.new_from_name("pointer", null)}
                            $={(self) => {
                                const scroll = new Gtk.EventControllerScroll
                                scroll.flags = Gtk.EventControllerScrollFlags.BOTH_AXES | Gtk.EventControllerScrollFlags.KINETIC

                                self.add_controller(scroll)

                                scroll.connect("scroll", (_, x, y) => {
                                    y > 0 ? exec("pactl set-source-volume 0 -1%") : exec("pactl set-source-volume 0 +1%")
                                })

                                audio.defaultMicrophone.mute ? self.add_css_class("muted") : self.remove_css_class("muted");

                                micMuted.subscribe(() => {
                                    audio.defaultMicrophone.mute ? self.add_css_class("muted") : self.remove_css_class("muted");
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
                                    visible={!audio.defaultMicrophone.mute}
                                    $={(self) => {
                                        micMuted.subscribe(() => {
                                            audio.defaultMicrophone.mute ? self.visible = false : self.visible = true;
                                        })
                                    }}
                                />
                                <label
                                    label={audio.defaultMicrophone.mute ? "󰍭" : "󰍬"}
                                    $={(self) => {
                                        micVolume.subscribe(() => {
                                            self.label = audio.defaultMicrophone.mute ? "󰍭" : "󰍬";
                                        })

                                        micMuted.subscribe(() => {
                                            self.label = audio.defaultMicrophone.mute ? "󰍭" : "󰍬";
                                        })
                                    }}
                                />
                            </box>
                        </button>
                    } else {
                        return <button
                            class={"error"}
                            cursor={Gdk.Cursor.new_from_name("pointer", null)}
                            label={""}
                            tooltipText={"Microphone Error"}
                            onClicked={() => {
                                const window = App.get_window("AudioMenu");

                                if (window != undefined && window.title != "Devices") {
                                    window.set_title("Devices");
                                }

                                App.toggle_window("AudioMenu");
                            }} />
                    }
                }}
            </With>
        </box>
    </box>
}

function getIcon(endpoint: WirePlumber.Endpoint) {
    if (endpoint.mute) {
        return "";
    } else {

        const icons = {
            65: " ",
            33: "",
            1: "",
            0: "",
        }

        const node_name = exec(['bash', '-c', `wpctl inspect ${endpoint.id} | grep "node.name" | awk -F '"' '{print $2}'`]);

        const icon = [65, 33, 1, 0].find(threshold => threshold <= endpoint.volume * 100) as keyof typeof icons;

        return node_name.includes("bluez") ? `${icons[icon]} ` : icons[icon];
    }
}