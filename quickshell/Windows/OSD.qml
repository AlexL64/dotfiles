import Quickshell
import Quickshell.Wayland
import Quickshell.Bluetooth
import Quickshell.Services.Pipewire
import QtQuick
import QtQuick.Layouts
import qs.Services

PanelWindow { // qmllint disable uncreatable-type
    id: osd
    visible: false
    exclusionMode: ExclusionMode.Ignore
    focusable: false
    color: "transparent"
    implicitWidth: content.width + 2
    implicitHeight: content.height + 2
    WlrLayershell.layer: WlrLayer.Overlay

    anchors {
        bottom: true
    }

    // qmllint disable unresolved-type unqualified missing-property
    margins {
        bottom: 250
    }
    // qmllint enable unresolved-type unqualified missing-property

    PwObjectTracker {
        objects: [Pipewire.defaultAudioSink, Pipewire.defaultAudioSource]
    }

    property string value: ""
    property string icon: ""
    property string textColor: ""
    property string fontFamily: ""

    property real sinkVolume: Pipewire.defaultAudioSink.audio.volume
    property bool sinkMuted: Pipewire.defaultAudioSink.audio.muted
    property real sourceVolume: Pipewire.defaultAudioSource.audio.volume
    property bool sourceMuted: Pipewire.defaultAudioSource.audio.muted
    property real brightness: BrightnessService.actualValue

    onSinkVolumeChanged: {
        value = `${Math.round(sinkVolume * 100)}%`;
        icon = getSinkIcon(sinkVolume, sinkMuted);
        textColor = getSinkSourceColor(sinkVolume, sinkMuted);
        fontFamily = "Font Awesome 7 Free Solid";
    }
    onSinkMutedChanged: {
        value = `${Math.round(sinkVolume * 100)}%`;
        icon = getSinkIcon(sinkVolume, sinkMuted);
        textColor = getSinkSourceColor(sinkVolume, sinkMuted);
        fontFamily = "Font Awesome 7 Free Solid";
    }
    onSourceVolumeChanged: {
        value = `${Math.round(sourceVolume * 100)}%`;
        icon = getSourceIcon(sourceVolume, sourceMuted);
        textColor = getSinkSourceColor(sourceVolume, sourceMuted);
        fontFamily = "Font Awesome 7 Free Solid";
    }
    onSourceMutedChanged: {
        value = `${Math.round(sourceVolume * 100)}%`;
        icon = getSourceIcon(sourceVolume, sourceMuted);
        textColor = getSinkSourceColor(sourceVolume, sourceMuted);
        fontFamily = "Font Awesome 7 Free Solid";
    }
    onBrightnessChanged: {
        value = `${brightness}%`;
        icon = getBrightnessIcon(brightness);
        textColor = "#f9e2af";
        fontFamily = "Material Icons";
    }

    onValueChanged: {
        if (elapsedTimer.elapsed() > 1) {
            if (osdTimer.running) {
                osdTimer.restart();
            } else {
                osd.visible = true;
                osdTimer.start();
            }
        }
    }

    onIconChanged: {
        if (elapsedTimer.elapsed() > 1) {
            if (osdTimer.running) {
                osdTimer.restart();
            } else {
                osd.visible = true;
                osdTimer.start();
            }
        }
    }

    function getSinkIcon(volume, muted) {
        if (muted) {
            return "";
        } else if (!isNaN(volume)) {
            const icons = {
                65: "",
                33: "",
                1: "",
                0: ""
            };

            volume = Math.round(volume * 100);
            const icon = [65, 33, 1, 0].find(threshold => threshold <= volume);

            const isBluetooth = Bluetooth.devices.values.some(d => d.deviceName == Pipewire.defaultAudioSink.description); // qmllint disable unresolved-type

            if (isBluetooth) {
                return `${icons[icon]} `;
            } else {
                return icons[icon];
            }
        } else {
            return "";
        }
    }

    function getSourceIcon(volume, muted) {
        if (muted) {
            return "";
        } else if (!isNaN(volume)) {
            return "󰍭";
        } else {
            return "";
        }
    }

    function getSinkSourceColor(volume, muted) {
        if (muted || isNaN(volume)) {
            return "#f38ba8";
        } else {
            return "#89dceb";
        }
    }

    function getBrightnessIcon(brightness) {
        const icons = {
            84: "\ue3ac",
            70: "\ue3ab",
            56: "\ue3aa",
            42: "\ue3a9",
            28: "\ue3a8",
            14: "\ue3a7",
            0: "\ue3a6"
        };

        return icons[[84, 70, 56, 42, 28, 14, 0].find(threshold => threshold <= brightness)];
    }

    Timer {
        id: osdTimer
        interval: 1000
        running: false
        repeat: false
        onTriggered: osd.visible = false
    }

    ElapsedTimer {
        id: elapsedTimer
    }

    Rectangle {
        id: content
        width: 128
        height: 48
        anchors.centerIn: parent
        radius: 12
        color: "#313244"
        border.width: 1
        border.color: "#cba6f7"

        RowLayout {
            anchors.centerIn: parent
            spacing: 6

            Text {
                text: osd.value
                font.family: "JetBrainsMono Nerd Font"
                font.pixelSize: 16
                color: osd.textColor
                font.bold: true
            }

            Text {
                text: osd.icon
                font.family: osd.fontFamily
                font.pixelSize: 16
                color: osd.textColor
                font.bold: true
            }
        }
    }
}
