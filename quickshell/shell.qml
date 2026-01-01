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

    property bool applicationLauncherVisible: false
    property bool powerSelectorVisible: false
    property bool wallpapersVisible: false
    property bool clipboardVisible: false

    // Bar
    Bar {
        visible: root.barVisible
    }

    // Bar Menus
    Power {
        visible: root.powerVisible
    }
    Tray {
        visible: root.trayVisible
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
        }

        function hide(): void {
            root.powerVisible = false;
        }
    }

    IpcHandler {
        target: "tray"

        function toggle(): void {
            root.trayVisible = !root.trayVisible;
        }

        function hide(): void {
            root.trayVisible = false;
        }
    }

    IpcHandler {
        target: "applicationLauncher"

        function toggle(): void {
            root.applicationLauncherVisible = !root.applicationLauncherVisible;
        }

        function hide(): void {
            root.applicationLauncherVisible = false;
        }
    }

    IpcHandler {
        target: "powerSelector"

        function toggle(): void {
            root.powerSelectorVisible = !root.powerSelectorVisible;
        }

        function hide(): void {
            root.powerSelectorVisible = false;
        }
    }

    IpcHandler {
        target: "wallpapers"

        function toggle(): void {
            root.wallpapersVisible = !root.wallpapersVisible;
        }

        function hide(): void {
            root.wallpapersVisible = false;
        }
    }

    IpcHandler {
        target: "clipboard"

        function toggle(): void {
            root.clipboardVisible = !root.clipboardVisible;
        }

        function hide(): void {
            root.clipboardVisible = false;
        }
    }
}
