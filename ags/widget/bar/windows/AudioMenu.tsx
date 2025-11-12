import { createBinding, createState, For, With } from "ags";
import Wp from "gi://AstalWp?version=0.1"
import App from "ags/gtk4/app"
import { Astal, Gdk, Gtk } from "ags/gtk4";
import { timeout } from "ags/time";
import { exec } from "ags/process";

const audio = Wp.get_default()!.audio;

export default function AudioMenu() {

    const [selectedMenu, selectedMenuSet] = createState("Output Devices");

    return <window
        name={"audioMenu"}
        marginTop={10}
        marginLeft={344}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}>
        <box class={"audioMenu"} orientation={Gtk.Orientation.VERTICAL}>
            <box class={"menu"} homogeneous>
                <button
                    class={"output"}
                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                    label={"Output Devices"}
                    onClicked={() => selectedMenuSet("Output Devices")}
                    $={(self) => {
                        selectedMenu.get() == "Output Devices" ? self.add_css_class("toggled") : self.remove_css_class("toggled");

                        selectedMenu.subscribe(() => {
                            selectedMenu.get() == "Output Devices" ? self.add_css_class("toggled") : self.remove_css_class("toggled");
                        })
                    }}
                />
                <button
                    class={"input"}
                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                    label={"Input Devices"}
                    onClicked={() => selectedMenuSet("Input Devices")}
                    $={(self) => {
                        selectedMenu.get() == "Input Devices" ? self.add_css_class("toggled") : self.remove_css_class("toggled");

                        selectedMenu.subscribe(() => {
                            selectedMenu.get() == "Input Devices" ? self.add_css_class("toggled") : self.remove_css_class("toggled");
                        })
                    }}
                />
                <button
                    class={"application"}
                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                    label={"Applications"}
                    onClicked={() => selectedMenuSet("Applications")}
                    $={(self) => {
                        selectedMenu.get() == "Applications" ? self.add_css_class("toggled") : self.remove_css_class("toggled");

                        selectedMenu.subscribe(() => {
                            selectedMenu.get() == "Applications" ? self.add_css_class("toggled") : self.remove_css_class("toggled");
                        })
                    }}
                />
            </box>
            <box
                class={"content"}
                $={(self) => {
                    audio.connect("notify::speakers", () => {
                        self.heightRequest = calculateHeight();
                    });

                    audio.connect("notify::microphones", () => {
                        self.heightRequest = calculateHeight();
                    });

                    audio.connect("notify::streams", () => {
                        self.heightRequest = calculateHeight();
                    });
                }}>
                <With value={selectedMenu}>
                    {(value) => renderContent(value)}
                </With>
            </box>
        </box>
    </window>
}

function renderContent(value: string) {
    switch (value) {
        case "Output Devices":
            return OutputDevicesContent();
        case "Input Devices":
            return InputDevicesContent();
        case "Applications":
            return ApplicationsContent();
        default:
            return OutputDevicesContent();
    }
}

function OutputDevicesContent() {

    return <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
        <For each={createBinding(audio, "speakers")}>
            {(speaker: Wp.Endpoint) => {
                return <box orientation={Gtk.Orientation.VERTICAL} class={"card"}>
                    <box>
                        <label
                            class={"description"}
                            label={createBinding(speaker, "description")}
                            // truncate
                            hexpand
                            xalign={0}
                        />
                        <box class={"settings"} spacing={10}>
                            <button
                                class={"default"}
                                cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                onClicked={() => {
                                    speaker.isDefault = true;
                                }}
                                $={(self) => {
                                    speaker.connect("notify::is-default", () => {
                                        self.add_css_class("default");
                                    });
                                }}>
                                <Gtk.CheckButton active={createBinding(speaker, "isDefault")} />
                            </button>
                            <With value={createBinding(speaker, "params_changed")}>
                                {(paramsChanged) => {
                                    return profilesMenu(speaker.id, "sinks")
                                }}
                            </With>
                        </box>
                    </box>
                    <box>
                        <button
                            class={"toggle"}
                            cursor={Gdk.Cursor.new_from_name("pointer", null)}
                            onClicked={() => {
                                speaker.mute = !speaker.mute;
                            }}>
                            <label
                                label={getVolumeIcon(speaker)}
                                $={(self) => {
                                    speaker.mute ? self.add_css_class("mute") : self.remove_css_class("mute");

                                    speaker.connect("notify::volume", () => {
                                        self.label = getVolumeIcon(speaker);
                                    });

                                    speaker.connect("notify::mute", () => {
                                        self.label = getVolumeIcon(speaker);
                                        speaker.mute ? self.add_css_class("mute") : self.remove_css_class("mute");
                                    });
                                }}
                            />
                        </button>
                        <slider
                            class={"bar"}
                            value={createBinding(speaker, "volume")}
                            hexpand
                            onChangeValue={(self) => {
                                speaker.volume = self.value;
                            }}
                            $={(self) => {
                                const scroll = new Gtk.EventControllerScroll
                                scroll.flags = Gtk.EventControllerScrollFlags.BOTH_AXES | Gtk.EventControllerScrollFlags.KINETIC

                                self.add_controller(scroll)

                                scroll.connect("scroll", (_, x, y) => {
                                    timeout(0, () => {
                                        self.value = speaker.volume;
                                    })
                                })
                            }}
                        />
                        <label label={createBinding(speaker, "volume").as((v) => `${Math.round(v * 100)}%`)} />
                    </box>
                </box>
            }}
        </For>
    </box>
}

