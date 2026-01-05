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
    property bool audioVisible: false
    property int audioMenu: 0

    property bool applicationLauncherVisible: false
    property bool powerSelectorVisible: false
    property bool wallpapersVisible: false
    property bool clipboardVisible: false

    property bool idleInhibitorVisible: false

    function hideMenus(exception = "") {
        if (exception != "power") {
            root.powerVisible = false;
        }

        if (exception != "tray") {
            root.trayVisible = false;
        }

        if (exception != "battery") {
            root.batteryVisible = false;
        }

        if (exception != "bluetooth") {
            root.bluetoothVisible = false;
        }

        if (exception != "audio") {
            root.audioVisible = false;
        }
    }

    function hideWindows(exception = "") {
        if (exception != "applicationLauncher") {
            root.applicationLauncherVisible = false;
        }

        if (exception != "powerSelector") {
            root.powerSelectorVisible = false;
        }

        if (exception != "wallpapers") {
            root.wallpapersVisible = false;
        }

        if (exception != "clipboard") {
            root.clipboardVisible = false;
        }
    }

    // Bar
    Bar {
        visible: root.barVisible
        idleInhibitorVisible: root.idleInhibitorVisible
    }

    // Bar Menus
    Power {
        visible: root.powerVisible
    }
    Tray {
        visible: root.trayVisible
    }
    Bluetooth {
        visible: root.bluetoothVisible
    }
    Battery {
        visible: root.batteryVisible
        idleInhibitorVisible: root.idleInhibitorVisible
    }
    Audio {
        visible: root.audioVisible
        selected: root.audioMenu
    }

    // Windows
    ApplicationLauncher {
        visible: root.applicationLauncherVisible
    }
    PowerSelector {
        visible: root.powerSelectorVisible
    }
    Wallpapers {
        visible: root.wallpapersVisible
    }
    Clipboard {
        visible: root.clipboardVisible
    }

    // IdleInhibitor
    IdleInhibitor {
        visible: root.idleInhibitorVisible
    }

    IpcHandler {
        target: "bar"

        function toggle(): void {
            root.barVisible = !root.barVisible;
        }
    }

    IpcHandler {
        target: "power"

        function toggle(): void {
            root.powerVisible = !root.powerVisible;

            if (root.powerVisible) {
                root.hideMenus("power");
            }
        }

        function hide(): void {
            root.powerVisible = false;
        }
    }

    IpcHandler {
        target: "tray"

        function toggle(): void {
            root.trayVisible = !root.trayVisible;

            if (root.trayVisible) {
                root.hideMenus("tray");
            }
        }

        function hide(): void {
            root.trayVisible = false;
        }
    }

    IpcHandler {
        target: "bluetooth"

        function toggle(): void {
            root.bluetoothVisible = !root.bluetoothVisible;

            if (root.bluetoothVisible) {
                root.hideMenus("bluetooth");
            }
        }

        function hide(): void {
            root.bluetoothVisible = false;
        }
    }
    IpcHandler {
        target: "battery"

        function toggle(): void {
            root.batteryVisible = !root.batteryVisible;

            if (root.batteryVisible) {
                root.hideMenus("battery");
            }
        }

        function hide(): void {
            root.batteryVisible = false;
        }
    }
    IpcHandler {
        target: "audio"

        function toggle(): void {
            root.audioVisible = !root.audioVisible;

            if (root.audioVisible) {
                root.hideMenus("audio");
            }
        }

        function hide(): void {
            root.audioVisible = false;
        }

        function setMenuSinks() {
            root.audioMenu = 0;
        }

        function setMenuSources() {
            root.audioMenu = 1;
        }

        function setMenuApps() {
            root.audioMenu = 2;
        }

        function setMenuDevices() {
            root.audioMenu = 3;
        }
    }

    IpcHandler {
        target: "applicationLauncher"

        function toggle(): void {
            root.applicationLauncherVisible = !root.applicationLauncherVisible;

            if (root.applicationLauncherVisible) {
                root.hideWindows("applicationLauncher");
            }
        }

        function hide(): void {
            root.applicationLauncherVisible = false;
        }
    }

    IpcHandler {
        target: "powerSelector"

        function toggle(): void {
            root.powerSelectorVisible = !root.powerSelectorVisible;

            if (root.powerSelectorVisible) {
                root.hideWindows("powerSelector");
            }
        }

        function hide(): void {
            root.powerSelectorVisible = false;
        }
    }

    IpcHandler {
        target: "wallpapers"

        function toggle(): void {
            root.wallpapersVisible = !root.wallpapersVisible;

            if (root.wallpapersVisible) {
                root.hideWindows("wallpapers");
            }
        }

        function hide(): void {
            root.wallpapersVisible = false;
        }
    }

    IpcHandler {
        target: "clipboard"

        function toggle(): void {
            root.clipboardVisible = !root.clipboardVisible;

            if (root.clipboardVisible) {
                root.hideWindows("clipboard");
            }
        }

        function hide(): void {
            root.clipboardVisible = false;
        }
    }

    IpcHandler {
        target: "idleInhibitor"

        function toggle(): void {
            root.idleInhibitorVisible = !root.idleInhibitorVisible;
        }
    }
}
