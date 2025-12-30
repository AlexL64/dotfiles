pragma Singleton
import Quickshell
import Quickshell.Io
import QtQuick

Singleton {
    id: root

    property string screen: ""
    property real maxValue: screenMaxFile.text()
    property real value: screenFile.text()
    property int actualValue: Math.round(value * 100 / maxValue)

    function setValue(value) {
        if (value > 100) {
            value = 100;
        }

        if (value < 0) {
            value = 0;
        }

        Quickshell.execDetached(["brightnessctl", `--device=${screen}`, "s", `${value}%`]);
    }

    FileView {
        id: screenMaxFile
        path: root.screen != "" ? `/sys/class/backlight/${root.screen}/max_brightness` : null
        blockWrites: true
    }

    FileView {
        id: screenFile
        path: root.screen != "" ? `/sys/class/backlight/${root.screen}/brightness` : null
        watchChanges: true
        blockWrites: true
        onFileChanged: this.reload()
    }

    Process {
        id: watchProcess
        running: true
        command: ["bash", "-c", "ls -w1 /sys/class/backlight | head -1"]
        stdout: StdioCollector {
            onTextChanged: {
                root.screen = text.trim();
            }
        }
    }

    // Process {
    //     id: updateInfosProcess
    //     running: true
    //     command: ["bash", "-c", "mullvad status --json"]
    //     stdout: StdioCollector {
    //         onStreamFinished: {
    //             try {
    //                 const json = JSON.parse(text);

    //                 root.state = json.state;
    //                 root.infos.lastIpcObject = json.details.location;
    //             } catch (error) {
    //                 root.state = "error";
    //                 root.infos.lastIpcObject = {};
    //             }
    //         }
    //     }
    // }
}
