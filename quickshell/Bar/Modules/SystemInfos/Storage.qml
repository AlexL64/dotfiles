import Quickshell.Io
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls

Button {
    id: storage
    Layout.fillHeight: true

    contentItem: Item {
        implicitWidth: content.width

        Row {
            id: content
            anchors.centerIn: parent
            spacing: 6

            Text {
                id: storageValue

                text: "0%"
                font.family: "JetBrainsMono Nerd Font"
                font.pixelSize: 14
                color: "#89b4fa"
                font.bold: true
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                anchors.verticalCenter: parent.verticalCenter

                Process {
                    id: updateValue
                    running: true
                    command: ["bash", "-c", "df | grep '.* /$' | awk '{print $5}'"]
                    stdout: StdioCollector {
                        onTextChanged: {
                            storageValue.text = text.trim();
                        }
                    }
                }

                Timer {
                    interval: 300000
                    running: true
                    repeat: true
                    onTriggered: updateValue.running = true
                }
            }

            Text {
                text: "󰋊"
                font.family: "Material Design Icons Extended"
                font.pixelSize: 14
                color: "#89b4fa"
                font.bold: true
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                anchors.verticalCenter: parent.verticalCenter
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
            backgroundRectangle.color = "#3389b4fa";
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
