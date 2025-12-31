import Quickshell.Hyprland
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls

Rectangle {
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
                        const workspace = workspaces.values.find(item => item.id == id);
                        const isFocused = focusedWorkspace && focusedWorkspace.id == id;
                        const isUrgent = workspace && workspace.urgent;
                        const hasClients = focusedWorkspace && focusedWorkspace.toplevels.values.length > 0;

                        if (isFocused) {
                            return hasClients ? "#313244" : "#cdd6f4";
                        }

                        if (isUrgent) {
                            return "#313244";
                        }

                        return workspace ? "#cba6f7" : "#cdd6f4";
                    }
                }

                background: Rectangle {
                    property var workspacesTest: Hyprland.workspaces
                    radius: 12
                    color: backgroundColor(delegateItem.modelData, Hyprland.workspaces, Hyprland.focusedWorkspace, mouseArea.containsMouse)

                    function backgroundColor(id, workspaces, focusedWorkspace, containsMouse) {
                        const workspace = workspaces.values.find(item => item.id == id);
                        const isFocused = focusedWorkspace && focusedWorkspace.id == id;
                        const isUrgent = workspace && workspace.urgent;

                        if (isFocused) {
                            return containsMouse ? "#cccba6f7" : "#cba6f7";
                        }

                        if (isUrgent) {
                            return containsMouse ? "#ccf38ba8" : "#f38ba8";
                        }

                        if (containsMouse) {
                            return workspace ? "#33cba6f7" : "#33cdd6f4";
                        }

                        return "#313244";
                    }
                }

                MouseArea {
                    id: mouseArea
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
