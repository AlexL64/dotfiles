pragma ComponentBehavior: Bound
import Quickshell
import Quickshell.Io
import Quickshell.Widgets
import QtQuick
import QtQuick.Layouts
import qs.Services

PanelWindow { //qmllint disable uncreatable-type
    id: wallpapers
    visible: PanelStateService.wallpapersVisible
    aboveWindows: true
    color: "transparent"
    exclusionMode: ExclusionMode.Ignore
    focusable: true

    anchors {
        top: true
        bottom: true
        left: true
        right: true
    }

    onVisibleChanged: {
        if (visible) {
            currentProcess.running = true;
            listProcess.running = true;
        }
    }

    function getSelected(current, list) {
        const index = list.indexOf(current);
        return index == -1 ? 0 : index;
    }

    function sliceList(list, selected) {
        if (selected - 2 < 0) {
            return list.slice(selected - 2, list.length).concat(list.slice(0, 3 - (list.length - selected)));
        } else if (selected + 3 > list.length) {
            return list.slice(selected - 2, list.length).concat(list.slice(0, 3 - (list.length - selected)));
        }

        return list.slice(selected - 2, selected + 3);
    }

    function setWallpaper(path) {
        const types = ["grow", "outer"];
        const positions = ["center", "bottom", "top", "left", "right", "bottom-right", "bottom-left", "top-right", "top-left"];

        const selectedType = types[Math.floor(Math.random() * types.length)];
        const selectedPosition = positions[Math.floor(Math.random() * positions.length)];

        Quickshell.execDetached(["swww", "img", path, "--transition-type", selectedType, "--transition-pos", selectedPosition]);
    }

    property string current
    property list<string> list
    property int selected: getSelected(current, list)
    property list<string> slicedList: sliceList(list, selected)

    Process {
        id: currentProcess
        running: true
        command: ["bash", "-c", "echo $HOME/Wallpaper/$(basename $(swww query | grep -oP '(?<=image: ).*'))"]
        stdout: StdioCollector {
            onStreamFinished: {
                const current = text.trim();

                if (wallpapers.current != current) {
                    wallpapers.current = current;
                } else {
                    wallpapers.selected = wallpapers.getSelected(wallpapers.current, wallpapers.list);
                }
            }
        }
    }

    Process {
        id: listProcess
        running: true
        command: ["bash", "-c", 'find $HOME/Wallpaper/ -maxdepth 1 -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg"']
        stdout: StdioCollector {
            onStreamFinished: {
                var list = text.split("\n").filter(line => line.trim() != "");

                if (list.length < 1) {
                    list.push("../Assets/Images/no_wallpaper.png");
                }

                while (list.length < 5) {
                    list = list.concat(list);
                }

                if (wallpapers.list != list) {
                    wallpapers.list = list;
                } else {
                    wallpapers.selected = wallpapers.getSelected(wallpapers.current, wallpapers.list);
                }
            }
        }
    }

    Rectangle {
        border.color: "#cba6f7"
        border.width: 2
        color: "#1e1e2e"
        height: content.height + 20
        width: content.width + 20
        radius: 12
        anchors.centerIn: parent
        focus: true

        Keys.onPressed: event => {
            if (event.key == Qt.Key_Escape) {
                Quickshell.execDetached(["qs", "ipc", "call", "wallpapers", "hide"]);
            } else if (event.key == Qt.Key_Right) {
                if (wallpapers.selected < wallpapers.list.length - 1) {
                    wallpapers.selected += 1;
                } else {
                    wallpapers.selected = 0;
                }
            } else if (event.key == Qt.Key_Left) {
                if (wallpapers.selected > 0) {
                    wallpapers.selected -= 1;
                } else {
                    wallpapers.selected = wallpapers.list.length - 1;
                }
            } else if (event.key == Qt.Key_Return) {
                wallpapers.setWallpaper(wallpapers.list[wallpapers.selected]);
                Quickshell.execDetached(["qs", "ipc", "call", "wallpapers", "hide"]);
            }
        }

        Loader {
            id: content
            active: wallpapers.visible
            anchors.centerIn: parent

            sourceComponent: Component {
                RowLayout {
                    spacing: 10
                    anchors.centerIn: parent

                    Repeater {
                        model: wallpapers.slicedList
                        delegate: ClippingRectangle {
                            id: delegateItem

                            required property int index
                            required property string modelData

                            implicitHeight: 256
                            implicitWidth: 256
                            radius: 12
                            color: "#313244"
                            border.color: index == 2 ? "#f38ba8" : "#6c7086"
                            border.width: 2

                            Image {
                                source: delegateItem.modelData
                                width: 256
                                height: 256
                                fillMode: Image.PreserveAspectCrop
                                anchors.centerIn: parent
                                asynchronous: true
                                cache: true
                            }
                        }
                    }
                }
            }
        }
    }
}
