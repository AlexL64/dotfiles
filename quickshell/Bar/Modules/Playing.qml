pragma ComponentBehavior: Bound
import Quickshell.Services.Mpris
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls

Rectangle {
    id: playing

    Layout.fillHeight: true
    radius: 12
    color: "#313244"
    implicitWidth: content.width
    visible: content.active

    property MprisPlayer player: getPlayer(Mpris.players)

    function getPlayer(players) {
        if (players.values.length > 0) {
            for (let i = 0; i < players.values.length; i++) {
                if (players.values[i].dbusName == "org.mpris.MediaPlayer2.playerctld") {
                    return players.values[i];
                }
            }
        }

        return null;
    }

    Loader {
        id: content
        active: playing.player != null && playing.player.canControl && playing.player.trackTitle != ""
        sourceComponent: Row {
            Button {
                implicitHeight: 36
                implicitWidth: 36

                contentItem: Text {
                    text: getIcon(playing.player.canPlay, playing.player.canPause, playing.player.playbackState)
                    font.family: "Font Awesome 7 Free"
                    font.pixelSize: 16
                    color: "#cdd6f4"
                    font.bold: true
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter

                    function getIcon(canPlay, canPause, state) {
                        if (canPlay && state == MprisPlaybackState.Paused) {
                            return "";
                        } else if (canPause && MprisPlaybackState.Playing) {
                            return "";
                        } else {
                            return "";
                        }
                    }
                }

                background: Rectangle {
                    id: playPauseBackgroundRectangle
                    color: "#313244"
                    radius: 12
                    border.width: 1
                    border.color: "#cba6f7"
                }

                onHoveredChanged: {
                    if (hovered) {
                        playPauseBackgroundRectangle.color = "#33cba6f7";
                    } else {
                        playPauseBackgroundRectangle.color = "#313244";
                    }
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    hoverEnabled: true

                    onClicked: {
                        playing.player.togglePlaying();
                    }
                }
            }

            Button {
                implicitHeight: 36
                leftPadding: 12
                rightPadding: 12

                contentItem: Row {
                    height: 36
                    spacing: 10

                    ColumnLayout {
                        Flickable {
                            id: titleScroll
                            Layout.minimumWidth: Math.min(Math.max(titleText.width, 100), 200)
                            Layout.topMargin: -3
                            implicitHeight: titleText.height
                            contentWidth: titleText.width
                            flickableDirection: Flickable.HorizontalFlick
                            clip: true

                            property bool direction: false

                            Text {
                                id: titleText
                                text: playing.player.trackTitle
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 12
                                color: "#cdd6f4"
                                font.bold: true
                            }

                            Timer {
                                id: titleScrollTimer
                                interval: 25
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
                        }

                        Flickable {
                            id: artistScroll
                            Layout.minimumWidth: Math.min(artistText.width, titleScroll.width - 10)
                            Layout.topMargin: -5
                            implicitHeight: artistText.height
                            contentWidth: artistText.width
                            flickableDirection: Flickable.HorizontalFlick
                            clip: true

                            property bool direction: false

                            Text {
                                id: artistText
                                text: playing.player.trackArtist
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 11
                                color: "#cba6f7"
                                font.bold: true
                                Layout.topMargin: -5
                            }

                            Timer {
                                id: artistScrollTimer
                                interval: 25
                                running: (artistScroll.contentX <= artistScroll.contentWidth - artistScroll.width && artistScroll.direction) || (artistScroll.contentX > 0 && !artistScroll.direction)
                                repeat: true
                                onTriggered: {
                                    if (artistScroll.direction) {
                                        if (artistScroll.contentX <= artistScroll.contentWidth - artistScroll.width) {
                                            artistScroll.contentX += 1;
                                        }
                                    } else {
                                        if (artistScroll.contentX > 0) {
                                            artistScroll.contentX -= 1;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    Row {
                        id: time
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: 3

                        function formatTime(seconds) {
                            seconds = Math.trunc(seconds);

                            const hours = Math.floor(seconds / 3600);
                            const minutes = Math.floor((seconds % 3600) / 60);
                            const remainingSeconds = seconds % 60;

                            const timeParts = [];

                            if (hours > 0) {
                                timeParts.push(hours);
                                timeParts.push(minutes.toString().padStart(2, '0'));
                                timeParts.push(remainingSeconds.toString().padStart(2, '0'));
                            } else {
                                timeParts.push(minutes);
                                timeParts.push(remainingSeconds.toString().padStart(2, '0'));
                            }

                            return timeParts.join(':');
                        }
                        Text {
                            text: time.formatTime(playing.player.position)
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 12
                            color: "#cdd6f4"
                            font.bold: true
                            Layout.topMargin: -3

                            Timer {
                                running: playing.player.playbackState == MprisPlaybackState.Playing
                                interval: 1000
                                repeat: true
                                onTriggered: playing.player.positionChanged()
                            }
                        }

                        Text {
                            text: "/"
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 12
                            color: "#cdd6f4"
                            font.bold: true
                            Layout.topMargin: -3
                        }

                        Text {
                            text: time.formatTime(playing.player.length)
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 12
                            color: "#cdd6f4"
                            font.bold: true
                            Layout.topMargin: -3
                        }
                    }
                }

                background: Rectangle {
                    id: infosBackgroundRectangle
                    color: "#313244"
                    radius: 12
                }

                onHoveredChanged: {
                    if (hovered) {
                        infosBackgroundRectangle.color = "#33cba6f7";
                    } else {
                        infosBackgroundRectangle.color = "#313244";
                    }
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    hoverEnabled: true

                    onEntered: {
                        if (titleScroll.width == 200) {
                            titleScroll.direction = true;
                        }

                        if (artistScroll.width == titleScroll.width - 10) {
                            artistScroll.direction = true;
                        }
                    }

                    onExited: {
                        titleScroll.direction = false;
                        artistScroll.direction = false;
                    }

                    onClicked: {
                        print("Clicked");
                    }
                }
            }
        }
    }
}
