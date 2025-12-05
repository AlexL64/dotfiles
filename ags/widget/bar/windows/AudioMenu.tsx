import { createBinding, createState, For, With } from "ags";
import Wp from "gi://AstalWp?version=0.1"
import App from "ags/gtk4/app"
import { Astal, Gdk, Gtk } from "ags/gtk4";
import { timeout } from "ags/time";
import Pango from "gi://Pango?version=1.0";

const audio = Wp.get_default().audio;

const speakers = createBinding(audio, "speakers");
const microphones = createBinding(audio, "microphones");
const streams = createBinding(audio, "streams");
const devices = createBinding(audio, "devices");

export default function AudioMenu() {

    const [selectedMenu, selectedMenuSet] = createState("Output Devices");

    return <window
        name={"AudioMenu"}
        marginTop={10}
        marginLeft={344}
        widthRequest={500}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}
        defaultHeight={-1}
        defaultWidth={-1}
        title={selectedMenu}
        onNotifyTitle={(self) => {
            selectedMenuSet(self.title);
        }}>
        <box class={"audioMenu"} orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.START}>
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
                <button
                    class={"devices"}
                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                    label={"Devices"}
                    onClicked={() => selectedMenuSet("Devices")}
                    $={(self) => {
                        selectedMenu.get() == "Devices" ? self.add_css_class("toggled") : self.remove_css_class("toggled");

                        selectedMenu.subscribe(() => {
                            selectedMenu.get() == "Devices" ? self.add_css_class("toggled") : self.remove_css_class("toggled");
                        })
                    }}
                />
            </box>
            <box
                class={"content"}
                $={(self) => {
                    speakers.subscribe(() => {
                        self.heightRequest = calculateHeight();
                    })

                    microphones.subscribe(() => {
                        self.heightRequest = calculateHeight();
                    })

                    streams.subscribe(() => {
                        self.heightRequest = calculateHeight();
                    })
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
        case "Devices":
            return DevicesContent();
        default:
            return OutputDevicesContent();
    }
}

function OutputDevicesContent() {

    return <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
        <For each={speakers}>
            {(speaker) => {
                if (speaker.description != "Dummy Output") {
                    return <box orientation={Gtk.Orientation.VERTICAL} class={"card"}>
                        <box>
                            <label
                                class={"description"}
                                label={createBinding(speaker, "description")}
                                ellipsize={Pango.EllipsizeMode.END}
                                maxWidthChars={20}
                                hexpand
                                xalign={0}
                                tooltipText={createBinding(speaker, "description")}
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
                                <menubutton class={"profiles"} label={""} direction={Gtk.ArrowType.NONE} cursor={Gdk.Cursor.new_from_name("pointer", null)}>
                                    <popover halign={Gtk.Align.START}>
                                        <box orientation={Gtk.Orientation.VERTICAL} spacing={5}>
                                            {speaker.device.profiles.map((p) => {
                                                return <box>
                                                    <Gtk.CheckButton
                                                        active={p.index == speaker.device.activeProfileId}>
                                                        <Gtk.GestureClick
                                                            propagationPhase={Gtk.PropagationPhase.CAPTURE}
                                                            button={Gdk.BUTTON_PRIMARY}
                                                            onPressed={() => {
                                                                speaker.device.set_active_profile_id(p.index);
                                                            }} />
                                                    </Gtk.CheckButton>
                                                    <label label={p.description} />
                                                </box>
                                            })}
                                        </box>
                                    </popover>
                                </menubutton>
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
                }

                return <box />
            }}
        </For>
    </box>
}

