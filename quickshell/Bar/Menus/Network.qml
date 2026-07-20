pragma ComponentBehavior: Bound
import Quickshell
import Quickshell.Widgets
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import Quickshell.Networking
import qs.Services

PanelWindow { //qmllint disable uncreatable-type
    id: network
    visible: PanelStateService.networkVisible
    aboveWindows: true
    color: "transparent"
    exclusionMode: ExclusionMode.Auto
    implicitWidth: content.width + 24
    implicitHeight: content.height + 24

    // qmllint disable unresolved-type unqualified missing-property
    margins {
        top: 10
        right: 10
    }
    // qmllint enable unresolved-type unqualified missing-property

    anchors {
        top: true
        right: true
    }

    property var connectedWiredDevices: Networking.devices.values.filter(device => device.type === DeviceType.Wired)
    property var connectedWifiDevices: Networking.devices.values.filter(device => device.type === DeviceType.Wifi)

    Rectangle {
        color: "#1e1e2e"
        width: content.width + 24
        height: content.height + 24
        radius: 12
        border.width: 2
        border.color: "#cba6f7"

        ColumnLayout {
            id: content
            width: 450
            anchors.centerIn: parent

            Rectangle {
                color: "#313244"
                implicitHeight: children[0].height + 24
                radius: 12
                Layout.fillWidth: true

                ColumnLayout {
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.leftMargin: 16
                    anchors.rightMargin: 16

                    RowLayout {
                        Layout.minimumHeight: 64
                        spacing: 8

                        Text {
                            text: MullvadService.state == "connected" ? "" : ""
                            font.family: MullvadService.state == "connected" ? "Font Awesome 7 Free" : "Font Awesome 7 Free Solid"
                            font.pixelSize: 36
                            color: getColor(MullvadService.state)
                            Layout.rightMargin: MullvadService.state == "connected" ? 3 : 0
                            Layout.leftMargin: MullvadService.state == "connected" ? 3 : -5

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

                        Column {
                            spacing: 2

                            Row {
                                Text {
                                    text: "Mullvad VPN: "
                                    color: "#cdd6f4"
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 15
                                    font.bold: true
                                }

                                Text {
                                    text: MullvadService.state.charAt(0).toUpperCase() + MullvadService.state.slice(1)
                                    color: getColor(MullvadService.state)
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 15
                                    font.bold: true

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

                            Item {
                                width: parent.width
                                height: mullvadInfos.height

                                Behavior on height {
                                    NumberAnimation {
                                        duration: 200
                                        easing.type: Easing.OutCubic
                                    }
                                }

                                Column {
                                    id: mullvadInfos

                                    Row {
                                        visible: MullvadService.state == "connected" || MullvadService.state == "connecting"

                                        Text {
                                            text: MullvadService.infos.hostname
                                            color: "#bac2de"
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 13
                                            font.bold: true
                                        }

                                        Text {
                                            visible: MullvadService.infos.hostname != "" && MullvadService.infos.ipv4 != ""
                                            text: ", "
                                            color: "#bac2de"
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 13
                                            font.bold: true
                                        }

                                        Text {
                                            text: MullvadService.infos.ipv4
                                            color: "#bac2de"
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 13
                                            font.bold: true
                                        }
                                    }

                                    Row {
                                        visible: MullvadService.state == "connected" || MullvadService.state == "connecting"

                                        Text {
                                            text: MullvadService.infos.country
                                            color: "#bac2de"
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 13
                                            font.bold: true
                                        }

                                        Text {
                                            visible: MullvadService.infos.country != "" && MullvadService.infos.city != ""
                                            text: ", "
                                            color: "#bac2de"
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 13
                                            font.bold: true
                                        }

                                        Text {
                                            text: MullvadService.infos.city
                                            color: "#bac2de"
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 13
                                            font.bold: true
                                        }
                                    }
                                }
                            }
                        }

                        Rectangle {
                            Layout.fillWidth: true
                        }

                        Button {
                            implicitHeight: 32
                            implicitWidth: 32

                            contentItem: Text {
                                text: ""
                                color: "#cdd6f4"
                                font.family: "Font Awesome 7 Free Solid"
                                font.pixelSize: 16
                                horizontalAlignment: Text.AlignHCenter
                                verticalAlignment: Text.AlignVCenter
                            }

                            background: Rectangle {
                                id: discoverRectangleBackground
                                color: "#45475a"
                                radius: 6
                            }

                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                hoverEnabled: true

                                onEntered: {
                                    discoverRectangleBackground.color = "#cc45475a";
                                }

                                onExited: {
                                    discoverRectangleBackground.color = "#45475a";
                                }

                                onClicked: {
                                    MullvadService.reconnect();
                                }
                            }
                        }

                        Switch {
                            id: toggleMullvad
                            implicitWidth: background.width

                            checked: MullvadService.state == "connected"

                            indicator: Rectangle {
                                width: 18
                                height: 18
                                color: "white"
                                radius: 9
                                anchors.verticalCenter: parent.verticalCenter
                                x: toggleMullvad.checked ? parent.width - width - 3 : 3

                                Behavior on x {
                                    NumberAnimation {
                                        duration: 75
                                    }
                                }
                            }

                            background: Rectangle {
                                width: 48
                                height: 24
                                radius: 15
                                color: toggleMullvad.checked ? "#cba6f7" : "#9399b2"
                                anchors.verticalCenter: parent.verticalCenter

                                Behavior on color {
                                    ColorAnimation {
                                        duration: 75
                                        easing.type: Easing.InOutQuad
                                    }
                                }
                            }

                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                hoverEnabled: true

                                onClicked: {
                                    switch (MullvadService.state) {
                                    case "connected":
                                        MullvadService.disconnect();
                                        break;
                                    case "disconnected":
                                        MullvadService.connect();
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    Repeater {
                        model: network.connectedWiredDevices
                        delegate: ColumnLayout {
                            id: delegateWiredDevicesItem

                            spacing: 3

                            required property WiredDevice modelData

                            Rectangle {
                                color: "#6c7086"
                                implicitHeight: 2
                                radius: 2
                                Layout.fillWidth: true
                            }

                            RowLayout {
                                Layout.minimumHeight: 48
                                spacing: 8

                                IconImage {
                                    source: delegateWiredDevicesItem.modelData.hasLink ? Quickshell.iconPath("/usr/share/icons/Papirus/24x24/panel/network-wired.svg") : Quickshell.iconPath("network-wired-offline")
                                    implicitSize: 36
                                }

                                ColumnLayout {
                                    spacing: 3
                                    Text {
                                        text: delegateWiredDevicesItem.modelData.name
                                        color: "#cdd6f4"
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 15
                                        font.bold: true
                                    }

                                    Text {
                                        text: delegateWiredDevicesItem.modelData.linkSpeed + " Mb/s"
                                        color: "#bac2de"
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 13
                                        font.bold: true
                                    }
                                }
                            }
                        }
                    }

                    Repeater {
                        model: network.connectedWifiDevices
                        delegate: ColumnLayout {
                            id: delegateWifiDeviceItem

                            required property WifiDevice modelData

                            property var connectedWifiNetworks: modelData.networks.values.filter(network => network.connected)

                            Repeater {
                                model: delegateWifiDeviceItem.connectedWifiNetworks
                                delegate: ColumnLayout {
                                    id: delegateWifiNetworkItem
                                    spacing: 10
                                    Layout.fillWidth: true

                                    required property Network modelData

                                    Rectangle {
                                        color: "#6c7086"
                                        implicitHeight: 2
                                        radius: 2
                                        Layout.fillWidth: true
                                    }

                                    RowLayout {
                                        IconImage {
                                            source: getIcon(delegateWifiNetworkItem.modelData)
                                            implicitSize: 36

                                            function getIcon(wifiNetwork) {
                                                const icons = {
                                                    100: "network-wireless-100",
                                                    80: "network-wireless-80",
                                                    60: "network-wireless-60",
                                                    40: "network-wireless-40",
                                                    20: "network-wireless-20",
                                                    0: "network-wireless-0"
                                                };

                                                const icon = icons[[0, 20, 40, 60, 80, 100].find(threshold => threshold >= wifiNetwork.signalStrength * 100)];

                                                return Quickshell.iconPath(icon);
                                            }
                                        }

                                        Text {
                                            text: delegateWifiNetworkItem.modelData.name
                                            color: "#cdd6f4"
                                            font.family: "JetBrainsMono Nerd Font"
                                            font.pixelSize: 15
                                            font.bold: true
                                            Layout.fillWidth: true
                                        }

                                        Button {
                                            implicitHeight: 32
                                            implicitWidth: 96

                                            contentItem: Text {
                                                id: connectButton
                                                text: getText(delegateWifiNetworkItem.modelData.state, delegateWifiNetworkItem.modelData.stateChanging) // qmllint disable unresolved-type
                                                color: "#313244"
                                                font.family: getFont(delegateWifiNetworkItem.modelData.state, delegateWifiNetworkItem.modelData.stateChanging) // qmllint disable unresolved-type
                                                font.pixelSize: 14
                                                font.bold: true
                                                horizontalAlignment: Text.AlignHCenter
                                                verticalAlignment: Text.AlignVCenter

                                                function getText(state, stateChanging) {
                                                    if (state == ConnectionState.Connecting || state == ConnectionState.Disconnecting || stateChanging) {
                                                        return "";
                                                    } else if (state == ConnectionState.Connected) {
                                                        return "Disconnect";
                                                    } else if (state == ConnectionState.Disconnected) {
                                                        return "Disconnect";
                                                    }

                                                    return "";
                                                }

                                                function getFont(state, stateChanging) {
                                                    if (state == ConnectionState.Connecting || state == ConnectionState.Disconnecting || stateChanging) {
                                                        return "Font Awesome 7 Free Solid";
                                                    } else if (state == ConnectionState.Connected) {
                                                        return "JetBrainsMono Nerd Font";
                                                    } else if (state == ConnectionState.Disconnected) {
                                                        return "JetBrainsMono Nerd Font";
                                                    }

                                                    return "Font Awesome 7 Free Solid";
                                                }

                                                NumberAnimation {
                                                    target: connectButton
                                                    property: "rotation"
                                                    from: 0
                                                    to: 360
                                                    duration: 2000
                                                    loops: Animation.Infinite
                                                    running: delegateWifiNetworkItem.modelData.state == ConnectionState.Connecting || delegateWifiNetworkItem.modelData.state == ConnectionState.Disconnecting || delegateWifiNetworkItem.modelData.stateChanging // qmllint disable unresolved-type
                                                    onRunningChanged: {
                                                        if (!running) {
                                                            connectButton.rotation = 0;
                                                        }
                                                    }
                                                }
                                            }

                                            background: Rectangle {
                                                color: getColor(delegateWifiNetworkItem.modelData.state, delegateWifiNetworkItem.modelData.stateChanging, connectButtonMouseArea.containsMouse) // qmllint disable unresolved-type
                                                radius: 6

                                                function getColor(state, stateChanging, containsMouse) {
                                                    if (state == ConnectionState.Connecting || state == ConnectionState.Disconnecting || stateChanging) {
                                                        return containsMouse ? "#ccfab387" : "#fab387";
                                                    } else if (state == ConnectionState.Connected) {
                                                        return containsMouse ? "#ccf38ba8" : "#f38ba8";
                                                    } else if (state == ConnectionState.Disconnected) {
                                                        return containsMouse ? "#cca6e3a1" : "#a6e3a1";
                                                    }

                                                    return "#f38ba8";
                                                }
                                            }

                                            MouseArea {
                                                id: connectButtonMouseArea
                                                anchors.fill: parent
                                                cursorShape: Qt.PointingHandCursor
                                                hoverEnabled: true

                                                onClicked: {
                                                    if (delegateWifiNetworkItem.modelData.state == ConnectionState.Disconnected) { // qmllint disable unresolved-type
                                                        delegateWifiNetworkItem.modelData.connect();
                                                    } else if (delegateWifiNetworkItem.modelData.state == ConnectionState.Connected) { // qmllint disable unresolved-type
                                                        delegateWifiNetworkItem.modelData.disconnect();
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
        }
    }
}