function InputDevicesContent() {
    return <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
        <For each={createBinding(audio, "microphones")}>
            {(mic: Wp.Endpoint) => {
                return <box orientation={Gtk.Orientation.VERTICAL} class={"card"}>
                    <box>
                        <label
                            class={"description"}
                            label={createBinding(mic, "description")}
                            // truncate
                            hexpand
                            xalign={0}
                        />
                        <box class={"settings"} spacing={10}>
                            <button
                                class={"default"}
                                onClicked={() => {
                                    mic.isDefault = true;
                                }}
                                $={(self) => {
                                    mic.connect("notify::is-default", () => {
                                        self.add_css_class("default");
                                    });
                                }}>
                                <Gtk.CheckButton active={createBinding(mic, "isDefault")} />
                            </button>
                            <With value={createBinding(mic, "params_changed")}>
                                {(paramsChanged) => {
                                    return profilesMenu(mic.id, "sources")
                                }}
                            </With>
                        </box>
                    </box>
                    <box>
                        <button
                            class={"toggle"}
                            cursor={Gdk.Cursor.new_from_name("pointer", null)}
                            onClicked={() => {
                                mic.mute = !mic.mute;
                            }}>
                            <label
                                class={"mic"}
                                label={createBinding(mic, "mute").as((m) => {
                                    return m ? "󰍭" : "󰍬";
                                })}
                                $={(self) => {
                                    mic.mute ? self.add_css_class("mute") : self.remove_css_class("mute");

                                    mic.connect("notify::mute", () => {
                                        mic.mute ? self.add_css_class("mute") : self.remove_css_class("mute");
                                    });
                                }}
                            />
                        </button>
                        <slider
                            class={"bar"}
                            value={createBinding(mic, "volume")}
                            hexpand
                            onChangeValue={(self) => {
                                mic.volume = self.value;
                            }}
                            $={(self) => {
                                const scroll = new Gtk.EventControllerScroll
                                scroll.flags = Gtk.EventControllerScrollFlags.BOTH_AXES | Gtk.EventControllerScrollFlags.KINETIC

                                self.add_controller(scroll)

                                scroll.connect("scroll", (_, x, y) => {
                                    timeout(0, () => {
                                        self.value = mic.volume;
                                    })
                                })
                            }}
                        />
                        <label label={createBinding(mic, "volume").as((v) => `${Math.round(v * 100)}%`)} />
                    </box>
                </box>
            }}
        </For>
    </box>;
}

