export function Cpu() {

    const percentage = Widget.Label({
        class_name: "cpu-text",
        label: "0%",
    })

    Utils.interval(10000, () => {
        Utils.subprocess(
            ['bash', '-c', '~/.config/ags/modules/bar/scripts/cpuUsage.sh'],
            (output) => percentage.label = `${Math.round(parseFloat(output))}%`,
            (err) => console.log(err)
        )
    })

    const icon = Widget.Label({
        class_name: "cpu-icon",
        label: "",
    })

    return Widget.Box({
        class_name: "cpu",
        spacing: 8,
        children: [percentage, icon],
    })
}