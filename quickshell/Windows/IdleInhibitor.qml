import Quickshell
import Quickshell.Wayland
import QtQuick

PanelWindow { // qmllint disable uncreatable-type
    id: idleInhibitor

    exclusionMode: ExclusionMode.Ignore
    focusable: false
    implicitHeight: 0
    implicitWidth: 0

    anchors {
        top: true
        left: true
    }

    IdleInhibitor {
        enabled: idleInhibitor.visible
        window: idleInhibitor
    }
}
