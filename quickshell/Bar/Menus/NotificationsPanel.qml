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
    id: notificationsPanel
    visible: PanelStateService.notificationsPanelVisible
    aboveWindows: true
    color: "transparent"
    exclusionMode: ExclusionMode.Normal
    implicitWidth: content.width + 24

    // qmllint disable unresolved-type unqualified missing-property
    margins {
        top: 10
        bottom: 10
        right: 10
    }
    // qmllint enable unresolved-type unqualified missing-property

    anchors {
        top: true
        bottom: true
        right: true
    }

    Rectangle {
        color: "#1e1e2e"
        width: content.width + 24
        height: parent.height
        radius: 12
        border.width: 2
        border.color: "#cba6f7"

        ColumnLayout {
            id: content
            anchors.fill: parent
            anchors.margins: 12
            spacing: 10
            width: 400

            Rectangle {
                Layout.fillWidth: true
                implicitHeight: 64
                color: "#313244"
                radius: 12

                Text {
                    text: "Notifications"
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 16
                    color: "#cdd6f4"
                    font.bold: true
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.left: parent.left
                    anchors.leftMargin: 10
                }

                Button {
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.right: parent.right
                    anchors.rightMargin: 10

                    contentItem: Text {
                        text: "Clear"
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 14
                        color: "#cdd6f4"
                        font.bold: true
                        anchors.leftMargin: 10
                        padding: 3
                    }

                    background: Rectangle {
                        id: clearButtonBackground
                        color: "#f38ba8"
                        radius: 6
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        hoverEnabled: true

                        onEntered: {
                            clearButtonBackground.color = "#ccf38ba8";
                        }

                        onExited: {
                            clearButtonBackground.color = "#f38ba8";
                        }

                        onClicked: {
                            NotificationsService.dismissAll();
                            PanelStateService.notificationsPanelVisible = false
                        }
                    }
                }
            }

            ScrollView {
                Layout.fillWidth: true
                Layout.fillHeight: true

                ColumnLayout {
                    spacing: 10

                    Repeater {
                        model: NotificationsService.mergedNotifications
                        delegate: Rectangle {
                            id: delegateItem

                            required property Notification modelData
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
                                                PanelStateService.notificationsPanelVisible = false
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
                                            source: getIcon(delegateItem.modelData.appIcon, delegateItem.modelData.image, delegateItem.modelData.appName.toLocaleLowerCase())
                                            implicitSize: 64

                                            function getIcon(appIcon, image, appName) {
                                                if (image != "" && Quickshell.iconPath(image, true)) {
                                                    return image;
                                                } else if (appIcon != "" && Quickshell.iconPath(appIcon, true)) {
                                                    return Quickshell.iconPath(appIcon);
                                                } else if (Quickshell.iconPath(appName, true)) {
                                                    return Quickshell.iconPath(appName);
                                                } else {
                                                    return Quickshell.iconPath("bell");
                                                }
                                            }

                                            IconImage {
                                                source: getIcon(delegateItem.modelData.appIcon, delegateItem.modelData.image, delegateItem.modelData.appName.toLocaleLowerCase())
                                                implicitSize: 24
                                                anchors.right: parent.right
                                                anchors.bottom: parent.bottom
                                                anchors.rightMargin: -5

                                                function getIcon(appIcon, image, appName) {
                                                    if (image != "" && Quickshell.iconPath(appIcon, true)) {
                                                        if (appIcon != "" && Quickshell.iconPath(appIcon, true)) {
                                                            return Quickshell.iconPath(appIcon);
                                                        } else if (Quickshell.iconPath(appName, true)) {
                                                            return Quickshell.iconPath(appName);
                                                        }
                                                    }

                                                    return "";
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
                                        visible: delegateItem.modelData.actions.filter(action => action.identifier != "default").length > 0 // qmllint disable unresolved-type

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
                                                            PanelStateService.notificationsPanelVisible = false
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
    }
}
