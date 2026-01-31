pragma ComponentBehavior: Bound
import Quickshell
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import qs.Bar.Menus.Audio
import qs.Services

PanelWindow { //qmllint disable uncreatable-type
    id: audio
    visible: PanelStateService.audioVisible
    aboveWindows: true
    color: "transparent"
    exclusionMode: ExclusionMode.Auto
    implicitWidth: content.width
    implicitHeight: content.height

    // qmllint disable unresolved-type unqualified missing-property
    margins {
        top: 10
        left: 344
    }
    // qmllint enable unresolved-type unqualified missing-property

    anchors {
        top: true
        left: true
    }

    Component {
        id: sinks
        Sinks {}
    }

    Component {
        id: sources
        Sources {}
    }

    Component {
        id: apps
        Apps {}
    }

    Component {
        id: devices
        Devices {
            window: audio
        }
    }

    Rectangle {
        color: "#1e1e2e"
        width: content.width
        height: content.height
        radius: 12
        border.width: 2
        border.color: "#cba6f7"

        ColumnLayout {
            id: content
            spacing: 0

            RowLayout {
                Layout.alignment: Qt.AlignHCenter
                Layout.margins: 2
                Layout.bottomMargin: 0
                spacing: 0
                Button {
                    implicitHeight: 36
                    implicitWidth: 120
                    contentItem: Text {
                        text: "Output"
                        color: PanelStateService.audioMenu == 0 ? "#cba6f7" : "#cdd6f4"
                        font.pixelSize: 14
                        font.family: "JetBrainsMono Nerd Font"
                        font.bold: true
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }

                    background: Rectangle {
                        color: getColor(sinksButtonMouseArea.containsMouse, PanelStateService.audioMenu == 0)
                        topLeftRadius: 12

                        function getColor(containsMouse, selected) {
                            if (containsMouse || selected) {
                                return "#45475a";
                            }

                            return "#313244";
                        }
                    }

                    MouseArea {
                        id: sinksButtonMouseArea
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        hoverEnabled: true

                        onClicked: {
                            PanelStateService.audioMenu = "sinks";
                        }
                    }
                }

                Button {
                    implicitHeight: 36
                    implicitWidth: 120
                    contentItem: Text {
                        text: "Input"
                        color: PanelStateService.audioMenu == 1 ? "#cba6f7" : "#cdd6f4"
                        font.pixelSize: 14
                        font.family: "JetBrainsMono Nerd Font"
                        font.bold: true
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }

                    background: Rectangle {
                        color: getColor(sourcesButtonMouseArea.containsMouse, PanelStateService.audioMenu == 1)

                        function getColor(containsMouse, selected) {
                            if (containsMouse || selected) {
                                return "#45475a";
                            }

                            return "#313244";
                        }
                    }

                    MouseArea {
                        id: sourcesButtonMouseArea
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        hoverEnabled: true

                        onClicked: {
                            PanelStateService.audioMenu = "sources";
                        }
                    }
                }

                Button {
                    implicitHeight: 36
                    implicitWidth: 120
                    contentItem: Text {
                        text: "Apps"
                        color: PanelStateService.audioMenu == 2 ? "#cba6f7" : "#cdd6f4"
                        font.pixelSize: 14
                        font.family: "JetBrainsMono Nerd Font"
                        font.bold: true
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }

                    background: Rectangle {
                        color: getColor(appsButtonMouseArea.containsMouse, PanelStateService.audioMenu == 2)

                        function getColor(containsMouse, selected) {
                            if (containsMouse || selected) {
                                return "#45475a";
                            }

                            return "#313244";
                        }
                    }

                    MouseArea {
                        id: appsButtonMouseArea
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        hoverEnabled: true

                        onClicked: {
                            PanelStateService.audioMenu = "apps";
                        }
                    }
                }

                Button {
                    implicitHeight: 36
                    implicitWidth: 120
                    contentItem: Text {
                        text: "Devices"
                        color: PanelStateService.audioMenu == 3 ? "#cba6f7" : "#cdd6f4"
                        font.pixelSize: 14
                        font.family: "JetBrainsMono Nerd Font"
                        font.bold: true
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }

                    background: Rectangle {
                        color: getColor(devicesButtonMouseArea.containsMouse, PanelStateService.audioMenu == 3)
                        topRightRadius: 12

                        function getColor(containsMouse, selected) {
                            if (containsMouse || selected) {
                                return "#45475a";
                            }

                            return "#313244";
                        }
                    }

                    MouseArea {
                        id: devicesButtonMouseArea
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        hoverEnabled: true

                        onClicked: {
                            PanelStateService.audioMenu = "devices";
                        }
                    }
                }
            }

            ScrollView {
                Layout.margins: 12
                Layout.fillWidth: true
                Layout.preferredHeight: 300

                Loader {
                    width: parent.width

                    sourceComponent: {
                        switch (PanelStateService.audioMenu) {
                        case 0:
                            return sinks;
                        case 1:
                            return sources;
                        case 2:
                            return apps;
                        case 3:
                            return devices;
                        }
                    }
                }
            }
        }
    }
}
