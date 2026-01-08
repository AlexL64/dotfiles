import Quickshell
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import qs.Services

Button {
    id: notifications
    Layout.fillHeight: true
    implicitWidth: 36

    contentItem: Text {
        text: getIcon(NotificationsService.dnd, NotificationsService.mergedNotifications.length)
        font.family: "Material Icons"
        font.pixelSize: 18
        color: getColor(NotificationsService.dnd, NotificationsService.mergedNotifications.length)
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter

        function getIcon(dnd, length) {
            if (dnd) {
                return "\ue7f8";
            } else if (length > 0) {
                return "\ue7f7";
            } else {
                return "\ue7f4";
            }
        }

        function getColor(dnd, length) {
            if (dnd) {
                return "#f38ba8";
            } else if (length > 0) {
                return "#89b4fa";
            } else {
                return "#cdd6f4";
            }
        }
    }

    background: Rectangle {
        id: backgroundRectangle
        color: "#313244"
        radius: 12
    }

    onHoveredChanged: {
        if (hovered) {
            backgroundRectangle.color = "#33cdd6f4";
        } else {
            backgroundRectangle.color = "#313244";
        }
    }

    MouseArea {
        anchors.fill: parent
        cursorShape: Qt.PointingHandCursor
        hoverEnabled: true
        acceptedButtons: Qt.LeftButton | Qt.RightButton

        onClicked: function (mouse) {
            switch (mouse.button) {
            case Qt.LeftButton:
                Quickshell.execDetached(["qs", "ipc", "call", "notificationsPanel", "toggle"]);
                break;
            case Qt.RightButton:
                NotificationsService.dnd = !NotificationsService.dnd;
                break;
            }
        }
    }
}
