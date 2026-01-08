import Quickshell
import Quickshell.Services.UPower
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import qs.Services

Button {
    id: battery
    Layout.fillHeight: true

    function getColor(state) {
        switch (state) {
        case UPowerDeviceState.Charging:
            return "#a6e3a1";
        case UPowerDeviceState.Discharging:
            return "#fab387";
        case UPowerDeviceState.PendingCharge:
            return "#cba6f7";
        case UPowerDeviceState.Unknown:
            return "#f38ba8";
        default:
            return "#cdd6f4";
        }
    }

    contentItem: Item {
        implicitWidth: content.width

        Row {
            id: content
            anchors.centerIn: parent
            spacing: 2
            leftPadding: 4
            rightPadding: 4

            Text {
                text: `${UPower.displayDevice.percentage * 100}%`
                font.family: "JetBrainsMono Nerd Font"
                font.pixelSize: 14
                color: battery.getColor(UPower.displayDevice.state)
                font.bold: true
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
            }

            Text {
                text: getIcon(UPower.displayDevice.state, UPower.displayDevice.percentage * 100)
                font.family: "Material Icons"
                font.pixelSize: 18
                color: battery.getColor(UPower.displayDevice.state)
                font.bold: true
                horizontalAlignment: Text.AlignHCenter
                verticalAlignment: Text.AlignVCenter
                anchors.verticalCenter: parent.verticalCenter

                Text {
                    text: ""
                    font.family: "Font Awesome 7 Free Solid"
                    font.pixelSize: 8
                    color: "#f38ba8"
                    x: 10
                    y: -2
                    visible: PanelStateService.idleInhibitorVisible
                }

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
        }
    }

    background: Rectangle {
        color: getColor(mouseArea.containsMouse, UPower.displayDevice.state)
        radius: 12

        function getColor(containsMouse, state) {
            if (containsMouse) {
                switch (state) {
                case UPowerDeviceState.Charging:
                    return "#33a6e3a1";
                case UPowerDeviceState.Discharging:
                    return "#33fab387";
                case UPowerDeviceState.PendingCharge:
                    return "#33cba6f7";
                case UPowerDeviceState.Unknown:
                    return "#33f38ba8";
                default:
                    return "#33cdd6f4";
                }
            } else {
                return "#313244";
            }
        }
    }

    MouseArea {
        id: mouseArea
        anchors.fill: parent
        cursorShape: Qt.PointingHandCursor
        hoverEnabled: true

        onClicked: {
            Quickshell.execDetached(["qs", "ipc", "call", "battery", "toggle"]);
        }
    }
}
