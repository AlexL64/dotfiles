import { App } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widget/bar/bar"
import Media from "./widget/bar/windows/media"
import Calendar from "./widget/bar/windows/calendar"
import Power from "./widget/bar/windows/power"
import AudioMenu from "./widget/bar/windows/audio_menu"
import Toast from "./widget/toast"
import Clipboard from "./widget/clipboard"

App.start({
    css: style,
    main() {

        // Bar
        App.get_monitors().map(Bar);

        // Bar Menus
        AudioMenu();
        Media();
        Calendar();
        Power();

        // Toast
        Toast();

        // Menus
        Clipboard();
    },
})

App.connect("window-toggled", (_, window) => {
    const blacklist = ["bar", "toast", "clipboard"];
    const exceptions = ["toast", "clipboard"];

    if (blacklist.some(e => window.name.includes(e)) && !window.visible) {
        window.hide();

        if (window.name.includes("bar")) {
            App.get_windows().forEach((w) => {
                if (!exceptions.some(e => w.name.includes(e)) && w.name !== window.name) {
                    w.visible ? w.hide() : null;
                }
            });
        }
    } else if (window.visible) {
        App.get_windows().forEach((w) => {
            if (exceptions.some(e => window.name.includes(e))) {
                return;
            }

            if (!blacklist.some(e => w.name.includes(e)) && w.name !== window.name) {
                w.visible ? w.hide() : null;
            }
        });
    }
});
