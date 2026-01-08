import Quickshell
import Quickshell.Wayland
import QtQuick
import qs.Services

PanelWindow { // qmllint disable uncreatable-type
    id: idleInhibitor
    visible: PanelStateService.idleInhibitorVisible
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
