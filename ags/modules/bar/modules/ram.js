export function Ram() {

    const percentage = Widget.Label({
        class_name: "ram-text",
        label: "0%",
    })

    Utils.interval(30000, () => {
        Utils.subprocess(
            ['bash', '-c', `free -m | grep "Mem" | awk '{print ($3*100)/$2}'`],
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