pragma ComponentBehavior: Bound
import Quickshell
import Quickshell.Io
import Quickshell.Services.UPower
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import qs.Services

PanelWindow { //qmllint disable uncreatable-type
    id: battery
    aboveWindows: true
    color: "transparent"
    exclusionMode: ExclusionMode.Auto
    implicitWidth: content.width + 24
    implicitHeight: content.height + 24

    // qmllint disable unresolved-type unqualified missing-property
    margins {
        top: 10
        right: 208
    }
    // qmllint enable unresolved-type unqualified missing-property

    anchors {
        top: true
        right: true
    }

    required property bool idleInhibitorVisible

    Rectangle {
        color: "#1e1e2e"
        width: content.width + 24
        height: content.height + 24
        radius: 12
        border.width: 2
        border.color: "#cba6f7"

        ColumnLayout {
            id: content
            width: 350
            anchors.centerIn: parent
            spacing: 10

            Rectangle {
                Layout.fillWidth: true
                implicitHeight: mainBlockContent.height + 24
                radius: 12
                color: "#313244"
                Layout.alignment: Qt.AlignHCenter

                ColumnLayout {
                    id: mainBlockContent
                    width: parent.width - 24
                    anchors.centerIn: parent
                    spacing: 10

                    RowLayout {
                        Button {
                            implicitHeight: 36
                            implicitWidth: 56

                            contentItem: Text {
                                text: battery.idleInhibitorVisible ? "\ueb76" : "\uef44"
                                color: "#cdd6f4"
                                font.family: "Material Icons"
                                font.bold: true
                                font.pixelSize: 14
                                horizontalAlignment: Text.AlignHCenter
                                verticalAlignment: Text.AlignVCenter
                            }

                            background: Rectangle {
                                color: getColor(battery.idleInhibitorVisible, idleInhibitorButtonMouseArea.containsMouse)
                                radius: 6
                                border.width: 1
                                border.color: "#cba6f7"

                                function getColor(idleInhibitorVisible, containsMouse) {
                                    if (idleInhibitorVisible) {
                                        return containsMouse ? "#cccba6f7" : "#cba6f7";
                                    } else {
                                        return containsMouse ? "#cc45475a" : "#45475a";
                                    }
                                }
                            }

                            MouseArea {
                                id: idleInhibitorButtonMouseArea
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                hoverEnabled: true

                                onClicked: {
                                    Quickshell.execDetached(["qs", "ipc", "call", "idleInhibitor", "toggle"]);
                                }
                            }
                        }

                        Button {
                            id: batterySaverButton
                            implicitHeight: 36
                            implicitWidth: 56

                            contentItem: Text {
                                text: "\uefde"
                                color: "#cdd6f4"
                                font.family: "Material Icons"
                                font.bold: true
                                font.pixelSize: 14
                                horizontalAlignment: Text.AlignHCenter
                                verticalAlignment: Text.AlignVCenter
                            }

                            background: Rectangle {
                                color: getColor(BatterySaverService.enabled, batterySaverButtonMouseArea.containsMouse)
                                radius: 6
                                border.width: 1
                                border.color: "#cba6f7"

                                function getColor(enabled, containsMouse) {
                                    if (enabled) {
                                        return containsMouse ? "#cccba6f7" : "#cba6f7";
                                    } else {
                                        return containsMouse ? "#cc45475a" : "#45475a";
                                    }
                                }
                            }

                            MouseArea {
                                id: batterySaverButtonMouseArea
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                hoverEnabled: true

                                onClicked: {
                                    BatterySaverService.toggle();
                                }
                            }
                        }
                    }

                    Rectangle {
                        implicitWidth: parent.width
                        implicitHeight: 2
                        radius: 1
                        Layout.alignment: Qt.AlignHCenter
                        color: "#6c7086"
                    }

                    RowLayout {
                        Text {
                            text: getIcon(UPower.displayDevice.state, UPower.displayDevice.percentage * 100)
                            font.family: "Material Icons"
                            font.pixelSize: 36
                            color: "#cdd6f4"
                            font.bold: true
                            horizontalAlignment: Text.AlignHCenter
                            verticalAlignment: Text.AlignVCenter

                            function getIcon(state, battery) {
                                if (state == UPowerDeviceState.Charging) {
                                    return "\ue1a3";
                                } else if (state == UPowerDeviceState.FullyCharged) {
                                    return "\ue1a4";
                                } else if (state == UPowerDeviceState.PendingCharge) {
                                    return "\uefde";
                                } else if (state == UPowerDeviceState.Unknown) {
                                    return "\ue1a6";
                                } else {
                                    const icons = {
                                        90: "\ue1a4",
                                        75: "\uebd2",
                                        60: "\uebd4",
                                        50: "\uebe2",
                                        40: "\uebdd",
                                        30: "\uebe0",
                                        20: "\uebd9",
                                        0: "\uebdc"
                                    };

                                    return icons[[90, 75, 60, 50, 40, 30, 20, 0].find(threshold => threshold <= battery)];
                                }
                            }
                        }

                        ColumnLayout {
                            RowLayout {
                                Text {
                                    text: "Battery"
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 14
                                    color: "#cdd6f4"
                                    font.bold: true
                                }

                                Item {
                                    Layout.fillWidth: true
                                }

                                Text {
                                    text: getText(UPower.displayDevice.state)
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 14
                                    color: "#cdd6f4"
                                    font.bold: true

                                    function getText(state) {
                                        switch (state) {
                                        case UPowerDeviceState.Charging:
                                            return "Charging";
                                        case UPowerDeviceState.Discharging:
                                            return "Discharging";
                                        case UPowerDeviceState.FullyCharged:
                                            return "FullyCharged";
                                        case UPowerDeviceState.Empty:
                                            return "Empty";
                                        case UPowerDeviceState.PendingCharge:
                                            return "PendingCharge";
                                        case UPowerDeviceState.PendingDischarge:
                                            return "PendingDischarge";
                                        default:
                                            return "Unknown";
                                        }
                                    }
                                }
                            }

                            Slider {
                                id: mainBlockBatterySlider
                                Layout.fillWidth: true
                                from: 0
                                to: 1
                                value: UPower.displayDevice.percentage
                                implicitHeight: 8

                                handle: Rectangle {
                                    id: mainBlockBatterySliderHandle
                                    x: mainBlockBatterySlider.leftPadding + mainBlockBatterySlider.visualPosition * (mainBlockBatterySlider.availableWidth - width)
                                    implicitWidth: mainBlockBatterySlider.height
                                    implicitHeight: mainBlockBatterySlider.height
                                    radius: mainBlockBatterySlider.height / 2
                                    opacity: 0
                                }

                                background: Rectangle {
                                    id: mainBlockBatterySliderBackground
                                    x: (mainBlockBatterySlider.width - width) / 2
                                    y: (mainBlockBatterySlider.height - height) / 2
                                    width: mainBlockBatterySlider.width
                                    height: mainBlockBatterySlider.height
                                    radius: mainBlockBatterySlider.height / 2
                                    color: "#1e1e2e"

                                    Rectangle {
                                        id: mainBlockBatterySliderBackgroundFill
                                        anchors.left: parent.left
                                        width: Math.max(mainBlockBatterySlider.leftPadding + mainBlockBatterySlider.visualPosition * (mainBlockBatterySlider.availableWidth - mainBlockBatterySlider.height) + mainBlockBatterySlider.height, mainBlockBatterySlider.height)

                                        height: parent.height
                                        radius: parent.radius
                                        color: "#cba6f7"
                                    }
                                }
                            }

                            RowLayout {
                                Text {
                                    text: getTime(UPower.displayDevice.timeToFull, UPower.displayDevice.timeToEmpty)
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 14
                                    color: "#cdd6f4"
                                    font.bold: true

                                    function getTime(timeToFull, timeToEmpty) {
                                        if (timeToFull > 0) {
                                            return formatTime(timeToFull);
                                        }

                                        if (timeToEmpty > 0) {
                                            return formatTime(timeToEmpty);
                                        }

                                        return "";
                                    }

                                    function formatTime(seconds) {
                                        const hours = Math.floor(seconds / 3600);
                                        const minutes = Math.floor((seconds % 3600) / 60);

                                        const formattedMinutes = minutes.toString().padStart(2, '0');

                                        return `${hours}:${formattedMinutes}`;
                                    }
                                }

                                Item {
                                    Layout.fillWidth: true
                                }

                                Text {
                                    text: `${Math.round(UPower.displayDevice.percentage * 100)}%`
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 14
                                    color: "#cdd6f4"
                                    font.bold: true
                                }
                            }
                        }
                    }

                    Rectangle {
                        implicitWidth: parent.width
                        implicitHeight: 2
                        radius: 1
                        Layout.alignment: Qt.AlignHCenter
                        color: "#6c7086"
                    }

                    ColumnLayout {
                        RowLayout {
                            Layout.preferredWidth: parent.width
                            Layout.alignment: Qt.AlignHCenter

                            Text {
                                text: "Power Saver"
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 14
                                color: "#cdd6f4"
                                font.bold: true
                                Layout.alignment: Qt.AlignLeft
                            }

                            Text {
                                text: "Balanced"
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 14
                                color: "#cdd6f4"
                                font.bold: true
                                Layout.alignment: Qt.AlignHCenter
                            }

                            Text {
                                text: "Performance"
                                font.family: "JetBrainsMono Nerd Font"
                                font.pixelSize: 14
                                color: "#cdd6f4"
                                font.bold: true
                                Layout.alignment: Qt.AlignRight
                            }
                        }

                        RowLayout {
                            Layout.preferredWidth: parent.width - 18
                            Layout.alignment: Qt.AlignHCenter
                            spacing: width / 2 - (3 * 1)
                            Layout.bottomMargin: -8

                            Repeater {
                                model: 3

                                delegate: Rectangle {
                                    required property int index
                                    required property int modelData

                                    width: 2
                                    radius: width / 2
                                    height: 8
                                    color: "#6c7086"
                                }
                            }
                        }

                        Slider {
                            id: powerProfileSlider
                            Layout.fillWidth: true
                            from: 0
                            to: 2
                            stepSize: 1
                            snapMode: Slider.SnapAlways
                            value: PowerProfiles.profile
                            live: false

                            function getValue(profile) {
                                print(`Profile: ${profile}`);
                                switch (profile) {
                                case PowerProfile.Performance:
                                    return 2;
                                case PowerProfile.Balanced:
                                    return 1;
                                case PowerProfile.PowerSaver:
                                    return 0;
                                }
                            }

                            handle: Rectangle {
                                x: powerProfileSlider.leftPadding + powerProfileSlider.visualPosition * (powerProfileSlider.availableWidth - width)
                                y: powerProfileSlider.topPadding + powerProfileSlider.visualPosition * (powerProfileSlider.availableHeight - height)
                                implicitWidth: 20
                                implicitHeight: 20
                                radius: width / 2
                                color: "#1e1e2e"
                                border.width: 2
                                border.color: "#cba6f7"
                            }

                            background: Rectangle {
                                x: (powerProfileSlider.width - width) / 2
                                y: (powerProfileSlider.height - height) / 2
                                implicitWidth: powerProfileSlider.horizontal ? 200 : 1
                                implicitHeight: powerProfileSlider.horizontal ? 1 : 200
                                width: powerProfileSlider.availableWidth
                                height: 2
                                radius: height / 2
                                color: "#6c7086"

                                Rectangle {
                                    id: volumeSliderBackgroundFill
                                    anchors.left: parent.left
                                    width: Math.max(powerProfileSlider.leftPadding + powerProfileSlider.visualPosition * (powerProfileSlider.availableWidth - powerProfileSlider.height) + powerProfileSlider.height, powerProfileSlider.height)

                                    height: parent.height
                                    radius: parent.radius
                                    color: "#cba6f7"
                                }
                            }

                            onValueChanged: {
                                PowerProfiles.profile = value;
                            }
                        }
                    }
                }
            }

            Repeater {
                model: UPower.devices.values.filter(d => d.state != UPowerDeviceState.Unknown && !d.isLaptopBattery)
                delegate: Rectangle {
                    id: delegateItem

                    required property UPowerDevice modelData

                    Layout.fillWidth: true
                    implicitHeight: 64
                    radius: 12
                    color: "#313244"
                    Layout.alignment: Qt.AlignHCenter

                    RowLayout {
                        width: parent.width - 24
                        anchors.centerIn: parent

                        Text {
                            text: getIcon(delegateItem.modelData.state, delegateItem.modelData.percentage * 100)
                            font.family: "Material Icons"
                            font.pixelSize: 36
                            color: "#cdd6f4"
                            font.bold: true
                            horizontalAlignment: Text.AlignHCenter
                            verticalAlignment: Text.AlignVCenter

                            function getIcon(state, battery) {
                                if (state == UPowerDeviceState.Charging) {
                                    return "\ue1a3";
                                } else if (state == UPowerDeviceState.FullyCharged) {
                                    return "\ue1a4";
                                } else if (state == UPowerDeviceState.PendingCharge) {
                                    return "\uefde";
                                } else if (state == UPowerDeviceState.Unknown) {
                                    return "\ue1a6";
                                } else {
                                    const icons = {
                                        90: "\ue1a4",
                                        75: "\uebd2",
                                        60: "\uebd4",
                                        50: "\uebe2",
                                        40: "\uebdd",
                                        30: "\uebe0",
                                        20: "\uebd9",
                                        0: "\uebdc"
                                    };

                                    return icons[[90, 75, 60, 50, 40, 30, 20, 0].find(threshold => threshold <= battery)];
                                }
                            }
                        }

                        ColumnLayout {
                            RowLayout {
                                Text {
                                    text: delegateItem.modelData.model
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 14
                                    color: "#cdd6f4"
                                    font.bold: true
                                }

                                Item {
                                    Layout.fillWidth: true
                                }

                                Text {
                                    text: getText(delegateItem.modelData.state)
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 14
                                    color: "#cdd6f4"
                                    font.bold: true

                                    function getText(state) {
                                        switch (state) {
                                        case UPowerDeviceState.Charging:
                                            return "Charging";
                                        case UPowerDeviceState.Discharging:
                                            return "Discharging";
                                        case UPowerDeviceState.FullyCharged:
                                            return "FullyCharged";
                                        case UPowerDeviceState.Empty:
                                            return "Empty";
                                        case UPowerDeviceState.PendingCharge:
                                            return "PendingCharge";
                                        case UPowerDeviceState.PendingDischarge:
                                            return "PendingDischarge";
                                        default:
                                            return "Unknown";
                                        }
                                    }
                                }
                            }

                            Slider {
                                id: deviceBatterySlider
                                Layout.fillWidth: true
                                from: 0
                                to: 1
                                value: delegateItem.modelData.percentage
                                implicitHeight: 8

                                handle: Rectangle {
                                    id: deviceBatterySliderHandle
                                    x: deviceBatterySlider.leftPadding + deviceBatterySlider.visualPosition * (deviceBatterySlider.availableWidth - width)
                                    implicitWidth: deviceBatterySlider.height
                                    implicitHeight: deviceBatterySlider.height
                                    radius: deviceBatterySlider.height / 2
                                    opacity: 0
                                }

                                background: Rectangle {
                                    id: deviceBatterySliderBackground
                                    x: (deviceBatterySlider.width - width) / 2
                                    y: (deviceBatterySlider.height - height) / 2
                                    width: deviceBatterySlider.width
                                    height: deviceBatterySlider.height
                                    radius: deviceBatterySlider.height / 2
                                    color: "#1e1e2e"

                                    Rectangle {
                                        id: deviceBatterySliderBackgroundFill
                                        anchors.left: parent.left
                                        width: Math.max(deviceBatterySlider.leftPadding + deviceBatterySlider.visualPosition * (deviceBatterySlider.availableWidth - deviceBatterySlider.height) + deviceBatterySlider.height, deviceBatterySlider.height)

                                        height: parent.height
                                        radius: parent.radius
                                        color: "#cba6f7"
                                    }
                                }
                            }

                            RowLayout {
                                Text {
                                    text: getTime(delegateItem.modelData.timeToFull, delegateItem.modelData.timeToEmpty)
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 14
                                    color: "#cdd6f4"
                                    font.bold: true

                                    function getTime(timeToFull, timeToEmpty) {
                                        if (timeToFull > 0) {
                                            return formatTime(timeToFull);
                                        }

                                        if (timeToEmpty > 0) {
                                            return formatTime(timeToEmpty);
                                        }

                                        return "";
                                    }

                                    function formatTime(seconds) {
                                        const hours = Math.floor(seconds / 3600);
                                        const minutes = Math.floor((seconds % 3600) / 60);

                                        const formattedMinutes = minutes.toString().padStart(2, '0');

                                        return `${hours}:${formattedMinutes}`;
                                    }
                                }

                                Item {
                                    Layout.fillWidth: true
                                }

                                Text {
                                    text: `${Math.round(delegateItem.modelData.percentage * 100)}%`
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 14
                                    color: "#cdd6f4"
                                    font.bold: true
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
