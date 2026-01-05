pragma Singleton
import Quickshell
import Quickshell.Io
import QtQuick

Singleton {
    id: root

    property bool enabled: false
    readonly property string path: "/sys/bus/platform/drivers/ideapad_acpi/VPC2004:00/conservation_mode"

    function test(batterySaverFile) {
        print(batterySaverFile);

        return false;
    }

    function toggle() {
        if (root.enabled) {
            Quickshell.execDetached(["sudo", "lenopow", "-d"]);
        } else {
            Quickshell.execDetached(["sudo", "lenopow", "-e"]);
        }
    }

    Process {
        id: watchProcess
        running: true
        command: ["bash", "-c", `inotifywait -m ${root.path} | grep --line-buffered "CLOSE"`]
        stdout: StdioCollector {
            waitForEnd: false
            onTextChanged: {
                updateEnabledProcess.running = true;
            }
        }
    }

    Process {
        id: updateEnabledProcess
        running: true
        command: ["cat", root.path]
        stdout: StdioCollector {
            waitForEnd: false
            onTextChanged: {
                root.enabled = text.trim() == "1";
            }
        }
    }
}
