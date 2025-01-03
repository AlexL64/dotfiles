import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import Workspaces from "./modules/workspaces";
import Audio from "./modules/audio";
import Tray from "./modules/tray";
import Date from "./modules/date";
import Mpris from "./modules/mpris";
import SysInfos from "./modules/sysinfos";
import Notifications from "./modules/notificatiosn";
import Privacy from "./modules/privacy_indicator";

export default function Bar(gdkmonitor: Gdk.Monitor, monitor = 0) {
    return <window
        name={`bar-${monitor}`}
        className={'bar'}
        gdkmonitor={gdkmonitor}
        heightRequest={36}
        marginLeft={10}
        marginTop={10}
        marginRight={10}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        application={App}>
        <centerbox>
            <box halign={Gtk.Align.START} spacing={10}
                children={
                    [
                        Workspaces(),
                        Audio(),
                        Privacy(),
                    ]
                }
            />
            <box
                halign={Gtk.Align.CENTER}
                spacing={10}
                children={
                    [
                        Mpris(),
                        Date(),
                    ]
                } />
            <box
                halign={Gtk.Align.END}
                spacing={10}
                children={
                    [
                        Notifications(),
                        SysInfos(),
                        Tray(),
                    ]
                } />
        </centerbox>
    </window>
}