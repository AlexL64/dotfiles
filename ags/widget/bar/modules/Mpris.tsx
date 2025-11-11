import AstalMpris from "gi://AstalMpris?version=0.1";
import { createBinding } from "gnim";
import App from "ags/gtk4/app"
import { Gdk, Gtk } from "ags/gtk4";

function lengthStr(length: number) {
    const min = Math.floor(length / 60)
    const sec = Math.floor(length % 60)
    const sec0 = sec < 10 ? "0" : ""
    return `${min}:${sec0}${sec}`
}

function truncateString(str: string, length: number): string {
  if (str.length > length) {
    return str.substring(0, length) + '…';
  }
  return str;
}

export default function Mpris() {

    const player = AstalMpris.Player.new("playerctld");

    const can_play = createBinding(player, "canPlay");

    const playback_status = createBinding(player, "playback_status").as((s) => {
        switch (s) {
            case 0: return "media-playback-pause-symbolic";
            case 1: return "media-playback-start-symbolic";
            default: return "media-playback-stop";
        }
    });

    return <box
        class={"mpris"}
        cursor={Gdk.Cursor.new_from_name("pointer", null)}
        $={(self) => {
            player.canPlay ? self.visible = true : self.visible = false;

            can_play.subscribe(() => {
                player.canPlay ? self.visible = true : self.visible = false;
            })
        }}>
        <button
            class={"play_pause"}
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            onClicked={() => player.play_pause()}>
            <image iconName={playback_status} />
        </button>
        <button
            class={"infos"}
            cursor={Gdk.Cursor.new_from_name("pointer", null)}
            tooltipText={createBinding(player, "title")}
            onClicked={() => {
                App.toggle_window("media");
            }}>
            <box>
                <box class={"text"} orientation={Gtk.Orientation.VERTICAL}>
                    <label
                        class={"title"}
                        halign={Gtk.Align.START}
                        lines={createBinding(player, "artist").as((a) => a ? 1 : 2)}
                        visible={createBinding(player, "title").as((t) => t ? true : false)}
                        label={createBinding(player, "title").as((t) => t == null ? "" : truncateString(t, 25))}
                    />
                    <label
                        class={"artist"}
                        halign={Gtk.Align.START}
                        valign={Gtk.Align.CENTER}
                        visible={createBinding(player, "artist").as((a) => a ? true : false)}
                        label={createBinding(player, "artist").as((a) => a == null ? "" : truncateString(a, 20))}
                    />
                </box>
                <box
                    class={"time"}
                    $={(self) => {
                        player.length == -1 ? self.visible = false : self.visible = true;

                        createBinding(player, "length").subscribe(() => {
                            player.length == -1 ? self.visible = false : self.visible = true;
                        })
                    }}
                >
                    <label label={createBinding(player, "position").as((p) => lengthStr(p))} />
                    <label label={" / "} />
                    <label label={createBinding(player, "length").as((l) => lengthStr(l))} />
                </box>
            </box>
        </button>
    </box>
}