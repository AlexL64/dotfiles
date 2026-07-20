pragma ComponentBehavior: Bound
import Quickshell
import Quickshell.Widgets
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import qs.Services

PanelWindow { //qmllint disable uncreatable-type
    id: network
    visible: PanelStateService.networkVisible
    aboveWindows: true
    color: "transparent"
    exclusionMode: ExclusionMode.Auto
    implicitWidth: content.width + 24
    implicitHeight: content.height + 24

    // qmllint disable unresolved-type unqualified missing-property
    margins {
        top: 10
        right: 10
    }
    // qmllint enable unresolved-type unqualified missing-property

    anchors {
        top: true
        right: true
    }

    Rectangle {
        color: "#1e1e2e"
        width: content.width + 24
        height: content.height + 24
        radius: 12
        border.width: 2
        border.color: "#cba6f7"

        ColumnLayout {
            id: content
            width: 450
            anchors.centerIn: parent
            spacing: 10

            Rectangle {
                color: "#313244"
                implicitHeight: children[0].height + 24
                radius: 12
                Layout.fillWidth: true

                ColumnLayout {
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.leftMargin: 16
                    anchors.rightMargin: 16

                    RowLayout {
                        Layout.preferredHeight: 64

                        Text {
                            text: MullvadService.state == "connected" ? "" : ""
                            font.family: MullvadService.state == "connected" ? "Font Awesome 7 Free" : "Font Awesome 7 Free Solid"
                            font.pixelSize: 36
                            color: getColor(MullvadService.state)
                            Layout.rightMargin: MullvadService.state == "connected" ? 8 : 5
                            Layout.leftMargin: MullvadService.state == "connected" ? 0 : -8

                            function getColor(state) {
                                if (state == "connected") {
                                    return "#a6e3a1";
                                } else if (state == "connecting" || state == "disconnecting") {
                                    return "#fab387";
                                } else {
                                    return "#f38ba8";
                                }
                            }
                        }

                        Column {
                            spacing: 2

                            Row {
                                Text {
                                    text: "Mullvad VPN: "
                                    color: "#cdd6f4"
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 15
                                    font.bold: true
                                }

                                Text {
                                    text: MullvadService.state.charAt(0).toUpperCase() + MullvadService.state.slice(1)
                                    color: getColor(MullvadService.state)
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 15
                                    font.bold: true

                                    function getColor(state) {
                                        if (state == "connected") {
                                            return "#a6e3a1";
                                        } else if (state == "connecting" || state == "disconnecting") {
                                            return "#fab387";
                                        } else {
                                            return "#f38ba8";
                                        }
                                    }
                                }
                            }

                            Item {
                                width: parent.width
                                height: mullvadInfos.height

                                Behavior on height {
                                    NumberAnimation {
                                        duration: 200
                                        easing.type: Easing.OutCubic
                                    }
                                }

                                Column {
                                    id: mullvadInfos

                                    Row {
                                        visible: MullvadService.state == "connected" || MullvadService.state == "connecting"

                                        Text {
                                            text: MullvadService.infos.hostname
                                            color: "#bac2de"
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 13
                                            font.bold: true
                                        }

                                        Text {
                                            visible: MullvadService.infos.hostname != "" && MullvadService.infos.ipv4 != ""
                                            text: ", "
                                            color: "#bac2de"
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 13
                                            font.bold: true
                                        }

                                        Text {
                                            text: MullvadService.infos.ipv4
                                            color: "#bac2de"
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 13
                                            font.bold: true
                                        }
                                    }

                                    Row {
                                        visible: MullvadService.state == "connected" || MullvadService.state == "connecting"

                                        Text {
                                            text: MullvadService.infos.country
                                            color: "#bac2de"
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 13
                                            font.bold: true
                                        }

                                        Text {
                                            visible: MullvadService.infos.country != "" && MullvadService.infos.city != ""
                                            text: ", "
                                            color: "#bac2de"
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 13
                                            font.bold: true
                                        }

                                        Text {
                                            text: MullvadService.infos.city
                                            color: "#bac2de"
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 13
                                            font.bold: true
                                        }
                                    }
                                }
                            }
                        }

                        Rectangle {
                            Layout.fillWidth: true
                        }

                        Switch {
                            id: toggleMullvad
                            implicitWidth: background.width

                            checked: MullvadService.state == "connected"

                            indicator: Rectangle {
                                width: 18
                                height: 18
                                color: "white"
                                radius: 9
                                anchors.verticalCenter: parent.verticalCenter
                                x: toggleMullvad.checked ? parent.width - width - 3 : 3

                                Behavior on x {
                                    NumberAnimation {
                                        duration: 75
                                    }
                                }
                            }

                            background: Rectangle {
                                width: 48
                                height: 24
                                radius: 15
                                color: toggleMullvad.checked ? "#cba6f7" : "#9399b2"
                                anchors.verticalCenter: parent.verticalCenter

                                Behavior on color {
                                    ColorAnimation {
                                        duration: 75
                                        easing.type: Easing.InOutQuad
                                    }
                                }
                            }

                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                hoverEnabled: true

                                onClicked: {
                                    switch (MullvadService.state) {
                                    case "connected":
                                        MullvadService.disconnect();
                                        break;
                                    case "disconnected":
                                        MullvadService.connect();
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
