import AstalMpris from "gi://AstalMpris";
import { bind } from "astal";
import { App, Gtk } from "astal/gtk3";

function lengthStr(length: number) {
    const min = Math.floor(length / 60)
    const sec = Math.floor(length % 60)
    const sec0 = sec < 10 ? "0" : ""
    return `${min}:${sec0}${sec}`
}

export default function Mpris() {

    const player = AstalMpris.Player.new("playerctld");

    const can_play = bind(player, "canPlay");

    const playback_status = bind(player, "playback_status").as((s) => {
        switch (s) {
            case 0: return "media-playback-pause-symbolic";
            case 1: return "media-playback-start-symbolic";
            default: return "media-playback-stop";
        }
    });

    return <box
        className={"mpris"}
        cursor={"pointer"}
        setup={(self) => {
            player.canPlay ? self.visible = true : self.visible = false;
            self.hook(can_play, (_, can) => {
                can ? self.visible = true : self.visible = false;
            })
        }}>
        <button
            className={"play_pause"}
            cursor={"pointer"}
            onClicked={() => player.play_pause()}>
            <icon icon={playback_status} />
        </button>
        <button
            className={"infos"}
            cursor={"pointer"}
            tooltipText={bind(player, "title")}
            onClicked={() => {
                App.toggle_window("media");
            }}>
            <box>
                <box className={"text"} vertical>
                    <label
                        className={"title"}
                        halign={Gtk.Align.START}
                        lines={bind(player, "artist").as((a) => a ? 1 : 2)}
                        expand
                        maxWidthChars={25}
                        truncate
                        visible={bind(player, "title").as((t) => t ? true : false)}
                        label={bind(player, "title").as((t) => t == null ? "" : t)}
                    />
                    <label
                        className={"artist"}
                        halign={Gtk.Align.START}
                        valign={Gtk.Align.CENTER}
                        expand
                        maxWidthChars={20}
                        truncate
                        visible={bind(player, "artist").as((a) => a ? true : false)}
                        label={bind(player, "artist").as((a) => a == null ? "" : a)}
                    />
                </box>
                <box
                    className={"time"}
                    setup={(self) => {
                        player.length == -1 ? self.visible = false : self.visible = true;

                        self.hook(bind(player, "length"), (_, length) => {
                            length == -1 ? self.visible = false : self.visible = true;
                        })
                    }}
                >
                    <label label={bind(player, "position").as((p) => lengthStr(p))} />
                    <label label={" / "} />
                    <label label={bind(player, "length").as((l) => lengthStr(l))} />
                </box>
            </box>
        </button>
    </box>
}