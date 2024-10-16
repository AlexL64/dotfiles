const time = Variable("", {
    poll: [1000, 'date +"%H:%M"'],
})

const date = Variable("", {
    poll: [60000, 'date +"%B %d, %Y"'],
})

const uptime = Variable("", {
    poll: [60000, `bash -c "uptime | awk '{print $3}' | tr ',' ' '"`],
})

export function Calendar() {
    return Widget.Window({
        name: "calendar",
        className: "calendar-window",
        anchor: ["top"],
        exclusivity: "normal",
        margins: [10, 0, 0, 0],
        layer: "top",
        visible: false,
        widthRequest: 300,
        child: Widget.Box({
            className: "calendar-box",
            vertical: true,
            children: [
                Widget.Label({
                    className: "calendar-time",
                    label: time.bind(),
                }),
                Widget.Label({
                    className: "calendar-date",
                    label: date.bind(),
                }),
                Widget.CenterBox({
                    className: "calendar-uptime",
                    centerWidget: Widget.Box({
                        children: [
                            Widget.Label({
                                label: "uptime: ",
                            }),
                            Widget.Label({
                                label: uptime.bind(),
                            }),
                        ],
                    })
                }),
                Widget.Box({
                    className: "calendar-outer",
                    child: Widget.Calendar({
                        className: "calendar",
                        expand: true,
                        showDayNames: true,
                        showDetails: false,
                        showHeading: true,
                        showWeekNumbers: true,
                    }),
                }),
            ]
        }),

    })
}