import Quickshell.Io
import QtQuick
import QtQuick.Layouts

Rectangle {
    id: dateTime

    Layout.fillHeight: true
    radius: 12
    color: "#313244"
    implicitWidth: content.width

    Text {
        id: content
        anchors.centerIn: parent
        font.family: "JetBrainsMono Nerd Font"
        font.pixelSize: 14
        font.bold: true
        color: "#cba6f7"
        leftPadding: 15
        rightPadding: 15

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
}
