import Quickshell.Services.Pipewire
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls

Rectangle {
    id: audio

    Layout.fillHeight: true
    radius: 12
    color: "#313244"
    implicitWidth: content.width

    PwObjectTracker {
        objects: [Pipewire.defaultAudioSink, Pipewire.defaultAudioSource]
    }

    RowLayout {
        id: content
        height: parent.height
        spacing: 0

        Button {
            id: sinkButton
            Layout.fillHeight: true

            property string color: getColor(Pipewire.defaultAudioSink)

            function getColor(sink) {
                if (sink == null || sink.description == "Dummy Output" || sink.audio.muted || isNaN(sink.audio.volume)) {
                    return "#f38ba8";
                } else {
                    return "#89dceb";
                }
            }

            contentItem: Row {
                spacing: 6
                leftPadding: 7
                rightPadding: 5

                Text {
                    text: getVolume(Pipewire.defaultAudioSink)
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 14
                    font.bold: true
                    color: sinkButton.color
                    anchors.verticalCenter: parent.verticalCenter

                    function getVolume(sink) {
                        if (sink == null || sink.description == "Dummy Output" || sink.audio.muted || isNaN(sink.audio.volume)) {
                            return "";
                        } else {
                            const volume = Math.round(sink.audio.volume * 100);

                            return `${volume}%`;
                        }
                    }
                }

                Text {
                    text: getIcon(Pipewire.defaultAudioSink)
                    font.family: "Font Awesome 7 Free Solid"
                    font.pixelSize: 14
                    color: sinkButton.color
                    anchors.verticalCenter: parent.verticalCenter

                    function getIcon(sink) {
                        if (sink == null || sink.description == "Dummy Output" || isNaN(sink.audio.volume)) {
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
                }
            }

            background: Rectangle {
                color: getColor(sinkButtonMouseArea.containsMouse, Pipewire.defaultAudioSink)
                radius: 12

                function getColor(containsMouse, sink) {
                    if (containsMouse) {
                        if (sink == null || sink.description == "Dummy Output" || sink.audio.muted || isNaN(sink.audio.volume)) {
                            return "#33f38ba8";
                        } else {
                            return "#3389dceb";
                        }
                    } else {
                        return "#313244";
                    }
                }
            }

            MouseArea {
                id: sinkButtonMouseArea
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                hoverEnabled: true
                acceptedButtons: Qt.LeftButton | Qt.RightButton

                onClicked: function (mouse) {
                    switch (mouse.button) {
                    case Qt.LeftButton:
                        print("Left");
                        break;
                    case Qt.RightButton:
                        Pipewire.defaultAudioSink.audio.muted = !Pipewire.defaultAudioSink.audio.muted;
                        break;
                    }
                }
            }
        }

        Rectangle {
            implicitHeight: 20
            implicitWidth: 2
            color: "#45475a"
            radius: 2
        }

        Button {
            id: sourceButton
            Layout.fillHeight: true

            property string color: getColor(Pipewire.defaultAudioSource)

            function getColor(source) {
                if (source == null || source.description == "Dummy Output" || source.audio.muted || isNaN(source.audio.volume)) {
                    return "#f38ba8";
                } else {
                    return "#89dceb";
                }
            }

            contentItem: Row {
                spacing: 6
                leftPadding: 8
                rightPadding: 8

                Text {
                    text: getVolume(Pipewire.defaultAudioSource)
                    font.family: "JetBrainsMono Nerd Font"
                    font.pixelSize: 14
                    font.bold: true
                    color: sourceButton.color
                    anchors.verticalCenter: parent.verticalCenter

                    function getVolume(source) {
                        if (source == null || source.description == "Dummy Output" || source.audio.muted || isNaN(source.audio.volume)) {
                            return "";
                        } else {
                            const volume = Math.round(source.audio.volume * 100);

                            return `${volume}%`;
                        }
                    }
                }

                Text {
                    text: getIcon(Pipewire.defaultAudioSource)
                    font.pixelSize: 14
                    color: sourceButton.color
                    anchors.verticalCenter: parent.verticalCenter

                    function getIcon(source) {
                        if (source == null || source.description == "Dummy Output" || isNaN(source.audio.volume)) {
                            return "";
                        } else if (source.audio.muted) {
                            return "󰍭";
                        } else {
                            return "󰍬";
                        }
                    }
                }
            }

            background: Rectangle {
                color: getColor(sourceButtonMouseArea.containsMouse, Pipewire.defaultAudioSource)
                radius: 12

                function getColor(containsMouse, source) {
                    if (containsMouse) {
                        if (source == null || source.description == "Dummy Output" || source.audio.muted || isNaN(source.audio.volume)) {
                            return "#33f38ba8";
                        } else {
                            return "#3389dceb";
                        }
                    } else {
                        return "#313244";
                    }
                }
            }

            MouseArea {
                id: sourceButtonMouseArea
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                hoverEnabled: true
                acceptedButtons: Qt.LeftButton | Qt.RightButton

                onClicked: function (mouse) {
                    switch (mouse.button) {
                    case Qt.LeftButton:
                        print("Left");
                        break;
                    case Qt.RightButton:
                        Pipewire.defaultAudioSource.audio.muted = !Pipewire.defaultAudioSource.audio.muted;
                        break;
                    }
                }
            }
        }
    }
}
