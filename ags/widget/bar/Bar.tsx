import App from "ags/gtk4/app"
import { Astal, Gdk } from "ags/gtk4";
import Workspaces from "./modules/Workspaces";
import Audio from "./modules/Audio";
import Privacy from "./modules/PrivacyIndicator";
import Mpris from "./modules/Mpris";
import Date from "./modules/Date";
import Notifications from "./modules/Notification";
import SysInfos from "./modules/SysInfos";
import SystemPanel from "./modules/SystemPanel";
import { createBinding, For, onCleanup, This } from "ags";

export default function Bars() {
    const monitors = createBinding(App, "monitors");

    return <For each={monitors}>
        {(monitor, index) => {

            if (index.get() == 0) {
                return <This this={App}>
                    <window
                        name={`Bar-${monitor.connector}`}
                        class={'bar'}
                        gdkmonitor={monitor}
                        heightRequest={36}
                        marginLeft={10}
                        marginTop={10}
                        marginRight={10}
                        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
                        exclusivity={Astal.Exclusivity.EXCLUSIVE}
                        application={App}
                        visible
                        $={(self) => onCleanup(() => self.destroy())}>
                        <centerbox>
                            <box $type="start" spacing={10}>
                                {
                                    Workspaces(index.get())
                                }
                                <Audio />
                                <Privacy />
                            </box>
                            <box $type="center" spacing={10}>
                                <Mpris />
                                <Date />
                            </box>
                            <box $type="end" spacing={10}>
                                <Notifications />
                                <SysInfos />
                                <SystemPanel />
                            </box>
                        </centerbox>
                    </window>
                </This>
            } else {
                return <window
                    name={`Bar-${monitor.connector}`}
                    class={'bar'}
                    gdkmonitor={monitor}
                    heightRequest={36}
                    marginLeft={10}
                    marginTop={10}
                    marginRight={10}
                    anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
                    exclusivity={Astal.Exclusivity.EXCLUSIVE}
                    application={App}
                    visible
                    $={(self) => onCleanup(() => self.destroy())}>
                    <centerbox>
                        <box $type="center" spacing={10}>
                            {
                                Workspaces(index.get())
                            }
                            <Date />
                        </box>
                    </centerbox>
                </window>
            }
        }}
    </For>
}