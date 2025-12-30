pragma Singleton
import Quickshell
import Quickshell.Io
import QtQuick
import qs.Types

Singleton {
    id: root

    property string state: "disconnected"
    property MullvadInfos infos: MullvadInfos {
        lastIpcObject: {}
    }

    function connect() {
        Quickshell.execDetached(["bash", "-c", 'mullvad connect']);
    }

    function disconnect() {
        Quickshell.execDetached(["bash", "-c", 'mullvad disconnect']);
    }

    function reconnect() {
        Quickshell.execDetached(["bash", "-c", 'mullvad reconnect']);
    }

    function refreshInfos() {
        updateInfosProcess.running = true;
    }

    Process {
        id: watchProcess
        running: true
        command: ["journalctl", "-u", "mullvad-daemon", "-f", "--merge", "-g", "New tunnel state:"]
        stdout: StdioCollector {
            waitForEnd: false
            onTextChanged: {
                updateInfosProcess.running = true;
            }
        }
        stderr: StdioCollector {
            waitForEnd: true
            onTextChanged: {
                print(text);
            }
        }
    }

    Process {
        id: updateInfosProcess
        running: true
        command: ["bash", "-c", "mullvad status --json"]
        stdout: StdioCollector {
            onStreamFinished: {
                try {
                    const json = JSON.parse(text);

                    root.state = json.state;
                    root.infos.lastIpcObject = json.details.location;
                } catch (error) {
                    root.state = "error";
                    root.infos.lastIpcObject = {};
                }
            }
        }
    }
}
