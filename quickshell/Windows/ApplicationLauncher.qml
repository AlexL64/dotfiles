pragma ComponentBehavior: Bound
import Quickshell
import Quickshell.Widgets
import Quickshell.Io
import Quickshell.Wayland
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import qs.Services

PanelWindow { //qmllint disable uncreatable-type
    id: applicationLauncher
    visible: PanelStateService.applicationLauncherVisible
    aboveWindows: true
    color: "transparent"
    exclusionMode: ExclusionMode.Ignore
    focusable: true
    implicitHeight: content.height
    implicitWidth: 530
    WlrLayershell.keyboardFocus: WlrKeyboardFocus.Exclusive

    onVisibleChanged: {
        search.text = "";
        apps.selected = 0;
        apps.page = 0;
    }

    FileView {
        path: Qt.resolvedUrl("../Storage/applicationLauncher.json")
        watchChanges: true
        onFileChanged: reload()
        onAdapterUpdated: writeAdapter()
        preload: true
        onLoadFailed: function (error) {

            // Create file if it doesn't exist
            if (error == 2) {
                print(`Creating file: ${path}`);
                Quickshell.execDetached(["touch", path.replace('file://', '')]);
                reload();
            }
        }

        JsonAdapter { // qmllint disable unresolved-type
            id: jsonAdapter
            property list<var> launchCount
        }
    }

    Rectangle {
        border.color: "#cba6f7"
        border.width: 2
        color: "#1e1e2e"
        height: content.height
        width: parent.width
        radius: 12
        anchors.centerIn: parent

        ColumnLayout {
            id: content
            width: parent.width

            TextField {
                id: search
                Layout.alignment: Qt.AlignTop
                Layout.fillWidth: true
                Layout.margins: 12
                Layout.bottomMargin: 6
                focus: true
                padding: 8
                placeholderText: qsTr("Search")
                font.family: "JetBrainsMono Nerd Font"
                font.pixelSize: 14
                font.bold: true

                background: Rectangle {
                    border.color: "#cba6f7"
                    border.width: 2
                    color: "#313244"
                    radius: 6
                }

                onTextChanged: {
                    apps.page = 0;
                    apps.selected = 0;
                }

                Keys.onPressed: event => {
                    if (event.key == Qt.Key_Escape) {
                        Quickshell.execDetached(["qs", "ipc", "call", "applicationLauncher", "hide"]);
                    } else if (event.key == Qt.Key_Up) {
                        if (apps.selected > 0) {
                            apps.selected -= 1;
                        } else {
                            if (apps.page > 0) {
                                apps.page -= 1;
                            } else {
                                apps.page = Math.ceil(apps.searchResult.length / 8) - 1;
                            }

                            apps.selected = apps.pageElements.length - 1;
                        }
                    } else if (event.key == Qt.Key_Down) {
                        if (apps.selected < apps.pageElements.length - 1) {
                            apps.selected += 1;
                        } else {
                            apps.selected = 0;

                            if (apps.page < Math.ceil(apps.searchResult.length / 8) - 1) {
                                apps.page += 1;
                            } else {
                                apps.page = 0;
                            }
                        }
                    } else if (event.key == Qt.Key_Return) {
                        apps.pageElements[apps.selected].execute();

                        // Update the app launch count
                        const index = jsonAdapter.launchCount.findIndex(a => a.id === apps.pageElements[apps.selected].id); // qmllint disable unqualified
                        if (index != -1) {
                            jsonAdapter.launchCount[index].count += 1;// qmllint disable unqualified
                        } else {
                            jsonAdapter.launchCount.push // qmllint disable unqualified
                            ({
                                "id": apps.pageElements[apps.selected].id,
                                "count": 1
                            });
                        }

                        Quickshell.execDetached(["qs", "ipc", "call", "applicationLauncher", "hide"]);
                    }
                }

                onFocusChanged: {
                    forceActiveFocus();
                }
            }

            ColumnLayout {
                id: apps
                Layout.alignment: Qt.AlignTop
                Layout.preferredHeight: 548
                Layout.fillWidth: true
                Layout.leftMargin: 12
                Layout.rightMargin: 12
                spacing: 6
                Layout.fillHeight: false

                function processApps(apps, launchCount) {
                    var result = [];

                    // Generate an array containing the app and it's launch count
                    apps.forEach(app => {
                        const index = launchCount.findIndex(a => a.id === app.id);

                        if (index != -1) {
                            result.push({
                                "app": app,
                                "count": launchCount[index].count
                            });
                        } else {
                            result.push({
                                "app": app,
                                "count": 0
                            });
                        }
                    });

                    // Sort apps by launch count and then alphabetically
                    result.sort((a, b) => {
                        if (b.count !== a.count) {
                            return b.count - a.count;
                        }

                        return a.app.id.localeCompare(b.app.id);
                    });

                    return result.map(item => item.app);
                }

                function searchApps(list, search) {
                    var result = [];

                    if (search != "") {
                        // Includes apps whose name or keywords containg the search
                        list.forEach(app => {
                            if (app.name.toLowerCase().includes(search.toLowerCase()) || app.keywords.some(keyword => keyword.toLowerCase().includes(search.toLowerCase()))) {
                                result.push(app);
                            }
                        });

                        // Includes apps whose description contain the search
                        list.forEach(app => {
                            if (app.comment.toLowerCase().includes(search.toLowerCase())) {
                                if (!result.includes(app)) {
                                    result.push(app);
                                }
                            }
                        });

                        // Includes apps whose categories contain the search
                        list.forEach(app => {
                            if (app.categories.some(categorie => categorie.toLowerCase().includes(search.toLowerCase()))) {
                                if (!result.includes(app)) {
                                    result.push(app);
                                }
                            }
                        });

                        return result;
                    } else {
                        return list;
                    }
                }

                property var list: processApps(DesktopEntries.applications.values, jsonAdapter.launchCount)
                property var searchResult: searchApps(list, search.text)
                property int page: 0
                property int selected: 0

                property var pageElements: searchResult.slice(apps.page * 8, (apps.page * 8) + 8)

                Repeater {
                    model: apps.pageElements
                    delegate: Rectangle {
                        id: delegateItem

                        required property int index
                        required property var modelData

                        border.color: "#f38ba8"
                        border.width: (index == apps.selected) ? 2 : 0
                        color: '#313244'
                        height: 64
                        radius: 6
                        Layout.fillWidth: true

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            hoverEnabled: true

                            onEntered: {
                                parent.color = "#45475a";
                            }

                            onExited: {
                                parent.color = "#313244";
                            }

                            onDoubleClicked: {
                                delegateItem.modelData.execute();

                                // Update the app launch count
                                const index = jsonAdapter.launchCount.findIndex(a => a.id === apps.pageElements[apps.selected].id);
                                if (index != -1) {
                                    jsonAdapter.launchCount[index].count += 1;
                                } else {
                                    jsonAdapter.launchCount.push({
                                        "id": apps.pageElements[apps.selected].id,
                                        "count": 1
                                    });
                                }

                                Quickshell.execDetached(["qs", "ipc", "call", "applicationLauncher", "hide"]);
                            }
                        }

                        Item {
                            anchors.fill: parent
                            anchors.margins: 5

                            RowLayout {
                                anchors.fill: parent
                                IconImage {
                                    source: Quickshell.iconPath(delegateItem.modelData.name.toLowerCase(), delegateItem.modelData.icon)
                                    implicitSize: 54
                                    Layout.rightMargin: 10
                                }

                                Column {
                                    Layout.alignment: Qt.AlignTop
                                    Layout.fillWidth: true
                                    spacing: 3

                                    Text {
                                        color: "#cdd6f4"
                                        text: delegateItem.modelData.name
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 14
                                        font.bold: true
                                        width: parent.width - 20
                                        elide: Text.ElideRight
                                    }

                                    Text {
                                        color: "#6c7086"
                                        text: delegateItem.modelData.comment
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 12
                                        font.bold: true
                                        width: parent.width - 20
                                        maximumLineCount: 2
                                        wrapMode: Text.Wrap
                                        elide: Text.ElideRight
                                    }
                                }
                            }
                        }
                    }
                }

                Item {
                    Layout.fillHeight: true
                }
            }

            RowLayout {
                Layout.alignment: Qt.AlignRight | Qt.AlignBottom
                Layout.margins: 12
                spacing: 10

                Button {
                    implicitWidth: 50
                    implicitHeight: 26
                    text: ""

                    background: Rectangle {
                        id: leftButtonBackground

                        color: "#313244"
                        radius: 6
                    }

                    onHoveredChanged: {
                        if (hovered) {
                            leftButtonBackground.color = "#45475a";
                        } else {
                            leftButtonBackground.color = "#313244";
                        }
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor

                        onClicked: {
                            if (apps.page > 0) {
                                apps.page -= 1;
                            } else {
                                apps.page = Math.ceil(apps.searchResult.length / 8) - 1;
                            }
                        }
                    }
                }

                Button {
                    implicitWidth: 50
                    implicitHeight: 26
                    text: ""

                    background: Rectangle {
                        id: rightButtonBackground

                        color: "#313244"
                        radius: 6
                    }

                    onHoveredChanged: {
                        if (hovered) {
                            rightButtonBackground.color = "#45475a";
                        } else {
                            rightButtonBackground.color = "#313244";
                        }
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor

                        onClicked: {
                            if (apps.page < Math.ceil(apps.searchResult.length / 8) - 1) {
                                apps.page += 1;
                            } else {
                                apps.page = 0;
                            }
                        }
                    }
                }

                Row {
                    spacing: 3

                    Text {
                        text: apps.page + 1
                        color: "#cdd6f4"
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 14
                        font.bold: true
                    }

                    Text {
                        text: "/"
                        color: "#cdd6f4"
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 14
                        font.bold: true
                    }

                    Text {
                        text: Math.max(Math.ceil(apps.searchResult.length / 8), 1)
                        color: "#cdd6f4"
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 14
                        font.bold: true
                    }
                }
            }
        }
    }
}
