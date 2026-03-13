pragma ComponentBehavior: Bound
import Quickshell.Services.Pipewire
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls

ColumnLayout {
    spacing: 10
    width: parent.width

    PwObjectTracker {
        objects: [Pipewire.defaultAudioSink]
    }

    Repeater {
        id: test
        model: Pipewire.nodes.values.filter(n => n.isSink && !n.isStream && n.audio != null).sort((a, b) => {
            if (a === Pipewire.defaultAudioSink)
                return -1;
            if (b === Pipewire.defaultAudioSink)
                return 1;
            return a.description.localeCompare(b.description);
        })
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

                ColumnLayout {
                    width: parent.width - 24
                    height: parent.height - 24
                    anchors.centerIn: parent
                    spacing: 10

                    RowLayout {
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
                                text: delegateItem.modelData.description
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

                        CheckBox {
                            id: defaultCheck
                            checked: delegateItem.modelData == Pipewire.defaultAudioSink
                            implicitHeight: 20
                            implicitWidth: 20

                            Layout.alignment: Qt.AlignRight

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

                            background: Rectangle {
                                id: defaultCheckBackgroundRectangle
                                width: 20
                                height: 20
                                anchors.centerIn: parent
                                color: "#45475a"
                                radius: 10

                                Behavior on scale {
                                    ScaleAnimator {
                                        duration: 100
                                        easing.type: Easing.InOutQuad
                                    }
                                }
                            }

                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                hoverEnabled: true

                                onEntered: {
                                    defaultCheckBackgroundRectangle.scale = 1.4;
                                }

                                onExited: {
                                    defaultCheckBackgroundRectangle.scale = 1;
                                }

                                onClicked: {
                                    Pipewire.preferredDefaultAudioSink = delegateItem.modelData;
                                }
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

                                function getIcon(sink) {
                                    if (isNaN(sink.audio.volume)) {
                                        return "";
                                    } else if (sink.audio.muted) {
                                        return "";
                                    } else {
                                        const icons = {
                                            65: "",
                                            33: "",
                                            1: "",
                                            0: ""
                                        };

                                        const volume = Math.round(sink.audio.volume * 100);
                                        const icon = [65, 33, 1, 0].find(threshold => threshold <= volume);

                                        return icons[icon];
                                    }
                                }

                                function getColor(sink) {
                                    if (sink.audio.muted || isNaN(sink.audio.volume)) {
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

                                function getVolume(sink) {
                                    if (isNaN(sink.audio.volume)) {
                                        return "";
                                    } else {
                                        const volume = Math.round(sink.audio.volume * 100);

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
