pragma Singleton
import Quickshell
import Quickshell.Io
import QtQuick

Singleton {
    id: root

    property list<var> list: []

    function clear() {
        Quickshell.execDetached(["bash", "-c", 'cliphist wipe && wl-copy ""']);
    }

    function removeId(id) {
        Quickshell.execDetached(["bash", "-c", `cliphist list | grep ${id} | cliphist delete && wl-copy ""`]);
    }

    function setId(id) {
        Quickshell.execDetached(["bash", "-c", `cliphist list | grep ${id} | cliphist decode | wl-copy`]);
    }

    Process {
        id: watchProcess
        running: true
        command: ["bash", "-c", "wl-paste --watch echo test"]
        stdout: StdioCollector {
            waitForEnd: false
            onTextChanged: {
                updateListProcess.running = true;
            }
        }
    }

    Process {
        id: updateListProcess
        running: false
        command: ["bash", "-c", "cliphist list"]
        stdout: StdioCollector {
            onStreamFinished: {
                const lines = text.trim().split("\n");
                const entries = [];

                if (lines[lines.length - 1] == "") {
                    lines.pop();
                }

                lines.forEach((line, index) => {
                    const words = line.split('\t');

                    entries.push({
                        "id": Number(words[0]),
                        "text": words.slice(1).join(" ")
                    });
                });

                root.list = entries;
            }
        }
    }
}
