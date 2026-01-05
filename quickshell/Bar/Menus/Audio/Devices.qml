pragma ComponentBehavior: Bound
import Quickshell
import Quickshell.Widgets
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import qs.Services
import qs.Types

ColumnLayout {
    id: devices
    spacing: 10
    width: parent.width

    required property PanelWindow window

    Repeater {
        model: AudioCardsService.list
        delegate: Rectangle {
            id: delegateItem

            required property AudioCardInfos modelData

            color: "#313244"
            radius: 12
            Layout.alignment: Qt.AlignTop
            height: 84
            Layout.fillWidth: true

            RowLayout {
                width: parent.width - 24
                height: parent.height - 24
                anchors.centerIn: parent
                spacing: 10

                IconImage {
                    source: Quickshell.iconPath("audio-card")
                    implicitSize: 48
                }

                ColumnLayout {
                    spacing: 10

                    Flickable {
                        id: titleScroll
                        Layout.fillWidth: true
                        implicitHeight: titleText.height
                        contentWidth: titleText.width
                        flickableDirection: Flickable.HorizontalFlick
                        clip: true

                        property bool direction: false

                        Text {
                            id: titleText
                            text: delegateItem.modelData.name
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 14
                            color: "#cba6f7"
                            font.bold: true
                            horizontalAlignment: Text.AlignHCenter
                            verticalAlignment: Text.AlignVCenter
                        }

                        Timer {
                            id: titleScrollTimer
                            interval: 10
                            running: (titleScroll.contentX <= titleScroll.contentWidth - titleScroll.width && titleScroll.direction) || (titleScroll.contentX > 0 && !titleScroll.direction)
                            repeat: true
                            onTriggered: {
                                if (titleScroll.direction) {
                                    if (titleScroll.contentX <= titleScroll.contentWidth - titleScroll.width) {
                                        titleScroll.contentX += 1;
                                    }
                                } else {
                                    if (titleScroll.contentX > 0) {
                                        titleScroll.contentX -= 1;
                                    }
                                }
                            }
                        }

                        MouseArea {
                            anchors.fill: parent
                            hoverEnabled: true

                            onEntered: {
                                titleScroll.direction = true;
                            }

                            onExited: {
                                titleScroll.direction = false;
                            }
                        }
                    }

                    Text {
                        Layout.fillHeight: true
                        text: "Profile: " + delegateItem.modelData.activeProfile
                        font.family: "JetBrainsMono Nerd Font"
                        font.pixelSize: 12
                        color: "#a6adc8"
                        font.bold: true
                        Layout.maximumWidth: 300
                        maximumLineCount: 2
                        wrapMode: Text.Wrap
                    }
                }

                Button {
                    id: settingsButton
                    implicitWidth: 36
                    implicitHeight: 36

                    contentItem: Text {
                        text: ""
                        font.family: "Font Awesome 7 Free Solid"
                        font.pixelSize: 14
                        color: "#cdd6f4"
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }

                    background: Rectangle {
                        id: settingsButtonBackground
                        color: "#45475a"
                        radius: 6
                    }

                    PopupWindow {
                        id: settingsPopup

                        property var buttonPos: settingsButton.mapToItem(null, 0, 0)

                        anchor.window: devices.window
                        anchor.rect.x: buttonPos.x
                        anchor.rect.y: buttonPos.y + settingsButton.height + 6
                        implicitWidth: popupContent.width + 12
                        implicitHeight: popupContent.height + 12
                        visible: false
                        color: "transparent"

                        Rectangle {
                            color: "#313244"
                            border.width: 1
                            border.color: "#cba6f7"
                            width: popupContent.width + 12
                            height: popupContent.height + 12
                            radius: 12

                            ColumnLayout {
                                id: popupContent

                                anchors.centerIn: parent

                                Repeater {
                                    model: delegateItem.modelData.profiles
                                    delegate: Button {
                                        id: popupDelegateItem

                                        required property string modelData
                                        Layout.fillWidth: true

                                        contentItem: RowLayout {
                                            width: parent.width
                                            height: parent.height

                                            CheckBox {
                                                id: defaultCheck
                                                checked: popupDelegateItem.modelData == delegateItem.modelData.activeProfile
                                                implicitHeight: 20
                                                implicitWidth: 20

                                                Layout.alignment: Qt.AlignLeft

                                                indicator: Rectangle {
                                                    id: defaultCheckIndicatorRectangle
                                                    width: 20
                                                    height: 20
                                                    anchors.centerIn: parent
                                                    color: defaultCheck.checked ? "#cba6f7" : "#6c7086"
                                                    radius: 10

                                                    Behavior on color {
                                                        ColorAnimation {
                                                            duration: 50
                                                        }
                                                    }

                                                    Text {
                                                        opacity: defaultCheck.checked ? 1 : 0
                                                        text: ""
                                                        color: "#313244"
                                                        font.family: "Font Awesome 7 Free"
                                                        font.pixelSize: 14
                                                        anchors.centerIn: parent

                                                        Behavior on opacity {
                                                            NumberAnimation {
                                                                duration: 50
                                                                easing.type: Easing.InOutQuad
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                            Text {
                                                id: profileText
                                                text: popupDelegateItem.modelData
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 13
                                                color: "#cdd6f4"
                                                font.bold: true
                                                padding: 3
                                                Layout.fillWidth: true
                                            }
                                        }

                                        background: Rectangle {
                                            id: profileButtonBackground
                                            color: "#45475a"
                                            radius: 6
                                        }

                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            hoverEnabled: true

                                            onEntered: {
                                                profileButtonBackground.color = "#cc45475a";
                                            }

                                            onExited: {
                                                profileButtonBackground.color = "#45475a";
                                            }

                                            onClicked: {
                                                settingsPopup.visible = false;
                                                Quickshell.execDetached(["bash", "-c", `pactl set-card-profile ${delegateItem.modelData.id} '${popupDelegateItem.modelData}'`]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        hoverEnabled: true

                        onEntered: {
                            settingsButtonBackground.color = "#cc45475a";
                        }

                        onExited: {
                            settingsButtonBackground.color = "#45475a";
                        }

                        onClicked: {
                            settingsPopup.buttonPos = settingsButton.mapToItem(null, 0, 0);
                            settingsPopup.visible = !settingsPopup.visible;
                        }
                    }
                }
            }
        }
    }
}
