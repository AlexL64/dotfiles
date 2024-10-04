const mpris = await Service.import("mpris")
const players = mpris.bind("players")

const PLAY_ICON = "media-playback-start-symbolic"
const PAUSE_ICON = "media-playback-pause-symbolic"

function lengthStr(length) {
    const min = Math.floor(length / 60)
    const sec = Math.floor(length % 60)
    const sec0 = sec < 10 ? "0" : ""
    return `${min}:${sec0}${sec}`
}

function Player(player) {
    if (player.name == "playerctld") {
        return Widget.Box({
            setup: self => {
                self.hook(mpris, () => {
                    if (player.can_play) {
                        self.visible = true;
                        self.class_name = "mpris"
                    } else {
                        self.visible = false;
                        self.class_name = "mpris-false"
                    }
                })
            },
            children: [
                Widget.Button({
                    class_name: "mpris-play-pause",
                    on_clicked: () => player.playPause(),
                    visible: player.bind("can_play"),
                    child: Widget.Icon({
                        icon: player.bind("play_back_status").transform(s => {
                            switch (s) {
                                case "Playing": return PAUSE_ICON
                                case "Paused":
                                case "Stopped": return PLAY_ICON
                            }
                        }),
                    }),
                }),
                Widget.Box({
                    vertical: true,
                    vpack: "center",
                    class_name: "mpris-text",
                    children: [
                        Widget.Label({
                            class_name: "mpris-title",
                            hpack: "start",
                            label: player.bind("track_title"),
                            truncate: "end",
                            maxWidthChars: 25,
                        }),
                        Widget.Label({
                            class_name: "mpris-artist",
                            hpack: "start",
                            label: player.bind("track_artists").transform(a => a.join(", ")),
                            truncate: "end",
                            maxWidthChars: 20,
                        }),
                    ]
                }),
                Widget.Box({
                    class_name: "mpris-time",
                    children: [
                        Widget.Label({
                            class_name: "mpris-position",
                            setup: self => {
                                const update = (_, time) => {
                                    self.label = lengthStr(time || player.position)
                                    self.visible = player.length > 0
                                }

                                self.hook(player, update, "position")
                                self.poll(1000, update)
                            },
                        }),
                        Widget.Label({
                            class_name: "mpris-separator",
                            label: " / ",
                        }),
                        Widget.Label({
                            class_name: "mpris-length",
                            visible: player.bind("length").transform(l => l > 0),
                            label: player.bind("length").transform(lengthStr),
                        })
                    ]
                }),
            ]
        })
    }
    return Widget.Box({});
}

export function Mpris() {
    return Widget.Box({
        children: players.as(p => p.map(Player)),
    })
}