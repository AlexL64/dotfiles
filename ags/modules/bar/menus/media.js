const mpris = await Service.import("mpris")
const players = mpris.bind("players")

function lengthStr(length) {
    const min = Math.floor(length / 60)
    const sec = Math.floor(length % 60)
    const sec0 = sec < 10 ? "0" : ""
    return `${min}:${sec0}${sec}`
}

function Player(player) {
    if (player.name != "playerctld") {
        return Widget.Box({
            className: "media",
            setup: self => {
                self.hook(player, (self) => {
                    console.log(player);
                    player.position == "-1" ? self.class_name = "media-small" : self.class_name = "media";
                    player.track_title == "" ? self.hide() : self.show();
                })
            },
            children: [
                Widget.Box({
                    className: "media-image",
                    css: player.bind("cover_path").transform(p => `background-image: url('${p}');`),
                    setup: self => {
                        if (player.cover_path == undefined) {
                            self.class_name = "";
                        }
                    },
                }),
                Widget.Box({
                    vertical: true,
                    expand: true,
                    children: [
                        Widget.Label({
                            hpack: "start",
                            className: "media-title",
                            wrap: true,
                            lines: 2,
                            truncate: "end",
                            label: player.bind("track_title"),
                        }),
                        Widget.Label({
                            hpack: "start",
                            vpack: "end",
                            className: "media-artist",
                            wrap: false,
                            truncate: "end",
                            label: player.bind("track_artists").transform(a => a.join(", ")),
                        }),
                        Widget.Slider({
                            vpack: "end",
                            vexpand: true,
                            className: "media-slider",
                            draw_value: false,
                            on_change: ({ value }) => player.position = value * player.length,
                            visible: player.bind("length").as(l => l > 0),
                            setup: self => {
                                function update() {
                                    if (player.length > 0) {
                                        const value = player.position / player.length;
                                        self.value = value > 0 ? value : 0;
                                    }
                                }
                                self.hook(player, update)
                                self.hook(player, update, "position")
                                self.poll(1000, update)
                            },
                        }),
                        Widget.CenterBox({
                            vpack: "end",
                            vexpand: true,
                            className: "media-controls",
                            start_widget: Widget.Label({
                                className: "media-position",
                                hpack: "start",
                                setup: self => {
                                    const update = (_, time) => {
                                        self.label = lengthStr(time || player.position)
                                        self.visible = player.length > 0
                                    }

                                    self.hook(player, update, "position")
                                    self.poll(1000, update)
                                },
                            }),
                            center_widget: Widget.Box({
                                spacing: 8,
                                hpack: "center",
                                children: [
                                    Widget.Button({
                                        className: "media-prev",
                                        on_clicked: () => player.previous(),
                                        visible: player.bind("can_go_prev"),
                                        child: Widget.Icon("media-skip-backward-symbolic"),
                                    }),
                                    Widget.Button({
                                        className: "media-playpause",
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
                                        className: "media-next",
                                        on_clicked: () => player.next(),
                                        visible: player.bind("can_go_next"),
                                        child: Widget.Icon("media-skip-forward-symbolic"),
                                    }),
                                ]
                            }),
                            end_widget: Widget.Label({
                                className: "media-length",
                                hpack: "end",
                                label: player.bind("length").transform(lengthStr),
                                visible: player.bind("length").transform(l => l > 0),
                            }),
                        }),
                    ],
                }),
            ],
        })
    }
    return Widget.Box({});
}

export function Media() {
    return Widget.Window({
        className: "media-window",
        name: "media",
        anchor: ["top"],
        exclusivity: "normal",
        margins: [10, 0, 0, 0],
        layer: "top",
        visible: false,
        child: Widget.Box({
            className: "medias",
            spacing: 8,
            visible: players.as(p => p.length > 0),
            children: players.as(p => p.map(Player)),
        }),
    })
}