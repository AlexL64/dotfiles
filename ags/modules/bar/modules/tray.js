const systemtray = await Service.import('systemtray')



export function Tray() {
    
    const SysTrayItem = item => Widget.EventBox({
        class_name: "tray-item",
        child: Widget.Icon({size: 16}).bind('icon', item, 'icon'),
        tooltipMarkup: item.bind('tooltip_markup'),
        onPrimaryClick: (_, event) => item.activate(event),
        onSecondaryClick: (_, event) => item.openMenu(event),
    });

    return Widget.Box({
        class_name: "tray",
        children: systemtray.bind('items').as(i => i.map(SysTrayItem)),
        spacing: 8,
    })
}