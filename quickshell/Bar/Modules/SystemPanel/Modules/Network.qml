import Quickshell
import Quickshell.Widgets
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import qs.Services

Button {
    id: network
    Layout.fillHeight: true
    implicitWidth: 36

    contentItem: Item {
        IconImage {
            source: getIcon(NetworkService.ethernet, NetworkService.wifi, NetworkService.networkStrength)
            implicitSize: 24
            anchors.centerIn: parent

            function getIcon(ethernet, wifi, strength) {
                var icon = "";

                if (ethernet) {
                    icon = "/usr/share/icons/Papirus/24x24/panel/network-wired.svg";
                } else if (wifi) {
                    const icons = {
                        100: "network-wireless-100",
                        80: "network-wireless-80",
                        60: "network-wireless-60",
                        40: "network-wireless-40",
                        20: "network-wireless-20",
                        0: "network-wireless-0"
                    };

                    icon = icons[[0, 20, 40, 60, 80, 100].find(threshold => threshold >= strength)];
                } else {
                    icon = "network-wired-offline";
                }

                return Quickshell.iconPath(icon);
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
