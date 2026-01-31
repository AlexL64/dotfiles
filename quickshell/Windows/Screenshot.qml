import Quickshell
import Quickshell.Wayland
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import qs.Services

PanelWindow { // qmllint disable uncreatable-type
    id: screenshot
    visible: PanelStateService.screenshotVisible
    exclusionMode: ExclusionMode.Ignore
    focusable: false
    color: "transparent"
    implicitHeight: content.height + 12
    implicitWidth: content.width + 12
    WlrLayershell.layer: WlrLayer.Overlay

    anchors {
        right: true
    }

    // qmllint disable unresolved-type unqualified missing-property
    margins {
        right: 10
    }
    // qmllint enable unresolved-type unqualified missing-property

    Rectangle {
        height: content.height + 12
        width: content.width + 12
        color: "#1e1e2e"
        radius: 12
        border.color: "#cba6f7"
        border.width: 2

        ColumnLayout {
            id: content
            anchors.centerIn: parent
            spacing: 6

            Button {
                implicitWidth: 48
                implicitHeight: 48

                contentItem: Text {
                    text: "\ue3be"
                    font.family: "Material Icons"
                    font.pixelSize: 24
                    color: "#cdd6f4"
                    font.bold: true
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                }

                background: Rectangle {
                    id: buttonRegionBackground
                    color: "#313244"
                    radius: 6
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    hoverEnabled: true

                    onEntered: {
                        buttonRegionBackground.color = "#cc313244";
                    }

                    onExited: {
                        buttonRegionBackground.color = "#313244";
                    }

                    onClicked: {
                        PanelStateService.screenshotVisible = false;
                        Quickshell.execDetached(["bash", "-c", "killall slurp; hyprshot -m region -o ~/Pictures/Screenshots/"]);
                    }
                }
            }

            Button {
                implicitWidth: 48
                implicitHeight: 48

                contentItem: Text {
                    text: "\ue069"
                    font.family: "Material Icons"
                    font.pixelSize: 24
                    color: "#cdd6f4"
                    font.bold: true
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                }

                background: Rectangle {
                    id: buttonWinfowBackground
                    color: "#313244"
                    radius: 6
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    hoverEnabled: true

                    onEntered: {
                        buttonWinfowBackground.color = "#cc313244";
                    }

                    onExited: {
                        buttonWinfowBackground.color = "#313244";
                    }

                    onClicked: {
                        PanelStateService.screenshotVisible = false;
                        Quickshell.execDetached(["bash", "-c", "killall slurp; hyprshot -m window -o ~/Pictures/Screenshots/"]);
                    }
                }
            }

            Button {
                implicitWidth: 48
                implicitHeight: 48

                contentItem: Text {
                    text: "\uef5b"
                    font.family: "Material Icons"
                    font.pixelSize: 24
                    color: "#cdd6f4"
                    font.bold: true
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                }

                background: Rectangle {
                    id: buttonOutputBackground
                    color: "#313244"
                    radius: 6
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    hoverEnabled: true

                    onEntered: {
                        buttonOutputBackground.color = "#cc313244";
                    }

                    onExited: {
                        buttonOutputBackground.color = "#313244";
                    }

                    onClicked: {
                        PanelStateService.screenshotVisible = false;
                        Quickshell.execDetached(["bash", "-c", "killall slurp; hyprshot -m output -o ~/Pictures/Screenshots/"]);
                    }
                }
            }

            Button {
                implicitWidth: 48
                implicitHeight: 48

                contentItem: Text {
                    text: "\ue3be"
                    font.family: "Material Icons"
                    font.pixelSize: 24
                    color: "#cdd6f4"
                    font.bold: true
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                }

                background: Rectangle {
                    id: buttonRegionFreezeBackground
                    color: "#89b4fa"
                    radius: 6
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    hoverEnabled: true

                    onEntered: {
                        buttonRegionFreezeBackground.color = "#cc89b4fa";
                    }

                    onExited: {
                        buttonRegionFreezeBackground.color = "#89b4fa";
                    }

                    onClicked: {
                        PanelStateService.screenshotVisible = false;
                        Quickshell.execDetached(["bash", "-c", "killall slurp; sleep 0.2; hyprshot -z -m region -o ~/Pictures/Screenshots/"]);
                    }
                }
            }

            Button {
                implicitWidth: 48
                implicitHeight: 48

                contentItem: Text {
                    text: "\ue069"
                    font.family: "Material Icons"
                    font.pixelSize: 24
                    color: "#cdd6f4"
                    font.bold: true
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                }

                background: Rectangle {
                    id: buttonWindowFreezeBackground
                    color: "#89b4fa"
                    radius: 6
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    hoverEnabled: true

                    onEntered: {
                        buttonWindowFreezeBackground.color = "#cc89b4fa";
                    }

                    onExited: {
                        buttonWindowFreezeBackground.color = "#89b4fa";
                    }

                    onClicked: {
                        PanelStateService.screenshotVisible = false;
                        Quickshell.execDetached(["bash", "-c", "killall slurp; sleep 0.2; hyprshot -z -m window -o ~/Pictures/Screenshots/"]);
                    }
                }
            }

            Button {
                implicitWidth: 48
                implicitHeight: 48

                contentItem: Text {
                    text: "\uef5b"
                    font.family: "Material Icons"
                    font.pixelSize: 24
                    color: "#cdd6f4"
                    font.bold: true
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                }

                background: Rectangle {
                    id: buttonOutputFreezeBackground
                    color: "#89b4fa"
                    radius: 6
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    hoverEnabled: true

                    onEntered: {
                        buttonOutputFreezeBackground.color = "#cc89b4fa";
                    }

                    onExited: {
                        buttonOutputFreezeBackground.color = "#89b4fa";
                    }

                    onClicked: {
                        PanelStateService.screenshotVisible = false;
                        Quickshell.execDetached(["bash", "-c", "killall slurp; sleep 0.2; hyprshot -z -m output -o ~/Pictures/Screenshots/"]);
                    }
                }
            }
        }
    }
}
