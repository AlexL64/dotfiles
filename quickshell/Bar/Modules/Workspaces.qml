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
                    color: textColor(delegateItem.modelData, Hyprland.workspaces)

                    function textColor(id, workspaces) {
                        const workspace = workspaces.values.find(item => item.id == id);
                        const isUrgent = workspace && workspace.urgent;
                        const hasClients = workspace && workspace.toplevels.values.length > 0;

                        if (isUrgent) {
                            return "#313244";
                        }

                        return hasClients ? "#cba6f7" : "#cdd6f4";
                    }
                }

                background: Rectangle {
                    radius: 12
                    color: backgroundColor(delegateItem.modelData, Hyprland.workspaces, mouseArea.containsMouse)

                    function backgroundColor(id, workspaces, containsMouse) {
                        const workspace = workspaces.values.find(item => item.id == id);
                        const isUrgent = workspace && workspace.urgent;

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

    Button {
        implicitHeight: 36
        implicitWidth: 36
        x: getX(Hyprland.focusedWorkspace.id, workspaces.startNumber)
        visible: getVisible(Hyprland.focusedWorkspace.id, workspaces.startNumber)

        function getX(id, startNumber) {
            const position = id - startNumber;

            if (position < 0) {
                return 0;
            } else {
                var x = position * 36;

                if (x > 288) {
                    return 288;
                } else {
                    return x;
                }
            }
        }

        function getVisible(id, startNumber) {
            const position = id - startNumber;

            if (position < 0 || id > workspaces.startNumber + 8) {
                return false;
            } else {
                return true;
            }
        }

        Behavior on x {
            NumberAnimation {
                duration: 100
                easing.type: Easing.InOutQuad
            }
        }

        contentItem: Text {
            text: Hyprland.focusedWorkspace.id
            color: Hyprland.focusedWorkspace.toplevels.values.length > 0 ? "#313244" : "#cdd6f4"
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            font.family: "JetBrainsMono Nerd Font"
            font.pixelSize: 14
            font.bold: true
        }

        background: Rectangle {
            radius: 12
            color: "#cba6f7"
        }
    }
}
