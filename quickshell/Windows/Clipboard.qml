pragma ComponentBehavior: Bound
import Quickshell
import Quickshell.Wayland
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import qs.Services

PanelWindow { //qmllint disable uncreatable-type
    id: clipboard
    visible: PanelStateService.clipboardVisible
    aboveWindows: true
    color: "transparent"
    exclusionMode: ExclusionMode.Ignore
    focusable: true
    implicitHeight: content.height
    implicitWidth: 700
    WlrLayershell.keyboardFocus: WlrKeyboardFocus.Exclusive

    onVisibleChanged: {
        search.text = "";
        selected = 0;
        page = 0;
    }

    function searchClibboard(list, search) {
        var result = [];

        list.forEach(e => {
            if (e.text.toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
                result.push(e);
            }
        });

        return result;
    }

    property int selected: 0
    property int page: 0
    property list<var> searchResult: searchClibboard(ClipboardService.list, search.text)

    property var pageElements: searchResult.slice(clipboard.page * 10, (clipboard.page * 10) + 10)

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

            RowLayout {
                Layout.margins: 12
                Layout.bottomMargin: 6

                TextField {
                    id: search
                    Layout.alignment: Qt.AlignTop
                    Layout.fillWidth: true
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

                    Keys.onPressed: event => {
                        if (event.key == Qt.Key_Escape) {
                            Quickshell.execDetached(["qs", "ipc", "call", "clipboard", "hide"]);
                        } else if (event.key == Qt.Key_Up) {
                            if (clipboard.selected > 0) {
                                clipboard.selected -= 1;
                            } else {
                                if (clipboard.page > 0) {
                                    clipboard.page -= 1;
                                } else {
                                    clipboard.page = Math.ceil(clipboard.searchResult.length / 10) - 1;
                                }

                                clipboard.selected = clipboard.pageElements.length - 1;
                            }
                        } else if (event.key == Qt.Key_Down) {
                            if (clipboard.selected < clipboard.pageElements.length - 1) {
                                clipboard.selected += 1;
                            } else {
                                clipboard.selected = 0;

                                if (clipboard.page < Math.ceil(clipboard.searchResult.length / 10) - 1) {
                                    clipboard.page += 1;
                                } else {
                                    clipboard.page = 0;
                                }
                            }
                        } else if (event.key == Qt.Key_Delete) {
                            ClipboardService.removeId(clipboard.pageElements[clipboard.selected].id);

                            if (clipboard.page + 1 > Math.ceil((clipboard.searchResult.length - 1) / 10) && clipboard.page > 0) {
                                clipboard.page -= 1;
                            }

                            if (clipboard.selected + 1 > clipboard.pageElements.length - 1 && clipboard.selected > 0) {
                                clipboard.selected -= 1;
                            }
                        } else if (event.key == Qt.Key_Return) {
                            ClipboardService.setId(clipboard.pageElements[clipboard.selected].id);
                            Quickshell.execDetached(["qs", "ipc", "call", "clipboard", "hide"]);
                        }
                    }

                    onFocusChanged: {
                        forceActiveFocus();
                    }
                }

                Button {
                    implicitHeight: 36
                    implicitWidth: 60

                    contentItem: Text {
                        text: "Clear"
                        color: "#313244"
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 14
                        font.bold: true
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }

                    background: Rectangle {
                        id: clearButtonBackground

                        color: "#f38ba8"
                        radius: 6
                    }

                    onHoveredChanged: {
                        if (hovered) {
                            clearButtonBackground.opacity = 0.8;
                        } else {
                            clearButtonBackground.opacity = 1;
                        }
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor

                        onClicked: {
                            ClipboardService.clear();
                            Quickshell.execDetached(["qs", "ipc", "call", "clipboard", "hide"]);
                        }
                    }
                }
            }

            ColumnLayout {
                Layout.alignment: Qt.AlignTop
                Layout.preferredHeight: 408
                Layout.fillWidth: true
                Layout.leftMargin: 12
                Layout.rightMargin: 12
                spacing: 6
                Layout.fillHeight: false

                Repeater {
                    model: clipboard.pageElements
                    delegate: RowLayout {
                        id: delegateItem

                        Layout.fillHeight: false

                        required property int index
                        required property var modelData

                        Rectangle {
                            color: '#313244'
                            radius: 6
                            border.color: "#f38ba8"
                            border.width: clipboard.selected == delegateItem.index ? 2 : 0
                            Layout.fillWidth: true
                            implicitHeight: 36

                            Text {
                                anchors.centerIn: parent
                                text: delegateItem.modelData.text
                                color: delegateItem.index == clipboard.selected ? "#f38ba8" : "#cdd6f4"
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 14
                                font.bold: true
                                width: parent.width - 30
                                elide: Text.ElideRight
                            }

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
                                    ClipboardService.setId(delegateItem.modelData.id);
                                    Quickshell.execDetached(["qs", "ipc", "call", "clipboard", "hide"]);
                                }
                            }
                        }

                        Button {
                            implicitHeight: 36
                            implicitWidth: 50

                            contentItem: Text {
                                text: ""
                                color: "#313244"
                                font.family: "Font Awesome 7 Free"
                                font.pixelSize: 16
                                horizontalAlignment: Text.AlignHCenter
                                verticalAlignment: Text.AlignVCenter
                            }

                            background: Rectangle {
                                id: deleteButtonBackground

                                color: "#f38ba8"
                                radius: 6
                            }

                            onHoveredChanged: {
                                if (hovered) {
                                    deleteButtonBackground.opacity = 0.8;
                                } else {
                                    deleteButtonBackground.opacity = 1;
                                }
                            }

                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor

                                onClicked: {
                                    ClipboardService.removeId(delegateItem.modelData.id);

                                    if (clipboard.page + 1 > Math.ceil((clipboard.searchResult.length - 1) / 10) && clipboard.page > 0) {
                                        clipboard.page -= 1;
                                    }

                                    if (clipboard.selected + 1 > clipboard.pageElements.length - 1 && clipboard.selected > 0) {
                                        clipboard.selected -= 1;
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
                            if (clipboard.page > 0) {
                                clipboard.page -= 1;
                            } else {
                                clipboard.page = Math.ceil(clipboard.searchResult.length / 10) - 1;
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
                            if (clipboard.page < Math.ceil(clipboard.searchResult.length / 10) - 1) {
                                clipboard.page += 1;
                            } else {
                                clipboard.page = 0;
                            }
                        }
                    }
                }

                Row {
                    spacing: 3

                    Text {
                        text: clipboard.page + 1
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
                        text: Math.max(Math.ceil(clipboard.searchResult.length / 10), 1)
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
