import Quickshell
import QtQuick
import QtQuick.Layouts
import qs.Bar.Modules

PanelWindow { // qmllint disable uncreatable-type
    id: bar
    visible: true
    aboveWindows: true
    color: "transparent"
    exclusionMode: ExclusionMode.Auto
    implicitHeight: 36

    // qmllint disable unresolved-type unqualified missing-property
    margins {
        top: 10
        left: 10
        right: 10
    }
    // qmllint enable unresolved-type unqualified missing-property

    anchors {
        top: true
        left: true
        right: true
    }

    RowLayout {
        height: parent.height
        anchors.left: parent.left
        spacing: 10

        Workspaces {
            startNumber: 1
        }

        Audio {}
    }

    RowLayout {
        height: parent.height
        anchors.horizontalCenter: parent.horizontalCenter
        spacing: 10

        Playing {}
        TimeDate {}
    }

    RowLayout {
        height: parent.height
        anchors.right: parent.right
        spacing: 10

        SystemInfos {}
        SystemPanel {}
    }
}
