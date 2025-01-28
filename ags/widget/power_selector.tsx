import { bind, execAsync, Variable } from "astal";
import { App, Astal, Gdk } from "astal/gtk3";

export default function PowerSelector() {

    const selected = Variable(0);

    return <window
        name={"power_selector"}
        exclusivity={Astal.Exclusivity.NORMAL}
        layer={Astal.Layer.OVERLAY}
        keymode={Astal.Keymode.EXCLUSIVE}
        application={App}
        visible={false}
        setup={(self) => {
            self.hook(bind(self, "visible"), (_, v) => {
                if (!v) {
                    selected.set(0);
                }
            })
        }}
        onKeyPressEvent={(self, event: Gdk.Event) => {
            switch (event.get_keyval()[1]) {
                case Gdk.KEY_Left:
                    if (selected.get() - 1 < 0) {
                        selected.set(4);
                    } else {
                        selected.set(selected.get() - 1);
                    }
                    break;
                case Gdk.KEY_Right:
                    if (selected.get() + 1 > 4) {
                        selected.set(0);
                    } else {
                        selected.set(selected.get() + 1);
                    }
                    break;
                case Gdk.KEY_Return:
                    self.hide();
                    switch (selected.get()) {
                        case 0:
                            execAsync("hyprlock");
                            break;
                        case 1:
                            execAsync("systemctl suspend");
                            break;
                        case 2:
                            execAsync("hyprctl dispatch exit");
                            break;
                        case 3:
                            execAsync("reboot");
                            break;
                        case 4:
                            execAsync("shutdown now");
                            break;
                    }
                case Gdk.KEY_Escape:
                    self.hide();
            }
        }}>
        <box className={"power_selector"} spacing={10}>
            <eventbox>
                <box
                    vertical
                    className={"lock"}
                    setup={(self) => {
                        const id = 0;

                        self.toggleClassName("selected", selected.get() == id);

                        self.hook(selected, (_, s) => {
                            self.toggleClassName("selected", s == id);
                        })
                    }}>
                    <label className={"icon"} label={""} expand />
                    <label className={"label"} label={"Lock"} expand />
                </box>
            </eventbox>
            <eventbox>
                <box
                    vertical
                    className={"sleep"}
                    setup={(self) => {
                        const id = 1;

                        self.toggleClassName("selected", selected.get() == id);

                        self.hook(selected, (_, s) => {
                            self.toggleClassName("selected", s == id);
                        })
                    }}>
                    <label className={"icon"} label={""} expand />
                    <label className={"label"} label={"Sleep"} expand />
                </box>
            </eventbox>
            <eventbox>
                <box
                    vertical
                    className={"logout"}
                    setup={(self) => {
                        const id = 2;

                        self.toggleClassName("selected", selected.get() == id);

                        self.hook(selected, (_, s) => {
                            self.toggleClassName("selected", s == id);
                        })
                    }}>
                    <label className={"icon"} label={""} expand />
                    <label className={"label"} label={"Logout"} expand />
                </box>
            </eventbox>
            <eventbox>
                <box
                    vertical
                    className={"reboot"}
                    setup={(self) => {
                        const id = 3;

                        self.toggleClassName("selected", selected.get() == id);

                        self.hook(selected, (_, s) => {
                            self.toggleClassName("selected", s == id);
                        })
                    }}>
                    <label className={"icon"} label={""} expand />
                    <label className={"label"} label={"Reboot"} expand />
                </box>
            </eventbox>
            <eventbox>
                <box
                    vertical
                    className={"shutdown"}
                    setup={(self) => {
                        const id = 4;

                        self.toggleClassName("selected", selected.get() == id);

                        self.hook(selected, (_, s) => {
                            self.toggleClassName("selected", s == id);
                        })
                    }}>
                    <label className={"icon"} label={""} expand />
                    <label className={"label"} label={"Shutdown"} expand />
                </box>
            </eventbox>
        </box>
    </window>
}