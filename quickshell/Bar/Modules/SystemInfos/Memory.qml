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
            leftPadding: 4
            rightPadding: 4

            Text {
                id: memoryValue

                text: "0%"
                font.family: "JetBrainsMono Nerd Font"
                font.pixelSize: 14
                color: "#fab387"
                font.bold: true
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                anchors.verticalCenter: parent.verticalCenter

                Process {
                    id: updateValue
                    running: true
                    command: ["bash", "-c", `free -m | grep "Mem" | awk '{printf "%.0f%\\n", ($3*100)/$2}'`]
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
                text: ""
                font.family: "Font Awesome 7 Free Solid"
                font.pixelSize: 14
                color: "#fab387"
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
            backgroundRectangle.color = "#33fab387";
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