function ApplicationsContent() {
    return <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
        <For each={createBinding(audio, "streams")}>
            {(stream: Wp.Stream) => {

                return <box class={"card"}>
                    <image iconName={createBinding(stream, "icon")} class={"icon"} />
                    <box orientation={Gtk.Orientation.VERTICAL}>
                        <box>
                            <label
                                class={"description"}
                                label={createBinding(stream, "description")}
                                // truncate
                                lines={1}
                                hexpand
                                xalign={0}
                            />
                        </box>
                        <box>
                            <button
                                class={"toggle"}
                                cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                onClicked={() => {
                                    stream.mute = !stream.mute;
                                }}>
                                <label
                                    label={getVolumeIcon(stream)}
                                    $={(self) => {
                                        stream.mute ? self.add_css_class("mute") : self.remove_css_class("mute");

                                        stream.connect("notify::volume", () => {
                                            self.label = getVolumeIcon(stream);
                                        });

                                        stream.connect("notify::mute", () => {
                                            self.label = getVolumeIcon(stream);
                                            stream.mute ? self.add_css_class("mute") : self.remove_css_class("mute");
                                        });
                                    }}
                                />
                            </button>
                            <slider
                                class={"bar"}
                                value={createBinding(stream, "volume")}
                                hexpand
                                onChangeValue={(self) => {
                                    stream.volume = self.value;
                                }}
                                $={(self) => {
                                    const scroll = new Gtk.EventControllerScroll
                                    scroll.flags = Gtk.EventControllerScrollFlags.BOTH_AXES | Gtk.EventControllerScrollFlags.KINETIC

                                    self.add_controller(scroll)

                                    scroll.connect("scroll", (_, x, y) => {
                                        timeout(0, () => {
                                            self.value = stream.volume;
                                        })
                                    })
                                }} />
                            <label label={createBinding(stream, "volume").as((v) => `${Math.round(v * 100)}%`)} />
                        </box>
                    </box>
                </box>
            }}
        </For>
    </box>;
}


function getVolumeIcon(endpoint: Wp.Endpoint | Wp.Stream) {
    if (endpoint.mute) {
        return "";
    } else {

        const icons = {
            65: " ",
            33: "",
            1: "",
            0: "",
        }

        const icon = [65, 33, 1, 0].find(threshold => threshold <= endpoint.volume * 100) as keyof typeof icons;

        return `${icons[icon]}`;
    }
}

function calculateHeight() {
    const nbSpeakers = audio.speakers.length;
    const nbMics = audio.microphones.length;
    const nbStreams = audio.streams.length;

    var nb = 0;

    if (nbSpeakers >= nbMics && nbSpeakers >= nbStreams) {
        nb = nbSpeakers;
    } else if (nbMics >= nbStreams && nbMics >= nbStreams) {
        nb = nbMics;
    } else if (nbStreams >= nbSpeakers && nbStreams >= nbMics) {
        nb = nbStreams;
    }

    return nb > 1 ? 20 + (nb * 80) + ((nb - 1) * 10) : 100;
}

function profilesMenu(index: number, type: string) {

    const cardObjectId = exec([
        "sh",
        "-c",
        `pactl list ${type} | awk '/object.id = "${index}"/ {print device_id} /device.id =/ {device_id=$3}' | tr -d '"'`,
    ])

    const profiles = exec([
        "sh",
        "-c",
        `pactl list cards | sed -n '/object.id = "${cardObjectId}"/,/Ports:/ { /Ports:/!p }' | sed '1,/Profiles:/d'`
    ])

    const cardSerial = exec([
        "sh",
        "-c",
        `pactl list cards | awk -F' = ' '/object.id = "${cardObjectId}"/ {getline; gsub(/"/, "", $2); print $2}'`
    ])


    const profilesLines = profiles.split(/\r?\n/).map(line => line.trimStart());;

    let activeProfile = profilesLines.pop();
    if (activeProfile != undefined) {
        activeProfile = activeProfile.replace("Active Profile: ", "");
    }


    const profilesList = profilesLines.map(line => {
        const [name, descriptionTemp] = line.split(": ");

        const description = descriptionTemp.replace(" (sinks", "");

        return { name, description };
    });

    return <menubutton class={"profiles"} label={""} direction={Gtk.ArrowType.NONE} cursor={Gdk.Cursor.new_from_name("pointer", null)}>

        <popover css={"margin-left: 100px;"}>
            <box orientation={Gtk.Orientation.VERTICAL} spacing={5}>
                {profilesList.map((p) => {
                    return <box>
                        <Gtk.CheckButton
                            active={p.name == activeProfile}>
                            <Gtk.GestureClick
                                propagationPhase={Gtk.PropagationPhase.CAPTURE}
                                button={Gdk.BUTTON_PRIMARY}
                                onPressed={(event) => {
                                    print(cardSerial);
                                    print(p.name);
                                    exec(`pactl set-card-profile ${cardSerial} "${p.name}"`);
                                }} />
                        </Gtk.CheckButton>
                        <label label={p.name} />
                    </box>
                })}
            </box>
        </popover>
    </menubutton>
}