pragma ComponentBehavior: Bound
import Quickshell
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import qs.Services

PanelWindow { //qmllint disable uncreatable-type
    id: power
    visible: PanelStateService.powerVisible
    aboveWindows: true
    color: "transparent"
    exclusionMode: ExclusionMode.Auto
    implicitWidth: content.width + 20
    implicitHeight: content.height + 20

    // qmllint disable unresolved-type unqualified missing-property
    margins {
        top: 10
        right: 10
    }
    // qmllint enable unresolved-type unqualified missing-property

    anchors {
        top: true
        right: true
    }

    property list<var> options: [
        {
            "icon": "",
            "text": "Lock",
            "mainColor": "#89b4fa",
            "hoverColor": "#1189b4fa",
            "command": "hyprlock"
        },
        {
            "icon": "",
            "text": "Sleep",
            "mainColor": "#cba6f7",
            "hoverColor": "#11cba6f7",
            "command": "systemctl suspend"
        },
        {
            "icon": "",
            "text": "Logout",
            "mainColor": "#fab387",
            "hoverColor": "#11fab387",
            "command": "hyprshutdown -t 'Logging out...'"
        },
        {
            "icon": "",
            "text": "Reboot",
            "mainColor": "#a6e3a1",
            "hoverColor": "#11a6e3a1",
            "command": "hyprshutdown -t 'Rebooting...' -p 'reboot'"
        },
        {
            "icon": "",
            "text": "Shutdown",
            "mainColor": "#f38ba8",
            "hoverColor": "#11a6e3a1",
            "command": "hyprshutdown -t 'Shutting down...' -p 'shutdown now'"
        }
    ]

    Rectangle {
        color: "#1e1e2e"
        width: content.width + 20
        height: content.height + 20
        radius: 12
        border.width: 2
        border.color: "#cba6f7"

        ColumnLayout {
            id: content
            spacing: 6
            anchors.centerIn: parent

            Repeater {
                model: power.options
                delegate: Button {
                    id: delegateItem
                    Layout.minimumWidth: 150
                    Layout.fillWidth: true
                    padding: 6
                    leftPadding: 15

                    required property var modelData

                    contentItem: Row {
                        spacing: 10

                        Text {
                            text: delegateItem.modelData.icon
                            color: delegateItem.modelData.mainColor
                            font.pixelSize: 16
                            font.family: "Font Awesome 7 Free"
                        }

                        Text {
                            text: delegateItem.modelData.text
                            color: delegateItem.modelData.mainColor
                            font.pixelSize: 14
                            font.family: "JetBrainsMono Nerd Font"
                            font.bold: true
                        }
                    }

                    background: Rectangle {
                        color: "#313244"
                        radius: 6

                        Rectangle {
                            id: backgroundRectangle
                            width: parent.width
                            height: parent.height
                            color: "#313244"
                            radius: 6
                        }
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        hoverEnabled: true

                        onEntered: {
                            backgroundRectangle.color = delegateItem.modelData.hoverColor;
                        }

                        onExited: {
                            backgroundRectangle.color = "#313244";
                        }

                        onClicked: {
                            Quickshell.execDetached(["bash", "-c", delegateItem.modelData.command]);
                            PanelStateService.powerVisible = false;
                        }
                    }
                }
            }
        }
    }
}
