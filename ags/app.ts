import { App } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widget/bar/bar"
import Media from "./widget/bar/windows/media"
import Calendar from "./widget/bar/windows/calendar"
import Power from "./widget/bar/windows/power"
import AudioMenu from "./widget/bar/windows/audio_menu"

App.start({
    css: style,
    main() {
        App.get_monitors().map(Bar);
        AudioMenu();
        Media();
        Calendar();
        Power();
    },
})

App.connect("window-toggled", (_, window) => {
    if (window.name.includes("bar") && !window.visible) {
        App.get_windows().forEach((w) => {
            w.hide()
        })
    } else if (window.visible) {
        App.get_windows().forEach((w) => {
            if (!w.name.includes("bar") && !(w.name == window.name)) {
                w.visible ? w.hide() : null;
            }
        })
    }
})
