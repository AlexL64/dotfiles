import App from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./widget/bar/Bar"
import { monitorFile } from "ags/file"
import { exec } from "ags/process"
import AppLauncher from "./widget/AppLauncher"
import Clipboard from "./widget/Clipboard"
import Toast from "./widget/Toast"
import PowerSelector from "./widget/PowerSelector"
import Screenshot from "./widget/Screenshot"
import Keybinds from "./widget/Keybinds"
import AudioMenu from "./widget/bar/windows/AudioMenu"
import Calendar from "./widget/bar/windows/Calendar"
import Media from "./widget/bar/windows/Media"

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

        // Bar
        App.apply_css(style);
        App.get_monitors().map(Bar);

        // Toast
        Toast();

        // Bar Menus
        AudioMenu();
        Media();
        Calendar();

        // Menus
        Clipboard();
        AppLauncher();
        Keybinds();
        PowerSelector();
        Screenshot();
    },
})
