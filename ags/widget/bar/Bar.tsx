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
// import Date from "./modules/date";
// import Mpris from "./modules/mpris";
// import SysInfos from "./modules/sysinfos";
// import Notifications from "./modules/notifications";
// import Privacy from "./modules/privacy_indicator";
// import SystemPanel from "./modules/system_panel";

export default function Bar(gdkmonitor: Gdk.Monitor, monitor = 0) {
    return <window
        name={`bar-${monitor}`}
        class={'bar'}
        gdkmonitor={gdkmonitor}
        heightRequest={36}
        marginLeft={10}
        marginTop={10}
        marginRight={10}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        application={App}
        visible>
        <centerbox>
            <box $type="start" spacing={10}>
                <Workspaces />
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
}