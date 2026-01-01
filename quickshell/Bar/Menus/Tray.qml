pragma ComponentBehavior: Bound
import Quickshell
import Quickshell.Widgets
import Quickshell.Services.SystemTray
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls

PanelWindow { //qmllint disable uncreatable-type
    id: tray
    aboveWindows: true
    color: "transparent"
    exclusionMode: ExclusionMode.Auto
    implicitWidth: content.width + 20
    implicitHeight: content.height + 20

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
        color: "#313244"
        width: content.width + 20
        height: content.height + 20
        radius: 12
        border.width: 2
        border.color: "#cba6f7"

        GridLayout {
            id: content
            columns: Math.ceil(Math.sqrt(SystemTray.items.values.length))
            anchors.centerIn: parent
            rowSpacing: 3
            columnSpacing: 3

            Repeater {
                model: SystemTray.items
                delegate: Button {
                    id: delegateItem
                    padding: 8

                    required property SystemTrayItem modelData

                    contentItem: IconImage {
                        source: delegateItem.modelData.icon
                        implicitSize: 20
                    }

                    background: Rectangle {
                        id: backgroundRectangle
                        color: "#313244"
                        radius: 6
                    }

                    QsMenuAnchor {
                        id: menu
                        menu: delegateItem.modelData.menu // qmllint disable unresolved-type
                        anchor.window: tray
                        anchor.rect.y: delegateItem.y + delegateItem.height + delegateItem.padding
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        hoverEnabled: true

                        onEntered: {
                            if (delegateItem.modelData.hasMenu) {
                                backgroundRectangle.color = "#33cba6f7";
                            }
                        }

                        onExited: {
                            backgroundRectangle.color = "#313244";
                        }

                        onClicked: {
                            if (delegateItem.modelData.hasMenu) {
                                menu.open();
                            }
                        }
                    }
                }
            }
        }
    }
}
