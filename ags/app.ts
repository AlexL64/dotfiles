import { App } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widget/bar/bar"
import Media from "./widget/bar/windows/media"
import Calendar from "./widget/bar/windows/calendar"
import Power from "./widget/bar/windows/power"
import AudioMenu from "./widget/bar/windows/audio_menu"
import Toast from "./widget/toast"
import Clipboard from "./widget/clipboard"
import Idle from "./widget/idle"
import AppLauncher from "./widget/app_launcher"
import Tray from "./widget/bar/windows/tray"
import Bluetooth from "./widget/bar/windows/bluetooth"

App.start({
    css: style,
    main() {

        // Idle
        Idle();

        // Bar
        App.get_monitors().map(Bar);

        // Bar Menus
        AudioMenu();
        Media();
        Calendar();
        Power();
        Bluetooth();
        Tray();

        // Toast
        Toast();

        // Menus
        Clipboard();
        AppLauncher();

    },
})

App.connect("window-toggled", (_, window) => {
    const blacklist = ["bar", "toast", "clipboard", "idle", "app_launcher"];
    const exceptions = ["toast", "clipboard", "idle", "app_launcher"];

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
