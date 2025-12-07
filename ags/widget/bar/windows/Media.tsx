import { Astal, Gdk, Gtk } from "ags/gtk4";
import AstalMpris from "gi://AstalMpris?version=0.1"
import App from "ags/gtk4/app"
import { createBinding, For } from "ags";
import Pango from "gi://Pango?version=1.0";
import { exec } from "ags/process";

export default function Media() {

    const mpris = AstalMpris.get_default();
    const players = createBinding(mpris, "players")

    const playerctld = AstalMpris.Player.new("playerctld");

    return <window
        name={"Media"}
        marginTop={10}
        anchor={Astal.WindowAnchor.TOP}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}
        defaultHeight={-1}
        defaultWidth={-1}
        $={(self) => {
            playerctld.connect("notify::title", () => {
                if (self.visible && playerctld.title == "") {
                    self.hide();
                }
            });
        }}>
        <box
            class={'media'}
            spacing={10}
            orientation={Gtk.Orientation.VERTICAL}>
            <For each={players}>
                {(player) => {
                    const playback_status = createBinding(player, "playback_status").as((s) => {
                        switch (s) {
                            case 0: return "media-playback-pause-symbolic";
                            case 1: return "media-playback-start-symbolic";
                            default: return "media-playback-stop";
                        }
                    });

                    return <box
                        class={"card"}
                        visible={createBinding(player, "title").as((t) => t != "" && !player.busName.includes("playerctld"))}
                        spacing={10}>
                        <box
                            class={"image"}
                            css={createBinding(player, "coverArt").as((c) => {
                                if (c == null || c == "") {
                                    const home = exec(["bash", "-c", "echo $HOME"]);
                                    return `background-image: url('file://${home}/.config/ags/widget/bar/assets/images/music.png');`;
                                } else {
                                    return `background-image: url('file://${c}');`;
                                }
                            })}
                        />
                        <box orientation={Gtk.Orientation.VERTICAL}>
                            <label
                                label={createBinding(player, "title").as((t) => t != null ? t : "")}
                                class={"title"}
                                wrap
                                lines={2}
                                xalign={0}
                                ellipsize={Pango.EllipsizeMode.END}
                                maxWidthChars={20}
                            />
                            <box orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.END} vexpand hexpand>
                                <label
                                    label={createBinding(player, "artist").as((a) => a != null ? a : "")}
                                    class={"artist"}
                                    wrap={false}
                                    xalign={0}
                                />
                                <slider
                                    marginBottom={0}
                                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                    valign={Gtk.Align.END}
                                    class={"slider"}
                                    value={createBinding(player, "position").as((p) => p / player.length)}
                                    onChangeValue={(self) => {
                                        player.position = Math.round(self.value * player.length);
                                    }}
                                />
                                <box vexpand={false}>
                                    <label
                                        class={"position"}
                                        label={createBinding(player, "position").as((p) => formatTime(Math.trunc(p)))}
                                        halign={Gtk.Align.START}
                                        hexpand
                                        visible={createBinding(player, "position").as((p) => !(p == 0))}
                                    />
                                    <box class={"controls"} hexpand vexpand halign={Gtk.Align.CENTER} spacing={3}>
                                        <button cursor={Gdk.Cursor.new_from_name("pointer", null)} onClicked={() => player.previous()} visible={createBinding(player, "canGoPrevious")}>
                                            <image iconName={"media-skip-backward-symbolic"} />
                                        </button>
                                        <button cursor={Gdk.Cursor.new_from_name("pointer", null)} onClicked={() => player.play_pause()} visible={createBinding(player, "canPlay")}>
                                            <image iconName={playback_status} />
                                        </button>
                                        <button cursor={Gdk.Cursor.new_from_name("pointer", null)} onClicked={() => player.next()} visible={createBinding(player, "canGoPrevious")}>
                                            <image iconName={"media-skip-forward-symbolic"} />
                                        </button>
                                    </box>
                                    <label
                                        class={"length"}
                                        label={createBinding(player, "length").as((l) => formatTime(Math.trunc(l)))}
                                        halign={Gtk.Align.END}
                                        hexpand
                                        visible={createBinding(player, "length").as((l) => !(l == -1))}
                                    />
                                </box>
                            </box>
                        </box>
                    </box >
                }}
            </For>

        </box>
    </window>
}

function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const pad = (num: number): string => num.toString().padStart(2, '0');

    if (hours > 0) {
        return `${hours}:${pad(minutes)}:${pad(remainingSeconds)}`;
    } else {
        return `${minutes}:${pad(remainingSeconds)}`;
    }
}
