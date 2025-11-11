import App from "ags/gtk4/app"
import Astal from "gi://Astal?version=4.0"
import Gtk from "gi://Gtk?version=4.0"
import Gdk from "gi://Gdk?version=4.0"
import Workspaces from "./modules/Workspaces";
// import Audio from "./modules/audio";
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
            <box $type="start">
                <Workspaces />
                {/* <Audio />
                <Privacy /> */}
            </box>
            <box $type="center">
                {/* <Mpris />
                <Date /> */}
            </box>
            <box $type="end">
                {/* <Notifications />
                <SysInfos />
                <SystemPanel /> */}
            </box>
        </centerbox>
    </window>
}