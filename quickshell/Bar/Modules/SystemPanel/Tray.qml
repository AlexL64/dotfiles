import Quickshell
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls

Button {
    id: power
    Layout.fillHeight: true
    implicitWidth: 36

    contentItem: Text {
        text: ""
        font.family: "Font Awesome 7 Free Solid"
        font.pixelSize: 16
        color: "#cdd6f4"
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
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

        onClicked: {
            Quickshell.execDetached(["qs", "ipc", "call", "tray", "toggle"]);
        }
    }
}
