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

    onVisibleChanged: {
        if (visible) {
            wifiDevices.forEach(wifiDevice => {
                wifiDevice.scannerEnabled = true;
            });
        } else {
            wifiDevices.forEach(wifiDevice => {
                wifiDevice.scannerEnabled = false;
            });
        }
    }

    property var wiredDevices: Networking.devices.values.filter(device => device.type === DeviceType.Wired)
    property var wifiDevices: Networking.devices.values.filter(device => device.type === DeviceType.Wifi)

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
            spacing: 8

            RowLayout {
                spacing: 8

                Rectangle {
                    Layout.fillWidth: true
                    implicitHeight: 48
                    color: "#313244"
                    radius: 12

                    RowLayout {
                        anchors.fill: parent
                        anchors.leftMargin: 12
                        anchors.rightMargin: 12

                        Text {
                            text: "Wifi:"
                            color: "#cdd6f4"
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 15
                            font.bold: true
                        }

                        Text {
                            text: Networking.wifiEnabled ? "Enabled" : "Disabled"
                            color: Networking.wifiEnabled ? "#a6e3a1" : "#f38ba8"
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 15
                            font.bold: true
                            Layout.fillWidth: true
                        }

                        Switch {
                            id: toggleWifi
                            implicitWidth: background.width

                            checked: Networking.wifiEnabled

                            indicator: Rectangle {
                                width: 18
                                height: 18
                                color: "white"
                                radius: 9
                                anchors.verticalCenter: parent.verticalCenter
                                x: toggleWifi.checked ? parent.width - width - 3 : 3

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
                                color: toggleWifi.checked ? "#cba6f7" : "#9399b2"
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
                                    Networking.wifiEnabled = !Networking.wifiEnabled;
                                }
                            }
                        }
                    }
                }

                Button {
                    Layout.fillHeight: true
                    implicitWidth: 56
                    contentItem: Text {
                        text: "\ue0da"
                        color: "#cdd6f4"
                        font.family: "Material Icons"
                        font.pixelSize: 24
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }

                    background: Rectangle {
                        id: mullvadRectangleBackground
                        color: "#313244"
                        radius: 12
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        hoverEnabled: true

                        onEntered: {
                            mullvadRectangleBackground.color = "#cc313244";
                        }

                        onExited: {
                            mullvadRectangleBackground.color = "#313244";
                        }

                        onClicked: {
                            Quickshell.execDetached("mullvad-vpn");
                        }
                    }
                }

                Button {
                    Layout.fillHeight: true
                    implicitWidth: 56
                    contentItem: Text {
                        text: ""
                        color: "#cdd6f4"
                        font.family: "Font Awesome 7 Free Solid"
                        font.pixelSize: 20
                        horizontalAlignment: Text.AlignHCenter
                        verticalAlignment: Text.AlignVCenter
                    }

                    background: Rectangle {
                        id: advancedRectangleBackground
                        color: "#313244"
                        radius: 12
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        hoverEnabled: true

                        onEntered: {
                            advancedRectangleBackground.color = "#cc313244";
                        }

                        onExited: {
                            advancedRectangleBackground.color = "#313244";
                        }

                        onClicked: {
                            Quickshell.execDetached("nm-connection-editor");
                        }
                    }
                }
            }

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
                    Layout.preferredHeight: 0

                    RowLayout {
                        spacing: 8
                        Layout.minimumHeight: 58

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
                            visible: MullvadService.state == "connected"
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
                            visible: MullvadService.state != "error"
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
                        model: network.wiredDevices
                        delegate: ColumnLayout {
                            id: delegateConnectedWiredDevicesItem
                            spacing: 8

                            required property WiredDevice modelData

                            Rectangle {
                                color: "#6c7086"
                                implicitHeight: 2
                                radius: 2
                                Layout.fillWidth: true
                            }

                            RowLayout {
                                spacing: 8

                                IconImage {
                                    source: delegateConnectedWiredDevicesItem.modelData.hasLink ? Quickshell.iconPath("/usr/share/icons/Papirus/24x24/panel/network-wired.svg") : Quickshell.iconPath("network-wired-offline")
                                    implicitSize: 36
                                }

                                ColumnLayout {
                                    spacing: 3
                                    Text {
                                        text: delegateConnectedWiredDevicesItem.modelData.name
                                        color: "#cdd6f4"
                                        font.family: "JetBrainsMono Nerd Font"
                                        font.pixelSize: 15
                                        font.bold: true
                                        elide: Text.ElideRight
                                        Layout.preferredWidth: 230
                                    }

                                    Text {
                                        text: delegateConnectedWiredDevicesItem.modelData.linkSpeed + " Mb/s"
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
                        model: network.wifiDevices

                        delegate: ColumnLayout {
                            id: delegateConnectedWifiDeviceItem
                            visible: connectedWifiNetworks.length > 0

                            required property WifiDevice modelData

                            property var connectedWifiNetworks: modelData.networks.values.filter(network => network.connected)

                            Repeater {
                                model: delegateConnectedWifiDeviceItem.connectedWifiNetworks
                                delegate: ColumnLayout {
                                    id: delegateConnectedWifiNetworkItem
                                    spacing: 8
                                    Layout.fillWidth: true

                                    required property WifiNetwork modelData

                                    Rectangle {
                                        color: "#6c7086"
                                        implicitHeight: 2
                                        radius: 2
                                        Layout.fillWidth: true
                                    }

                                    RowLayout {
                                        spacing: 8

                                        IconImage {
                                            source: getIcon(delegateConnectedWifiNetworkItem.modelData)
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

                                            Text {
                                                visible: delegateConnectedWifiNetworkItem.modelData.security != "None" && delegateConnectedWifiNetworkItem.modelData.security != "Unknown" // qmllint disable unresolved-type
                                                text: ""
                                                font.family: "Font Awesome 7 Free"
                                                font.pixelSize: 12
                                                color: "#fab387"
                                                anchors.bottom: parent.bottom
                                                anchors.right: parent.right
                                                anchors.rightMargin: 5
                                                anchors.bottomMargin: 6
                                                style: Text.Outline
                                                styleColor: "#6c7086"
                                            }
                                        }

                                        ColumnLayout {
                                            spacing: 3

                                            Row {
                                                Layout.fillWidth: true
                                                spacing: 8
                                                Text {
                                                    text: delegateConnectedWifiNetworkItem.modelData.name
                                                    color: "#cdd6f4"
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 15
                                                    font.bold: true
                                                    elide: Text.ElideRight
                                                    width: Math.min(implicitWidth, 230)
                                                }

                                                Text {
                                                    visible: delegateConnectedWifiNetworkItem.modelData.known
                                                    text: ""
                                                    font.family: "Font Awesome 7 Free Solid"
                                                    font.pixelSize: 13
                                                    color: "#a6e3a1"
                                                    anchors.verticalCenter: parent.verticalCenter
                                                }
                                            }

                                            Text {
                                                text: getText(delegateConnectedWifiNetworkItem.modelData.security) // qmllint disable unresolved-type
                                                color: "#bac2de"
                                                font.family: "JetBrainsMono Nerd Font"
                                                font.pixelSize: 13
                                                font.bold: true

                                                function getText(security) {
                                                    switch (security) {
                                                    case WifiSecurityType.StaticWep:
                                                        return "WEP (Static)";
                                                    case WifiSecurityType.Sae:
                                                        return "WPA3-Personal";
                                                    case WifiSecurityType.Wpa2Psk:
                                                        return "WPA2-Personal";
                                                    case WifiSecurityType.WpaEap:
                                                        return "WPA-Enterprise";
                                                    case WifiSecurityType.Open:
                                                        return "Open";
                                                    case WifiSecurityType.DynamicWep:
                                                        return "WEP (Dynamic)";
                                                    case WifiSecurityType.Leap:
                                                        return "LEAP";
                                                    case WifiSecurityType.Wpa3SuiteB192:
                                                        return "WPA3-Enterprise";
                                                    case WifiSecurityType.WpaPsk:
                                                        return "WPA-Personal";
                                                    case WifiSecurityType.Wpa2Eap:
                                                        return "WPA2-Enterprise";
                                                    case WifiSecurityType.Owe:
                                                        return "Enhanced Open";
                                                    default:
                                                        return "";
                                                    }
                                                }
                                            }
                                        }

                                        Button {
                                            implicitHeight: 32
                                            implicitWidth: 96

                                            contentItem: Text {
                                                id: disconnectButton
                                                text: getText(delegateConnectedWifiNetworkItem.modelData.state, delegateConnectedWifiNetworkItem.modelData.stateChanging) // qmllint disable unresolved-type
                                                color: "#313244"
                                                font.family: getFont(delegateConnectedWifiNetworkItem.modelData.state, delegateConnectedWifiNetworkItem.modelData.stateChanging) // qmllint disable unresolved-type
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
                                                        return "Connect";
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
                                                    target: disconnectButton
                                                    property: "rotation"
                                                    from: 0
                                                    to: 360
                                                    duration: 2000
                                                    loops: Animation.Infinite
                                                    running: delegateConnectedWifiNetworkItem.modelData.state == ConnectionState.Connecting || delegateConnectedWifiNetworkItem.modelData.state == ConnectionState.Disconnecting || delegateConnectedWifiNetworkItem.modelData.stateChanging // qmllint disable unresolved-type
                                                    onRunningChanged: {
                                                        if (!running) {
                                                            disconnectButton.rotation = 0;
                                                        }
                                                    }
                                                }
                                            }

                                            background: Rectangle {
                                                color: getColor(delegateConnectedWifiNetworkItem.modelData.state, delegateConnectedWifiNetworkItem.modelData.stateChanging, disconnectButtonMouseArea.containsMouse) // qmllint disable unresolved-type
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
                                                id: disconnectButtonMouseArea
                                                anchors.fill: parent
                                                cursorShape: Qt.PointingHandCursor
                                                hoverEnabled: true

                                                onClicked: {
                                                    if (delegateConnectedWifiNetworkItem.modelData.state == ConnectionState.Connected) { // qmllint disable unresolved-type
                                                        delegateConnectedWifiNetworkItem.modelData.disconnect();
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

            ScrollView {
                visible: availableWifiNetworks.height > 0
                Layout.fillWidth: true
                Layout.preferredHeight: availableWifiNetworks.height > 300 ? 300 : availableWifiNetworks.height

                ColumnLayout {
                    id: availableWifiNetworks
                    width: parent.width
                    spacing: 8

                    Repeater {
                        id: test
                        model: network.wifiDevices
                        delegate: ColumnLayout {
                            id: delegateAvailableWifiDeviceItem
                            spacing: 8
                            visible: Networking.wifiEnabled

                            required property WifiDevice modelData

                            property var availableWifiNetworks: modelData.networks.values.filter(network => !network.connected)

                            Repeater {
                                model: delegateAvailableWifiDeviceItem.availableWifiNetworks.sort((a, b) => {
                                    if (a.known !== b.known) {
                                        return Number(b.known) - Number(a.known);
                                    }

                                    return b.signalStrength - a.signalStrength;
                                })
                                delegate: Rectangle {
                                    id: delegateAvailableWifiNetworkItem
                                    color: "#313244"
                                    implicitHeight: children[0].height + 8
                                    radius: 12
                                    Layout.fillWidth: true

                                    required property WifiNetwork modelData

                                    ColumnLayout {
                                        anchors.verticalCenter: parent.verticalCenter
                                        anchors.left: parent.left
                                        anchors.right: parent.right
                                        anchors.leftMargin: 16
                                        anchors.rightMargin: 16

                                        RowLayout {
                                            spacing: 8

                                            IconImage {
                                                source: getIcon(delegateAvailableWifiNetworkItem.modelData)
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

                                                Text {
                                                    visible: delegateAvailableWifiNetworkItem.modelData.security != "None" && delegateAvailableWifiNetworkItem.modelData.security != "Unknown" // qmllint disable unresolved-type
                                                    text: ""
                                                    font.family: "Font Awesome 7 Free"
                                                    font.pixelSize: 12
                                                    color: "#fab387"
                                                    anchors.bottom: parent.bottom
                                                    anchors.right: parent.right
                                                    anchors.rightMargin: 5
                                                    anchors.bottomMargin: 6
                                                    style: Text.Outline
                                                    styleColor: "#6c7086"
                                                }
                                            }

                                            ColumnLayout {
                                                spacing: 3

                                                Row {
                                                    Layout.fillWidth: true
                                                    spacing: 8
                                                    Text {
                                                        text: delegateAvailableWifiNetworkItem.modelData.name
                                                        color: "#cdd6f4"
                                                        font.family: "JetBrainsMono Nerd Font"
                                                        font.pixelSize: 15
                                                        font.bold: true
                                                        elide: Text.ElideRight
                                                        width: Math.min(implicitWidth, 230)
                                                    }

                                                    Text {
                                                        visible: delegateAvailableWifiNetworkItem.modelData.known
                                                        text: ""
                                                        font.family: "Font Awesome 7 Free Solid"
                                                        font.pixelSize: 13
                                                        color: "#a6e3a1"
                                                        anchors.verticalCenter: parent.verticalCenter
                                                    }
                                                }

                                                Text {
                                                    text: getText(delegateAvailableWifiNetworkItem.modelData.security) // qmllint disable unresolved-type
                                                    color: "#bac2de"
                                                    font.family: "JetBrainsMono Nerd Font"
                                                    font.pixelSize: 13
                                                    font.bold: true

                                                    function getText(security) {
                                                        switch (security) {
                                                        case WifiSecurityType.StaticWep:
                                                            return "WEP (Static)";
                                                        case WifiSecurityType.Sae:
                                                            return "WPA3-Personal";
                                                        case WifiSecurityType.Wpa2Psk:
                                                            return "WPA2-Personal";
                                                        case WifiSecurityType.WpaEap:
                                                            return "WPA-Enterprise";
                                                        case WifiSecurityType.Open:
                                                            return "Open";
                                                        case WifiSecurityType.DynamicWep:
                                                            return "WEP (Dynamic)";
                                                        case WifiSecurityType.Leap:
                                                            return "LEAP";
                                                        case WifiSecurityType.Wpa3SuiteB192:
                                                            return "WPA3-Enterprise";
                                                        case WifiSecurityType.WpaPsk:
                                                            return "WPA-Personal";
                                                        case WifiSecurityType.Wpa2Eap:
                                                            return "WPA2-Enterprise";
                                                        case WifiSecurityType.Owe:
                                                            return "Enhanced Open";
                                                        default:
                                                            return "";
                                                        }
                                                    }
                                                }
                                            }

                                            Button {
                                                implicitHeight: 32
                                                implicitWidth: 96

                                                contentItem: Text {
                                                    id: connectButton
                                                    text: getText(delegateAvailableWifiNetworkItem.modelData.state, delegateAvailableWifiNetworkItem.modelData.stateChanging) // qmllint disable unresolved-type
                                                    color: "#313244"
                                                    font.family: getFont(delegateAvailableWifiNetworkItem.modelData.state, delegateAvailableWifiNetworkItem.modelData.stateChanging) // qmllint disable unresolved-type
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
                                                            return "Connect";
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
                                                        running: delegateAvailableWifiNetworkItem.modelData.state == ConnectionState.Connecting || delegateAvailableWifiNetworkItem.modelData.state == ConnectionState.Disconnecting || delegateAvailableWifiNetworkItem.modelData.stateChanging // qmllint disable unresolved-type
                                                        onRunningChanged: {
                                                            if (!running) {
                                                                connectButton.rotation = 0;
                                                            }
                                                        }
                                                    }
                                                }

                                                background: Rectangle {
                                                    color: getColor(delegateAvailableWifiNetworkItem.modelData.state, delegateAvailableWifiNetworkItem.modelData.stateChanging, connectButtonMouseArea.containsMouse) // qmllint disable unresolved-type
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
                                                        if (delegateAvailableWifiNetworkItem.modelData.state == ConnectionState.Disconnected) { // qmllint disable unresolved-type
                                                            delegateAvailableWifiNetworkItem.modelData.connect();
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
}
