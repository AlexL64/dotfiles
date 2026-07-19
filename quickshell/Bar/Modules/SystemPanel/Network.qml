import Quickshell
import Quickshell.Widgets
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import qs.Services
import Quickshell.Networking

Button {
    id: network
    Layout.fillHeight: true
    implicitWidth: 36

    property var wifiDevice: getWifiDevice(Networking.devices.values)
    property var wiredDevice: getWiredDevice(Networking.devices.values)

    function getWifiDevice(devices) {
        const index = devices.findIndex(device => device.type === DeviceType.Wifi);

        if (index != -1) {
            return devices[index];
        }
    }

    function getWiredDevice(devices) {
        const index = devices.findIndex(device => device.type === DeviceType.Wired);

        if (index != -1) {
            return devices[index];
        }
    }

    contentItem: Item {
        IconImage {
            source: getIcon(network.wifiDevice, network.wiredDevice)
            implicitSize: 24
            anchors.centerIn: parent

            function getIcon(wifiDevice, wiredDevice) {
                if (wiredDevice != null && wiredDevice.connected) {
                    return Quickshell.iconPath("/usr/share/icons/Papirus/24x24/panel/network-wired.svg");
                } else {
                    const connectedNetworkIndex = wifiDevice.networks.values.findIndex(network => network.connected);

                    if (wifiDevice != null && wifiDevice.connected && connectedNetworkIndex != -1) {
                        const icons = {
                            100: "network-wireless-100",
                            80: "network-wireless-80",
                            60: "network-wireless-60",
                            40: "network-wireless-40",
                            20: "network-wireless-20",
                            0: "network-wireless-0"
                        };

                        const icon = icons[[0, 20, 40, 60, 80, 100].find(threshold => threshold >= wifiDevice.networks.values[connectedNetworkIndex].signalStrength * 100)];

                        return Quickshell.iconPath(icon);
                    }
                }

                return Quickshell.iconPath("network-wired-offline");
            }

            Text {
                text: MullvadService.state == "connected" ? "" : ""
                font.family: MullvadService.state == "connected" ? "Font Awesome 7 Free" : "Font Awesome 7 Free Solid"
                font.pixelSize: 10
                Layout.alignment: Qt.AlignBottom | Qt.AlignBottom
                color: getColor(MullvadService.state)
                anchors.bottom: parent.bottom
                anchors.right: parent.right
                anchors.rightMargin: MullvadService.state == "connected" ? 1 : -1
                anchors.bottomMargin: MullvadService.state == "connected" ? 3 : 4

                function getColor(state) {
                    if (state == "connected") {
                        return "#a6e3a1";
                    } else if (state == "connecting" || state == "disconnecting") {
                        return "#fab387";
                    } else {
                        return "#f38ba8";
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
