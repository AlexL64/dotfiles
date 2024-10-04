export function Notifications() {

    var response;

    const number = Widget.Label({
        class_name: "notifications-number",
        label: "",
    })

    Utils.subprocess(
        ['bash', '-c', 'swaync-client -swb'],
        (output) => {
            response = JSON.parse(output);
            number.label = response.text;
            icon.label = response.class.includes("dnd") || response.class[0].includes("dnd") ? "󰂛" : "󰂚";
        },
        (err) => console.log(err)
    )

    const icon = Widget.Label({
        class_name: "notifications-icon",
        label: "󰂚",
    })

    return Widget.Button({
        class_name: "notifications",
        onClicked: () => Utils.execAsync("swaync-client -t -sw"),
        onSecondaryClick: () => Utils.execAsync("swaync-client -d -sw"),
        child: Widget.Box({
            spacing: 1,
            children: [icon, number]
        }),
    })
}