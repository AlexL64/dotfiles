pragma Singleton
import Quickshell
import Quickshell.Io
import QtQuick

Singleton {
    id: root

    // Bar properties
    property bool barVisible: true

    // Menus properties
    property bool powerVisible: false
    property bool trayVisible: false
    property bool batteryVisible: false
    property bool networkVisible: false
    property bool bluetoothVisible: false
    property bool notificationsPanelVisible: false
    property bool audioVisible: false
    property int audioMenu: 0

    // Windows properties
    property bool applicationLauncherVisible: false
    property bool powerSelectorVisible: false
    property bool wallpapersVisible: false
    property bool clipboardVisible: false
    property bool screenshotVisible: false

    // Other properties
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

        if (exception != "network") {
            root.networkVisible = false;
        }

        if (exception != "bluetooth") {
            root.bluetoothVisible = false;
        }

        if (exception != "notificationsPanel") {
            root.notificationsPanelVisible = false;
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

        if (exception != "screenshot") {
            root.screenshotVisible = false;
        }
    }

    // Bar ipc handlers
    IpcHandler {
        target: "bar"

        function toggle(): void {
            root.barVisible = !root.barVisible;

            if (!root.barVisible) {
                root.hideMenus();
            }
        }
    }

    // Menus upc handelers
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
        target: "notificationsPanel"

        function toggle(): void {
            root.notificationsPanelVisible = !root.notificationsPanelVisible;

            if (root.notificationsPanelVisible) {
                root.hideMenus("notificationsPanel");
            }
        }

        function hide(): void {
            root.notificationsPanelVisible = false;
        }
    }

    IpcHandler {
        target: "network"

        function toggle(): void {
            root.networkVisible = !root.networkVisible;

            if (root.networkVisible) {
                root.hideMenus("network");
            }
        }

        function hide(): void {
            root.networkVisible = false;
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

    // Windows ipc handelers
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
        target: "screenshot"

        function toggle(): void {
            root.screenshotVisible = !root.screenshotVisible;

            if (root.screenshotVisible) {
                root.hideWindows("screenshot");
            }
        }

        function hide(): void {
            root.screenshotVisible = false;
        }
    }

    // Others ipc handelers
    IpcHandler {
        target: "idleInhibitor"

        function toggle(): void {
            root.idleInhibitorVisible = !root.idleInhibitorVisible;
        }
    }
}
