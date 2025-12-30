import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import qs.Services

Button {
    id: brightness
    Layout.fillHeight: true

    contentItem: Item {
        implicitWidth: content.width

        Row {
            id: content
            anchors.centerIn: parent
            spacing: 6
            leftPadding: 3
            rightPadding: 3

            Text {
                text: `${BrightnessService.actualValue}%`
                font.family: "JetBrainsMono Nerd Font"
                font.pixelSize: 14
                color: "#f9e2af"
                font.bold: true
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                anchors.verticalCenter: parent.verticalCenter
            }

            Text {
                text: getIcon(BrightnessService.actualValue)
                font.family: "Material Icons"
                font.pixelSize: 14
                color: "#f9e2af"
                font.bold: true
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                anchors.verticalCenter: parent.verticalCenter

                function getIcon(brightness) {
                    const icons = {
                        84: "\ue3ac",
                        70: "\ue3ab",
                        56: "\ue3aa",
                        42: "\ue3a9",
                        28: "\ue3a8",
                        14: "\ue3a7",
                        0: "\ue3a6"
                    };

                    return icons[[84, 70, 56, 42, 28, 14, 0].find(threshold => threshold <= brightness)];
                }
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
            backgroundRectangle.color = "#33f9e2af";
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
