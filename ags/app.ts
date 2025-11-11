import App from "ags/gtk4/app"
import style from "./style.scss"
import Bar from "./widget/bar/Bar"
import { monitorFile } from "ags/file"

App.start({
    css: style,
    main() {
        // Bar
        App.get_monitors().map(Bar);
    },
})
