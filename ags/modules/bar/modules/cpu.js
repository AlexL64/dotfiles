export function Cpu() {

    const percentage = Widget.Label({
        class_name: "cpu-text",
        label: "0%",
    })

    Utils.interval(10000, () => {
        Utils.subprocess(
            ['bash', '-c', `top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk '{print 100 - $1"%"}'`],
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