import QtQuick
import QtQuick.Layouts
import QtQuick.Controls

Button {
    id: power
    Layout.fillHeight: true
    implicitWidth: 36

    contentItem: Text {
        text: "\ue8ac"
        font.family: "Material Icons"
        font.pixelSize: 18
        font.bold:true
        color: "#f38ba8"
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
            backgroundRectangle.color = "#33f38ba8";
        } else {
            backgroundRectangle.color = "#313244";
        }
    }

    MouseArea {
        anchors.fill: parent
        cursorShape: Qt.PointingHandCursor
        hoverEnabled: true

        onClicked: {
            print("Clicked");
        }
    }
}
