import Quickshell.Services.UPower
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls

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

                function getIcon(state, battery) {
                    print(state);
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
                            100: "\ue1a4",
                            90: "\uebd2",
                            75: "\uebd4",
                            60: "\uebe2",
                            50: "\uebdd",
                            40: "\uebe0",
                            35: "\uebd9",
                            20: "\uebdc"
                        };

                        return icons[[20, 35, 40, 50, 60, 75, 90, 100].filter(thresh => thresh <= battery).pop()];
                    }
                }
            }
        }
    }

    background: Rectangle {
        id: backgroundRectangle
        color: "#313244"
        radius: 12
    }

    onHoveredChanged: {
        if (hovered) {
            backgroundRectangle.color = "#33cdd6f4";
        } else {
            backgroundRectangle.color = "#313244";
        }
    }

    MouseArea {
        anchors.fill: parent
        cursorShape: Qt.PointingHandCursor
        hoverEnabled: true

        onClicked: {
            print("Clicked");
        }
    }
}
