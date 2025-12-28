import Quickshell.Widgets
import Quickshell.Hyprland
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls

ClippingRectangle {
    id: workspaces

    property int startNumber: 1
    property list<int> list: Array.from({
        length: 9
    }, (_, i) => i + startNumber)

    Layout.fillHeight: true
    radius: 12
    color: "#313244"
    implicitWidth: 324

    RowLayout {
        spacing: 0
        Repeater {
            model: workspaces.list
            delegate: Button {
                id: delegateItem
                required property int modelData

                implicitHeight: 36
                implicitWidth: 36

                contentItem: Text {
                    text: delegateItem.modelData
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 14
                    font.bold: true
                    color: textColor(delegateItem.modelData, Hyprland.workspaces, Hyprland.focusedWorkspace)

                    function textColor(id, workspaces, focusedWorkspace) {
                        if (focusedWorkspace.id == id) {
                            if (focusedWorkspace.toplevels.values.length > 0) {
                                return "#313244";
                            } else {
                                return "#cdd6f4";
                            }
                        } else if (workspaces.values.some(item => item.id == id)) {
                            return "#cba6f7";
                        }

                        return "#cdd6f4";
                    }
                }

                background: Rectangle {
                    property var workspacesTest: Hyprland.workspaces
                    radius: 12
                    color: backgroundColor(delegateItem.modelData, Hyprland.workspaces, Hyprland.focusedWorkspace)

                    function backgroundColor(id, workspaces, focusedWorkspace) {
                        if (focusedWorkspace.id == id) {
                            return "#cba6f7";
                        } else if (workspaces.values.some(item => item.id == id && item.urgent)) {
                            return "#f38ba8";
                        }

                        return "#313244";
                    }
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    hoverEnabled: true

                    onClicked: {
                        Hyprland.dispatch(`workspace ${delegateItem.modelData}`);
                    }
                }
            }
        }
    }
}
