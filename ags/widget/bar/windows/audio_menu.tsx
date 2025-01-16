import { bind, exec, Variable } from "astal";
import { App, Astal, Gdk } from "astal/gtk3";
import { GtkMenu, GtkMenuItem, GtkCheckButton } from "../../../my_types";
import Wp from "gi://AstalWp";

//@ts-ignore
const audio = Wp.get_default().audio;

export default function AudioMenu() {

    const selectedMenu = Variable("Output Devices");

    return <window
        name={"audioMenu"}
        marginTop={10}
        marginLeft={344}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}>
        <box className={"audioMenu"} vertical>
            <box className={"menu"} homogeneous>
                <button
                    className={"output"}
                    label={"Output Devices"}
                    onClick={() => selectedMenu.set("Output Devices")}
                    setup={(self) => {
                        self.toggleClassName("toggled", selectedMenu.get() == "Output Devices");
                        self.hook(bind(selectedMenu), (self, m) => {
                            self.toggleClassName("toggled", m == "Output Devices");
                        })
                    }}
                />
                <button
                    className={"input"}
                    label={"Input Devices"}
                    onClick={() => selectedMenu.set("Input Devices")}
                    setup={(self) => {
                        self.toggleClassName("toggled", selectedMenu.get() == "Input Devices");
                        self.hook(bind(selectedMenu), (self, m) => {
                            self.toggleClassName("toggled", m == "Input Devices");
                        })
                    }}
                />
                <button
                    className={"application"}
                    label={"Applications"}
                    onClick={() => selectedMenu.set("Applications")}
                    setup={(self) => {
                        self.toggleClassName("toggled", selectedMenu.get() == "Applications");
                        self.hook(bind(selectedMenu), (self, m) => {
                            self.toggleClassName("toggled", m == "Applications");
                        })
                    }}
                />
            </box>
            <box
                className={"content"}
                setup={(self) => {
                    self.hook(bind(audio, "speakers"), (self) => {
                        self.heightRequest = calculateHeight();
                    })

                    self.hook(bind(audio, "microphones"), (self) => {
                        self.heightRequest = calculateHeight();
                    })

                    self.hook(bind(audio, "streams"), (self) => {
                        self.heightRequest = calculateHeight();
                    })
                }}
            >
                {bind(selectedMenu).as((value) => renderContent(value))}
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

    return <box vertical spacing={10}>
        {
            bind(audio, "speakers").as((speakers) => speakers.map((speaker) => {
                return <box vertical className={"card"}>
                    <box>
                        <label
                            className={"description"}
                            label={bind(speaker, "description")}
                            truncate
                            hexpand
                            xalign={0}
                        />
                        <box className={"settings"} spacing={10}>
                            <button
                                className={"default"}
                                onClick={() => {
                                    speaker.isDefault = true;
                                }}
                                setup={(self) => {
                                    self.hook(bind(speaker, "isDefault"), () => {
                                        self.className = "default";
                                    })
                                }}>
                                <GtkCheckButton active={bind(speaker, "isDefault")} />
                            </button>
                            <button
                                className={"profiles"}
                                label={""}
                                onClick={(self) => {
                                    const menu = profilesMenu(speaker.id, "sinks");
                                    // @ts-ignore
                                    menu.popup_at_widget(self, Gdk.Gravity.NORTH_EAST, Gdk.Gravity.NORTH_WEST, null);
                                }}
                            />
                        </box>
                    </box>
                    <box>
                        <button
                            className={"toggle"}
                            onClick={() => {
                                speaker.mute = !speaker.mute;
                            }}>
                            <label
                                label={getVolumeIcon(speaker)}
                                setup={(self) => {
                                    self.toggleClassName("mute", speaker.mute);

                                    self.hook(bind(speaker, "volume"), (self) => {
                                        self.label = getVolumeIcon(speaker);
                                    })

                                    self.hook(bind(speaker, "mute"), (self, mute) => {
                                        self.label = getVolumeIcon(speaker);
                                        self.toggleClassName("mute", mute);
                                    })
                                }}
                            />
                        </button>
                        <slider
                            className={"bar"}
                            value={bind(speaker, "volume")}
                            hexpand
                            onDragged={(self) => {
                                speaker.volume = self.value;
                            }}
                        />
                        <label label={bind(speaker, "volume").as((v) => `${Math.round(v * 100)}%`)} />
                    </box>
                </box>
            }))
        }
    </box>
}

