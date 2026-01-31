pragma ComponentBehavior: Bound
import Quickshell
import Quickshell.Wayland
import QtQuick
import QtQuick.Layouts
import qs.Services

PanelWindow { //qmllint disable uncreatable-type
    id: powerSelector
    visible: PanelStateService.powerSelectorVisible
    aboveWindows: true
    color: "transparent"
    exclusionMode: ExclusionMode.Ignore
    focusable: true
    implicitHeight: content.height + 20
    implicitWidth: content.width + 20
    WlrLayershell.keyboardFocus: WlrKeyboardFocus.Exclusive

    onVisibleChanged: {
        selected = 0;
    }

    property int selected: 0

    property list<var> options: [
        {
            "icon": "",
            "mainColor": "#89b4fa",
            "backgroundColor": "#1189b4fa",
            "command": "hyprlock"
        },
        {
            "icon": "",
            "mainColor": "#cba6f7",
            "backgroundColor": "#11cba6f7",
            "command": "systemctl suspend"
        },
        {
            "icon": "",
            "mainColor": "#fab387",
            "backgroundColor": "#11fab387",
            "command": "hyprctl dispatch exit"
        },
        {
            "icon": "",
            "mainColor": "#a6e3a1",
            "backgroundColor": "#11a6e3a1",
            "command": "reboot"
        },
        {
            "icon": "",
            "mainColor": "#f38ba8",
            "backgroundColor": "#11a6e3a1",
            "command": "shutdown now"
        }
    ]

    Rectangle {
        border.color: "#cba6f7"
        border.width: 2
        color: "#1e1e2e"
        height: content.height + 20
        width: content.width + 20
        radius: 12
        anchors.centerIn: parent
        focus: true

        Keys.onPressed: event => {
            if (event.key == Qt.Key_Escape) {
                PanelStateService.powerSelectorVisible = false;
            } else if (event.key == Qt.Key_Right) {
                if (powerSelector.selected < powerSelector.options.length - 1) {
                    powerSelector.selected += 1;
                } else {
                    powerSelector.selected = 0;
                }
            } else if (event.key == Qt.Key_Left) {
                if (powerSelector.selected > 0) {
                    powerSelector.selected -= 1;
                } else {
                    powerSelector.selected = powerSelector.options.length - 1;
                }
            } else if (event.key == Qt.Key_Return) {
                Quickshell.execDetached(["bash", "-c", powerSelector.options[powerSelector.selected].command]);
                PanelStateService.powerSelectorVisible = false;
            }
        }

        RowLayout {
            id: content
            spacing: 10
            anchors.centerIn: parent

            Repeater {
                model: powerSelector.options
                delegate: Rectangle {
                    id: delegateItem

                    required property int index
                    required property var modelData

                    color: "#313244"
                    radius: 12
                    border.color: "#6c7086"
                    border.width: 2
                    implicitHeight: 228
                    implicitWidth: 228

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        hoverEnabled: true

                        onEntered: {
                            delegateItem.color = "#45475a";
                        }

                        onExited: {
                            delegateItem.color = "#313244";
                        }

                        onDoubleClicked: {
                            Quickshell.execDetached(["bash", "-c", delegateItem.modelData.command]);
                            PanelStateService.powerSelectorVisible = false;
                        }
                    }

                    Text {
                        text: delegateItem.modelData.icon
                        color: delegateItem.modelData.mainColor
                        font.pixelSize: 96
                        font.family: "Font Awesome 7 Free"
                        anchors.centerIn: parent
                    }
                }
            }
        }

        Rectangle {
            color: powerSelector.options[powerSelector.selected].backgroundColor
            radius: 12
            border.color: powerSelector.options[powerSelector.selected].mainColor
            border.width: 2
            implicitHeight: 228
            implicitWidth: 228
            anchors.verticalCenter: parent.verticalCenter
            x: (powerSelector.selected * 228) + ((powerSelector.selected + 1) * 10)

            Behavior on x {
                NumberAnimation {
                    duration: 50
                    easing.type: Easing.InOutQuad
                }
            }

            Behavior on color {
                ColorAnimation {
                    duration: 50
                }
            }

            Behavior on border.color {
                ColorAnimation {
                    duration: 50
                }
            }
        }
    }
}
