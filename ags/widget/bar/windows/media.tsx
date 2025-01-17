import AstalMpris from "gi://AstalMpris";
import { bind } from "astal";
import { App, Astal, Gtk } from "astal/gtk3";

export default function Media() {

    const players = AstalMpris.get_default();

    return <window
        name={"media"}
        className={'media'}
        marginTop={10}
        anchor={Astal.WindowAnchor.TOP}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}>
        <box
            children={bind(players, "players").as(p => {
                if (p.length > 1) {
                    return p.map(Player);
                }
                return;
            })}
            spacing={10}
        />
    </window>
}


function Player(player: any) {

    const playback_status = bind(player, "playback_status").as((s) => {
        switch (s) {
            case 0: return "media-playback-pause-symbolic";
            case 1: return "media-playback-start-symbolic";
            default: return "media-playback-stop";
        }
    });

    return <box
        className={"card"}
        visible={bind(player, "busName").as((n) => !n.includes("playerctld"))}
        spacing={10}>
        <box
            className={"image"}
            css={bind(player, "coverArt").as((c) => {
                if (c == null) {
                    return `background-image: url('./widget/bar/assets/images/music.png')`;
                } else {
                    return `background-image: url('${c}')`;
                }
            })}
        />
        <box vertical>
            <label
                label={bind(player, "title")}
                className={"title"}
                wrap
                lines={2}
                truncate
                xalign={0}
            />
            <box vertical valign={Gtk.Align.END} expand>
                <label
                    label={bind(player, "artist").as((a) => a != null ? a : "")}
                    className={"artist"}
                    truncate
                    wrap={false}
                    xalign={0}
                />
                <slider
                    marginBottom={0}
                    valign={Gtk.Align.END}
                    className={"slider"}
                    value={bind(player, "position").as((p) => p / player.length)}
                    onDragged={(self) => {
                        player.position = Math.round(self.value * player.length);
                    }}
                />
                <box vexpand={false}>
                    <label
                        className={"position"}
                        label={bind(player, "position").as((p) => formatTime(Math.trunc(p)))}
                        halign={Gtk.Align.START}
                        hexpand
                        visible={bind(player, "position").as((p) => !(p == 0))}
                    />
                    <box className={"controls"} expand halign={Gtk.Align.CENTER} spacing={3}>
                        <button onClicked={() => player.previous()} visible={bind(player, "canGoPrevious")}>
                            <icon icon={"media-skip-backward-symbolic"} />
                        </button>
                        <button onClicked={() => player.play_pause()} visible={bind(player, "canPlay")}>
                            <icon icon={playback_status} />
                        </button>
                        <button onClicked={() => player.next()} visible={bind(player, "canGoPrevious")}>
                            <icon icon={"media-skip-forward-symbolic"} />
                        </button>
                    </box>
                    <label
                        className={"length"}
                        label={bind(player, "length").as((l) => formatTime(Math.trunc(l)))}
                        halign={Gtk.Align.END}
                        hexpand
                        visible={bind(player, "length").as((l) => !(l == -1))}
                    />
                </box>
            </box>
        </box>
    </box >
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