function InputDevicesContent() {
    return <box vertical spacing={10}>
        {
            bind(audio, "microphones").as((mics) => mics.map((mic) => {

                return <box vertical className={"card"}>
                    <box>
                        <label
                            className={"description"}
                            label={bind(mic, "description")}
                            truncate
                            hexpand
                            xalign={0}
                        />
                        <box className={"settings"} spacing={10}>
                            <button
                                className={"default"}
                                onClick={() => {
                                    mic.isDefault = true;
                                }}
                                setup={(self) => {
                                    self.hook(bind(mic, "isDefault"), () => {
                                        self.className = "default";
                                    })
                                }}>
                                <GtkCheckButton active={bind(mic, "isDefault")} />
                            </button>
                            <button
                                className={"profiles"}
                                label={""}
                                onClick={(self) => {
                                    const menu = profilesMenu(mic.id, "sinks");
                                    // @ts-ignore
                                    menu.popup_at_widget(self, Gdk.Gravity.NORTH_EAST, Gdk.Gravity.NORTH_WEST, null);
                                }}
                            />
                        </box>
                    </box>
                    <box>
                        <button
                            className={"toggle"}
                            onClick={() => {
                                mic.mute = !mic.mute;
                            }}>
                            <label
                                className={"mic"}
                                label={bind(mic, "mute").as((m) => {
                                    return m ? "󰍭" : "󰍬";
                                })}
                                setup={(self) => {
                                    self.toggleClassName("mute", mic.mute)

                                    self.hook(bind(mic, "mute"), (self, mute) => {
                                        self.toggleClassName("mute", mute)
                                    })
                                }}
                            />
                        </button>
                        <slider
                            className={"bar"}
                            value={bind(mic, "volume")}
                            hexpand
                            onDragged={(self) => {
                                mic.volume = self.value;
                            }}
                        />
                        <label label={bind(mic, "volume").as((v) => `${Math.round(v * 100)}%`)} />
                    </box>
                </box>
            }))
        }
    </box>;
}

function ApplicationsContent() {
    return <box vertical spacing={10}>
        {
            bind(audio, "streams").as((streams) => streams.map((stream) => {
                return <box className={"card"}>
                    <icon icon={bind(stream, "icon")} className={"icon"} />
                    <box vertical>
                        <box>
                            <label
                                className={"description"}
                                label={bind(stream, "description")}
                                truncate
                                lines={1}
                                hexpand
                                xalign={0}
                            />
                        </box>
                        <box>
                            <button
                                className={"toggle"}
                                onClick={() => {
                                    stream.mute = !stream.mute;
                                }}>
                                <label
                                    label={getVolumeIcon(stream)}
                                    setup={(self) => {
                                        self.toggleClassName("mute", stream.mute);

                                        self.hook(bind(stream, "volume"), (self) => {
                                            self.label = getVolumeIcon(stream);
                                        })

                                        self.hook(bind(stream, "mute"), (self, mute) => {
                                            self.label = getVolumeIcon(stream);
                                            self.toggleClassName("mute", mute);
                                        })
                                    }}
                                />
                            </button>
                            <slider
                                className={"bar"}
                                value={bind(stream, "volume")}
                                hexpand
                                onDragged={(self) => {
                                    stream.volume = self.value;
                                }}
                            />
                            <label label={bind(stream, "volume").as((v) => `${Math.round(v * 100)}%`)} />
                        </box>
                    </box>
                </box>
            }))
        }
    </box>;
}


function getVolumeIcon(endpoint: Wp.Endpoint) {
    const icons = {
        65: " ",
        33: "",
        1: "",
        0: "",
    }

    if (endpoint.mute) {
        return "";
    } else {
        const icon = [65, 33, 1, 0].find(threshold => threshold <= endpoint.volume * 100);
        // @ts-ignore
        return icons[icon];
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
    //@ts-ignore
    const activeProfile = profilesLines.pop().replace("Active Profile: ", "");

    const profilesList = profilesLines.map(line => {
        const [name, descriptionTemp] = line.split(": ");

        const description = descriptionTemp.replace(" (sinks", "");

        return { name, description };
    });

    return <GtkMenu>
        {
            profilesList.map((p) => <GtkMenuItem
                onActivate={() => {
                    exec(`pactl set-card-profile ${cardSerial} ${p.name}`);
                }}>
                <GtkCheckButton
                    active={p.name == activeProfile}
                    label={p.description}
                />
            </GtkMenuItem>)
        }
    </GtkMenu>
}