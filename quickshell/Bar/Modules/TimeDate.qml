import Quickshell.Io
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls

Rectangle {
    id: dateTime

    Layout.fillHeight: true
    radius: 12
    implicitWidth: content.contentWidth + 24
    color: "#313244"

    Button {
        implicitWidth: content.contentWidth + 24
        implicitHeight: 36

        contentItem: Text {
            id: content
            color: "#cba6f7"
            font.family: "JetBrainsMono Nerd Font"
            font.pixelSize: 14
            font.bold: true
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter

            Process {
                id: dateProcess

                command: ["date", "+%A, %d. %b  %H:%M"]
                running: true

                stdout: StdioCollector {
                    onStreamFinished: content.text = text
                }
            }

            Timer {
                interval: 1000
                running: true
                repeat: true
                onTriggered: dateProcess.running = true
            }
        }

        background: Rectangle {
            id: backgroundRectangle
            color: "#313244"
            radius: 12
        }

        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            hoverEnabled: true

            onEntered: {
                backgroundRectangle.color = "#33cba6f7";
            }

            onExited: {
                backgroundRectangle.color = "#313244";
            }

            onClicked: {
                print("click");
            }
        }
    }
}
