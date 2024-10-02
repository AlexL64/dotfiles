export function Date() {
    const date = Variable("", {
        poll: [1000, 'date +"%A, %d. %b  %H:%M"'],
    })

    return Widget.Label({
        class_name: "date",
        label: date.bind(),
    })
}