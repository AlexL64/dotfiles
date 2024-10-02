import Gtk from 'gi://Gtk?version=3.0'

function Settings(){
    const RegularWindow = Widget.subclass(Gtk.Window)

    const settings = Widget.Box({
        vertical: true,
        marginLeft: 0,
        children: [
            Widget.Label({
                label: 'Power',
            }),
            Widget.Label({
                label: 'Audio',
            }),
            Widget.Label({
                label: 'Network',
            }),
            Widget.Label({
                label: 'About',
            }),
        ]
    })
    
    
    return RegularWindow({
        name: `settings`,
        child: settings
    })
}


App.config({
    // style: "./style.css",
    windows: [
        Settings(),
    ],
})
