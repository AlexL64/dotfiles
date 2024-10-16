const mpris = await Service.import("mpris")
const players = mpris.bind("players")

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
                        self.class_name = "mpris-hidden"
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
                                case "Playing": return "media-playback-pause-symbolic"
                                case "Paused":
                                case "Stopped": return "media-playback-start-symbolic"
                            }
                        }),
                    }),
                }),
                Widget.Button({
                    className: "media-button",
                    onClicked: () => {
                        App.toggleWindow("media");
                        App.windows.forEach(e => !e.name?.includes("bar") && !e.name?.includes("media") ? e.hide() : null);
                    },
                    child: Widget.Box({
                        children: [
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
                                        setup: self => {
                                            self.hook(mpris, () => {
                                                player.track_artists == "" ? self.class_name = "mpris-artist-hidden" : self.class_name = "mpris-artist";
                                            }, "changed")
                                        },
                                    }),
                                ]
                            }),
                            Widget.Box({
                                setup: self => {
                                    self.hook(mpris, () => {
                                        if (player.position != -1 || player.length != -1) {
                                            self.visible = true;
                                        } else {
                                            self.visible = false;
                                        }
                                    })
                                },
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
                        ],
                    })
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