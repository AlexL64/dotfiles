import Quickshell.Io
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls

Button {
    id: memory
    Layout.fillHeight: true

    contentItem: Item {
        implicitWidth: content.width

        Row {
            id: content
            anchors.centerIn: parent
            spacing: 6

            Text {
                id: memoryValue

                text: "0%"
                font.family: "JetBrainsMono Nerd Font"
                font.pixelSize: 14
                color: "#f38ba8"
                font.bold: true
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                anchors.verticalCenter: parent.verticalCenter

                Process {
                    id: updateValue
                    running: true
                    command: ["bash", "-c", `top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk '{print int(100 - $1 + 0.5)"%"}'`]
                    stdout: StdioCollector {
                        onTextChanged: {
                            memoryValue.text = text.trim();
                        }
                    }
                }

                Timer {
                    interval: 10000
                    running: true
                    repeat: true
                    onTriggered: updateValue.running = true
                }
            }

            Text {
                text: "\ue322"
                font.family: "Material Icons"
                font.pixelSize: 16
                color: "#f38ba8"
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
