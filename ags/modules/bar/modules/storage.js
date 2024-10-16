export function Storage() {

    const percentage = Widget.Label({
        class_name: "storage-text",
        label: "0%",
    })

    Utils.interval(300000, () => {
        Utils.subprocess(
            ['bash', '-c', `df | grep '.* /$' | awk '{print $5}'`],
            (output) => percentage.label = output,
            (err) => console.log(err)
        )
    })

    const icon = Widget.Label({
        class_name: "storage-icon",
        label: "󰋊",
    })

    return Widget.Box({
        class_name: "storage",
        spacing: 8,
        children: [percentage, icon],
    })
}