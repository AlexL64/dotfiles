pragma ComponentBehavior: Bound
import Quickshell
import Quickshell.Widgets
import Quickshell.Wayland
import Quickshell.Services.Notifications
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import qs.Services

PanelWindow { //qmllint disable uncreatable-type
    id: notifications
    visible: !PanelStateService.notificationsPanelVisible
    aboveWindows: true
    color: "transparent"
    exclusionMode: ExclusionMode.Ignore
    implicitWidth: content.width
    implicitHeight: content.height
    WlrLayershell.namespace: "noanim"

    anchors {
        bottom: true
        right: true
    }

    // qmllint disable unresolved-type unqualified missing-property
    margins {
        bottom: 10
        right: 10
    }
    // qmllint enable unresolved-type unqualified missing-property

    Behavior on implicitHeight {
        NumberAnimation {
            duration: 25
        }
    }

    ColumnLayout {
        id: content
        spacing: 10

        Repeater {
            model: NotificationsService.sortedTemopraryNotifications
            delegate: Loader {
                id: delegateItem

                required property Notification modelData

                active: modelData != null

                sourceComponent: Rectangle {
                    color: "#11111b"
                    implicitHeight: delegateItemcontent.height + 24
                    implicitWidth: 400
                    radius: 16

                    Rectangle {
                        id: notificationBackground
                        height: parent.height
                        width: parent.width
                        radius: 16
                        color: "#313244"
                        border.width: 2
                        border.color: delegateItem.modelData.urgency == NotificationUrgency.Critical ? "#f38ba8" : "#cba6f7"

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: enabled ? Qt.PointingHandCursor : Qt.ArrowCursor
                            hoverEnabled: true
                            enabled: delegateItem.modelData.actions.length > 0 && delegateItem.modelData.actions[0].identifier == "default" // qmllint disable unresolved-type

                            onEntered: {
                                notificationBackground.color = "#cc313244";
                            }

                            onExited: {
                                notificationBackground.color = "#313244";
                            }

                            onClicked: {
                                if (delegateItem.modelData.actions.length > 0 && delegateItem.modelData.actions[0].identifier == "default") { // qmllint disable unresolved-type
                                    delegateItem.modelData.actions[0].invoke(); // qmllint disable unresolved-type

                                    const index = ToplevelManager.toplevels.values.findIndex(item => item.appId == delegateItem.modelData.appName);

                                    if (index != -1) {
                                        ToplevelManager.toplevels.values[index].activate();
                                    }
                                }
                            }
                        }

                        ColumnLayout {
                            id: delegateItemcontent
                            width: parent.width - 24
                            anchors.centerIn: parent
                            spacing: 10

                            RowLayout {
                                spacing: 10

                                IconImage {
                                    source: getIcon(delegateItem.modelData.appIcon, delegateItem.modelData.image)
                                    implicitSize: 64

                                    function getIcon(appIcon, image) {
                                        if (image != "") {
                                            return image;
                                        } else if (appIcon != "") {
                                            return Quickshell.iconPath(appIcon, "bell");
                                        } else {
                                            return Quickshell.iconPath("bell");
                                        }
                                    }

                                    IconImage {
                                        source: getIcon(delegateItem.modelData.appIcon, delegateItem.modelData.image)
                                        implicitSize: 24
                                        anchors.right: parent.right
                                        anchors.bottom: parent.bottom
                                        anchors.rightMargin: -5

                                        function getIcon(appIcon, image) {
                                            if (image != "" && appIcon != "") {
                                                return Quickshell.iconPath(appIcon, "bell");
                                            } else {
                                                return "";
                                            }
                                        }
                                    }
                                }

                                ColumnLayout {
                                    Layout.fillWidth: true

                                    Text {
                                        text: delegateItem.modelData.summary
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 14
                                        color: delegateItem.modelData.urgency == NotificationUrgency.Critical ? "#f38ba8" : "#cba6f7"
                                        font.bold: true
                                        Layout.fillWidth: true
                                        visible: delegateItem.modelData.body != ""
                                        elide: Text.ElideRight
                                    }

                                    Text {
                                        text: delegateItem.modelData.body != "" ? delegateItem.modelData.body : delegateItem.modelData.summary
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 14
                                        color: "#cdd6f4"
                                        font.bold: true
                                        Layout.fillWidth: true
                                        Layout.fillHeight: delegateItem.modelData.body != ""
                                        wrapMode: Text.Wrap
                                        maximumLineCount: 5
                                        elide: Text.ElideRight
                                    }
                                }

                                Button {
                                    implicitWidth: 24
                                    implicitHeight: 24
                                    Layout.alignment: Qt.AlignTop

                                    contentItem: Text {
                                        text: ""
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 14
                                        color: "#cdd6f4"
                                        font.bold: true
                                        horizontalAlignment: Text.AlignHCenter
                                        verticalAlignment: Text.AlignVCenter
                                    }

                                    background: Rectangle {
                                        id: closeButtonBackground
                                        color: "#f38ba8"
                                        radius: 3
                                    }

                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        hoverEnabled: true

                                        onEntered: {
                                            closeButtonBackground.color = "#ccf38ba8";
                                        }

                                        onExited: {
                                            closeButtonBackground.color = "#f38ba8";
                                        }

                                        onClicked: {
                                            NotificationsService.dismiss(delegateItem.modelData, true);
                                        }
                                    }
                                }
                            }

                            RowLayout {
                                spacing: 10
                                uniformCellSizes: true

                                Repeater {
                                    model: delegateItem.modelData.actions.filter(action => action.identifier != "default") // qmllint disable unresolved-type
                                    delegate: Button {
                                        id: delegateActionItem

                                        required property NotificationAction modelData

                                        Layout.fillWidth: true

                                        contentItem: Text {
                                            text: delegateActionItem.modelData.text
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 14
                                            color: "#cdd6f4"
                                            font.bold: true
                                            horizontalAlignment: Text.AlignHCenter
                                            verticalAlignment: Text.AlignVCenter
                                        }

                                        background: Rectangle {
                                            id: actionButtonBackground
                                            color: "#45475a"
                                            radius: 6
                                        }

                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            hoverEnabled: true

                                            onEntered: {
                                                actionButtonBackground.color = "#cc45475a";
                                            }

                                            onExited: {
                                                actionButtonBackground.color = "#45475a";
                                            }

                                            onClicked: {
                                                delegateActionItem.modelData.invoke();

                                                const index = ToplevelManager.toplevels.values.findIndex(item => item.appId == delegateItem.modelData.appName);

                                                if (index != -1) {
                                                    ToplevelManager.toplevels.values[index].activate();
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
        }
    }
}
