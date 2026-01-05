pragma ComponentBehavior: Bound
import Quickshell
import Quickshell.Widgets
import Quickshell.Services.Pipewire
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls

ColumnLayout {
    spacing: 10
    width: parent.width

    Repeater {
        model: Pipewire.nodes.values.filter(n => n.isStream && n.audio != null).sort((a, b) => a.name.localeCompare(b.name))
        delegate: Loader {
            id: delegateItem

            required property PwNode modelData

            Layout.alignment: Qt.AlignTop
            active: !isNaN(modelData.audio.volume)
            height: 84
            visible: active
            Layout.fillWidth: true

            PwObjectTracker {
                objects: [delegateItem.modelData]
            }

            sourceComponent: Rectangle {
                color: "#313244"
                radius: 12

                width: parent.width
                height: parent.height

                RowLayout {
                    width: parent.width - 24
                    height: parent.height - 24
                    anchors.centerIn: parent
                    spacing: 10

                    IconImage {
                        source: Quickshell.iconPath(delegateItem.modelData.name.toLocaleLowerCase(), "applications-multimedia")
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

                        RowLayout {
                            spacing: 10

                            Button {
                                implicitWidth: 32
                                implicitHeight: 32

                                contentItem: Text {
                                    text: getIcon(delegateItem.modelData)
                                    font.family: "Font Awesome 7 Free Solid"
                                    font.pixelSize: 16
                                    color: getColor(delegateItem.modelData)
                                    horizontalAlignment: Text.AlignHCenter
                                    verticalAlignment: Text.AlignVCenter

                                    function getIcon(app) {
                                        if (isNaN(app.audio.volume)) {
                                            return "";
                                        } else if (app.audio.muted) {
                                            return "";
                                        } else {
                                            const icons = {
                                                65: "",
                                                33: "",
                                                1: "",
                                                0: ""
                                            };

                                            const volume = Math.round(app.audio.volume * 100);
                                            const icon = [65, 33, 1, 0].find(threshold => threshold <= volume);

                                            return icons[icon];
                                        }
                                    }

                                    function getColor(app) {
                                        if (app.audio.muted || isNaN(app.audio.volume)) {
                                            return "#f38ba8";
                                        } else {
                                            return "#89dceb";
                                        }
                                    }
                                }

                                background: Rectangle {
                                    id: volumeIconBackgroundRectangle
                                    color: "transparent"
                                    radius: 6
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    hoverEnabled: true

                                    onEntered: {
                                        volumeIconBackgroundRectangle.color = "#33cba6f7";
                                    }

                                    onExited: {
                                        volumeIconBackgroundRectangle.color = "transparent";
                                    }

                                    onClicked: {
                                        delegateItem.modelData.audio.muted = !delegateItem.modelData.audio.muted;
                                    }
                                }
                            }

                            Slider {
                                id: volumeSlider
                                Layout.fillWidth: true
                                from: 0
                                to: 1
                                value: delegateItem.modelData.audio.volume
                                implicitHeight: 14

                                handle: Rectangle {
                                    id: volumeSliderHandle
                                    x: volumeSlider.leftPadding + volumeSlider.visualPosition * (volumeSlider.availableWidth - width)
                                    implicitWidth: volumeSlider.height
                                    implicitHeight: volumeSlider.height
                                    radius: volumeSlider.height / 2
                                    opacity: 0
                                }

                                background: Rectangle {
                                    id: volumeSliderBackground
                                    x: (volumeSlider.width - width) / 2
                                    y: (volumeSlider.height - height) / 2
                                    width: volumeSlider.width
                                    height: volumeSlider.height
                                    radius: volumeSlider.height / 2
                                    color: "#1e1e2e"

                                    Rectangle {
                                        id: volumeSliderBackgroundFill
                                        anchors.left: parent.left
                                        width: Math.max(volumeSlider.leftPadding + volumeSlider.visualPosition * (volumeSlider.availableWidth - volumeSlider.height) + volumeSlider.height, volumeSlider.height)

                                        height: parent.height
                                        radius: parent.radius
                                        color: "#cba6f7"
                                    }

                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        hoverEnabled: true

                                        onEntered: {
                                            volumeSliderBackground.color = "#181825";
                                        }

                                        onExited: {
                                            volumeSliderBackground.color = "#1e1e2e";
                                        }
                                    }
                                }

                                onValueChanged: {
                                    delegateItem.modelData.audio.volume = value;
                                }
                            }

                            Item {
                                implicitHeight: volumeText.height
                                implicitWidth: 32

                                Text {
                                    id: volumeText
                                    text: getVolume(delegateItem.modelData)
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 14
                                    font.bold: true
                                    color: "#cdd6f4"
                                    anchors.centerIn: parent

                                    function getVolume(app) {
                                        if (isNaN(app.audio.volume)) {
                                            return "";
                                        } else {
                                            const volume = Math.round(app.audio.volume * 100);

                                            return `${volume}%`;
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
