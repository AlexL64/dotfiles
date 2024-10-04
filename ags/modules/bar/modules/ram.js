export function Ram() {

    const percentage = Widget.Label({
        class_name: "ram-text",
        label: "0%",
    })

    Utils.interval(30000, () => {
        Utils.subprocess(
            ['bash', '-c', '~/.config/ags/modules/bar/scripts/ramUsage.sh'],
            (output) => percentage.label = `${Math.round(parseFloat(output))}%`,
            (err) => console.log(err)
        )
    })

    const icon = Widget.Label({
        class_name: "ram-icon",
        label: "",
    })

    return Widget.Box({
        class_name: "ram",
        spacing: 8,
        children: [percentage, icon],
    })
}