function InputDevicesContent() {
    return <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
        <For each={microphones}>
            {(mic) => {
                return <box orientation={Gtk.Orientation.VERTICAL} class={"card"}>
                    <box>
                        <label
                            class={"description"}
                            label={createBinding(mic, "description")}
                            ellipsize={Pango.EllipsizeMode.END}
                            maxWidthChars={10}
                            hexpand
                            xalign={0}
                            tooltipText={createBinding(mic, "description")}
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
                            <menubutton class={"profiles"} label={""} direction={Gtk.ArrowType.NONE} cursor={Gdk.Cursor.new_from_name("pointer", null)}>
                                <popover halign={Gtk.Align.START}>
                                    <box orientation={Gtk.Orientation.VERTICAL} spacing={5}>
                                        {mic.device.profiles.map((p) => {
                                            return <box>
                                                <Gtk.CheckButton
                                                    active={p.index == mic.device.activeProfileId}>
                                                    <Gtk.GestureClick
                                                        propagationPhase={Gtk.PropagationPhase.CAPTURE}
                                                        button={Gdk.BUTTON_PRIMARY}
                                                        onPressed={() => {
                                                            mic.device.set_active_profile_id(p.index);
                                                        }} />
                                                </Gtk.CheckButton>
                                                <label label={p.description} />
                                            </box>
                                        })}
                                    </box>
                                </popover>
                            </menubutton>
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
        <For each={streams}>
            {(stream) => {

                return <box class={"card"}>
                    <image iconName={createBinding(stream, "icon")} class={"icon"} pixelSize={48} />
                    <box orientation={Gtk.Orientation.VERTICAL}>
                        <box>
                            <label
                                class={"description"}
                                label={createBinding(stream, "description")}
                                ellipsize={Pango.EllipsizeMode.END}
                                maxWidthChars={10}
                                hexpand
                                xalign={0}
                                tooltipText={createBinding(stream, "description")}
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

function DevicesContent() {
    return <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
        <For each={devices}>
            {(device) => {

                return <box class={"card"}>
                    <image iconName={"audio-card"} class={"icon"} pixelSize={48} />
                    <box orientation={Gtk.Orientation.VERTICAL} homogeneous>
                        <box>
                            <label
                                class={"description"}
                                label={createBinding(device, "description")}
                                ellipsize={Pango.EllipsizeMode.END}
                                maxWidthChars={10}
                                hexpand
                                xalign={0}
                                tooltipText={createBinding(device, "description")}
                            />
                        </box>
                        <box>
                            <label
                                class={"description"}
                                label={createBinding(device, "activeProfileId").as((id) => {
                                    const item = device.profiles.find(item => item.index == id);
                                    return item?.description ? item?.description : "";
                                })}
                                ellipsize={Pango.EllipsizeMode.END}
                                maxWidthChars={10}
                                hexpand
                                xalign={0}
                                tooltipText={createBinding(device, "activeProfileId").as((id) => {
                                    const item = device.profiles.find(item => item.index == id);
                                    return item?.description ? item?.description : "";
                                })}
                            />
                        </box>
                    </box>
                    <box class={"settings"} spacing={10}>
                        <With value={createBinding(device, "activeProfileId")}>
                            {() => {
                                return <menubutton
                                    class={"profiles"}
                                    valign={Gtk.Align.START}
                                    halign={Gtk.Align.END}
                                    label={""}
                                    direction={Gtk.ArrowType.NONE}
                                    cursor={Gdk.Cursor.new_from_name("pointer", null)}>
                                    <popover halign={Gtk.Align.START}>
                                        <box orientation={Gtk.Orientation.VERTICAL} spacing={5}>
                                            {device.profiles.map((p) => {
                                                return <box>
                                                    <Gtk.CheckButton
                                                        active={p.index == device.activeProfileId}>
                                                        <Gtk.GestureClick
                                                            propagationPhase={Gtk.PropagationPhase.CAPTURE}
                                                            button={Gdk.BUTTON_PRIMARY}
                                                            onPressed={() => {
                                                                device.set_active_profile_id(p.index);
                                                            }} />
                                                    </Gtk.CheckButton>
                                                    <label label={p.description} />
                                                </box>
                                            })}
                                        </box>
                                    </popover>
                                </menubutton>
                            }}
                        </With>
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
            0: "",
        }

        const icon = [65, 33, 1, 0].find(threshold => threshold <= endpoint.volume * 100) as keyof typeof icons;

        return `${icons[icon]}`;
    }
}

function calculateHeight() {
    const nbSpeakers = audio.speakers.length;
    const nbMics = audio.microphones.length;
    const nbStreams = audio.streams.length;
    const nbDevices = audio.devices.length;

    const nb = Math.max(nbSpeakers, nbMics, nbStreams, nbDevices);

    return nb > 1 ? 20 + (nb * 82) + ((nb - 1) * 10) : 102;
}