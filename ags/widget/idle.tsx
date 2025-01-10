import { App, Astal } from "astal/gtk3";

export default function Idle() {

    return <window
        name={"idle"}
        clickThrough
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
        exclusivity={Astal.Exclusivity.IGNORE}
        layer={Astal.Layer.BACKGROUND}
        application={App}
        visible
        inhibit
        setup={(self) => {
            self.visible = false;
        }} />
}