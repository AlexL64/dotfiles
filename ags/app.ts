import App from "ags/gtk4/app";
import style from "./style.scss";
import { monitorFile } from "ags/file";
import { exec } from "ags/process";
import { createBinding } from "ags";
import Bars from "./widget/bar/Bar";
import AppLauncher from "./widget/AppLauncher";
import Clipboard from "./widget/Clipboard";
import Toast from "./widget/Toast";
import PowerSelector from "./widget/PowerSelector";
import Screenshot from "./widget/Screenshot";
import Keybinds from "./widget/Keybinds";
import AudioMenu from "./widget/bar/windows/AudioMenu";
import Calendar from "./widget/bar/windows/Calendar";
import Media from "./widget/bar/windows/Media";
import Power from "./widget/bar/windows/Power";
import Tray from "./widget/bar/windows/Tray";
import Bluetooth from "./widget/bar/windows/Bluetooth";
import Battery from "./widget/bar/windows/Battery";
import Idle from "./widget/Idle";
import Brightness from "./widget/bar/windows/Brightness";
import Storage from "./widget/bar/windows/Storage";
import Memory from "./widget/bar/windows/Memory";
import Network from "./widget/bar/windows/Network";
import Monitors from "./widget/Monitor";
import Wallpapers from "./widget/Wallpapers";
import Notifications from "./widget/Notifications";
import NotificationsPanel from "./widget/bar/windows/NotificationsPanel";

monitorFile(
    "./style.scss",
    () => {
        exec("sass ./style.scss /tmp/style.css");
        App.reset_css();
        App.apply_css("/tmp/style.css");
    }
)

App.start({
    css: style,
    main() {

        // Idle
        Idle();

        // Bar
        Bars();

        // Bar Menus
        AudioMenu();
        Media();
        Calendar();
        Memory();
        Storage();
        Brightness();
        Battery();
        NotificationsPanel();
        Network();
        Bluetooth();
        Tray();
        Power();

        // Windows
        Clipboard();
        AppLauncher();
        Keybinds();
        PowerSelector();
        Screenshot();
        Monitors();
        Wallpapers();

        // Notifications
        Notifications();

        // Toast
        Toast();
    },
})

App.connect("window-toggled", (_, window) => {
    const exceptions = ["Bar", "Toast", "Clipboard", "Idle", "AppLauncher", "PowerSelector", "Monitors", "Wallpapers", "Notifications"];

    if (exceptions.some(e => window.name.includes(e)) && !window.visible) {
        window.hide();

        if (window.name.includes("Bar")) {
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

            if (!exceptions.some(e => w.name.includes(e)) && w.name !== window.name) {
                w.visible ? w.hide() : null;
            }
        });
    }
});
