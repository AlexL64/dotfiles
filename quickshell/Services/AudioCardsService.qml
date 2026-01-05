pragma Singleton
import Quickshell
import Quickshell.Io
import QtQuick
import qs.Types

Singleton {
    id: root

    Component {
        id: test

        AudioCardInfos {}
    }

    property list<AudioCardInfos> list: []

    function setProfile() {
    }

    Process {
        id: watchProcess
        running: true
        command: ["bash", "-c", "pactl subscribe | grep --line-buffered  'card'"]
        stdout: StdioCollector {
            waitForEnd: false
            onTextChanged: {
                updateInfosProcess.running = true;
            }
        }
    }

    Process {
        id: updateInfosProcess
        running: true
        command: ["pactl", "--format=json", "list", "cards"]
        stdout: StdioCollector {
            onStreamFinished: {
                const results = [];
                const json = JSON.parse(text);
                json.forEach(j => {
                    results.push(test.createObject(null, {
                        "lastIpcObject": {
                            "id": j.index,
                            "name": j.properties["device.product.name"],
                            "description": j.properties["device.description"],
                            "activeProfile": j.active_profile,
                            "profiles": Object.keys(j.profiles).filter(key => j.profiles[key].available).map(key => key)
                        }
                    }));
                });

                root.list = results;
            }
        }
    }
}
