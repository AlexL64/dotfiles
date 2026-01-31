//@ pragma UseQApplication
import Quickshell
import Quickshell.Io
import QtQuick
import qs.Bar
import qs.Bar.Menus
import qs.Windows

Scope {
    id: root

    property bool barVisible: true

    property bool powerVisible: false
    property bool trayVisible: false
    property bool batteryVisible: false
    property bool bluetoothVisible: false
    property bool notificationsPanelVisible: true
    property bool audioVisible: false
    property int audioMenu: 0

    property bool applicationLauncherVisible: false
    property bool powerSelectorVisible: false
    property bool wallpapersVisible: false
    property bool clipboardVisible: false

    property bool idleInhibitorVisible: false

    // Bar
    Bar {}

    // Bar Menus
    Power {}
    Tray {}
    Bluetooth {}
    NotificationsPanel {}
    Battery {}
    Audio {}

    // Windows
    ApplicationLauncher {}
    PowerSelector {}
    Wallpapers {}
    Clipboard {}
    Screenshot {}

    // Others
    IdleInhibitor {}
    Notifications {}
    OSD {}
}
