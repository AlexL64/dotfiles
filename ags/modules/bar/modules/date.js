export function Date() {
    const date = Variable("", {
        poll: [1000, 'date +"%A, %d. %b  %H:%M"'],
    })

    return Widget.Button({
        class_name: "date",
        onPrimaryClick: () => {
            App.toggleWindow("calendar");
            App.windows.forEach(e => !e.name?.includes("bar") && !e.name?.includes("calendar") ? e.hide() : null);
        },
        child: Widget.Label({
            label: date.bind(),
        })
    })

}