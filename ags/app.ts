import { App } from "astal/gtk3";
import style from "./style.scss";
import Bar from "./widget/bar/bar";
import Media from "./widget/bar/windows/media";
import Calendar from "./widget/bar/windows/calendar";
import Battery from "./widget/bar/windows/battery";
import AudioMenu from "./widget/bar/windows/audio_menu";
import Toast from "./widget/toast";
import Clipboard from "./widget/clipboard";
import Idle from "./widget/idle";
import AppLauncher from "./widget/app_launcher";
import Tray from "./widget/bar/windows/tray";
import Bluetooth from "./widget/bar/windows/bluetooth";
import Keybinds from "./widget/keybinds";
import Power from "./widget/bar/windows/power";
import Storage from "./widget/bar/windows/storage";
import Memory from "./widget/bar/windows/memory";
import Brightness from "./widget/bar/windows/brightness";
import PowerSelector from "./widget/power_selector";
import Screenshot from "./widget/screenshot";

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
        Memory();
        Storage();
        Brightness();
        Battery();
        Bluetooth();
        Tray();
        Power();

        // Toast
        Toast();

        // Menus
        Clipboard();
        AppLauncher();
        Keybinds();
        PowerSelector();
        Screenshot();
    },
})

App.connect("window-toggled", (_, window) => {
    const blacklist = ["bar", "toast", "clipboard", "idle", "app_launcher", "power_selector"];
    const exceptions = ["toast", "clipboard", "idle", "app_launcher", "power_selector"];

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
