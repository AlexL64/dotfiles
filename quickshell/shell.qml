import QtQuick
import Quickshell
import qs.Bar
import qs.Bar.Menus
import qs.Windows

Scope {
    id: root

    // Bar
    Bar {}

    // Bar Menus
    Power {}

    // Windows
    ApplicationLauncher {}
    PowerSelector {}
    Wallpapers {}
    Clipboard {}
}
