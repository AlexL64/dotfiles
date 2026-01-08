pragma ComponentBehavior: Bound
import Quickshell
import Quickshell.Widgets
import Quickshell.Bluetooth
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import qs.Services

PanelWindow { //qmllint disable uncreatable-type
    id: bluetooth
    visible: PanelStateService.bluetoothVisible
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

    property list<BluetoothDevice> devices: filterDevices(Bluetooth.defaultAdapter.devices.values) // qmllint disable unresolved-type

    function filterDevices(devices) {
        devices = devices.filter(item => item.deviceName !== "");

        devices = devices.sort((a, b) => {
            if (a.paired === b.paired) {
                return a.deviceName.localeCompare(b.deviceName);
            }
            return a.bool ? -1 : 1;
        });

        return devices;
    }

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
            spacing: 10

            Rectangle {
                color: "#313244"
                implicitHeight: 56
                radius: 12
                Layout.fillWidth: true

                RowLayout {
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.fill: parent

                    Row {
                        spacing: 10
                        leftPadding: 12
                        Layout.alignment: Qt.AlignLeft

                        Text {
                            text: ""
                            color: "#cdd6f4"
                            font.family: "Font Awesome 7 Free Solid"
                            font.pixelSize: 20
                        }

                        Text {
                            text: `Bluetooth ${getState(Bluetooth.defaultAdapter.state)}` // qmllint disable unresolved-type
                            color: "#cdd6f4"
                            font.family: "JetBrainsMono Nerd Font"
                            font.pixelSize: 15
                            font.bold: true

                            function getState(state) {
                                switch (state) {
                                case BluetoothAdapterState.Enabled:
                                    return "Enabled";
                                case BluetoothAdapterState.Disabled:
                                    return "Disabled";
                                case BluetoothAdapterState.Enabling:
                                    return "Enabling";
                                case BluetoothAdapterState.Disabling:
                                    return "Disabling";
                                case BluetoothAdapterState.Blocked:
                                    return "Disabled";
                                default:
                                    return "Unknown";
                                }
                            }
                        }
                    }

                    Row {
                        Layout.alignment: Qt.AlignRight
                        Layout.rightMargin: 12
                        spacing: 20

                        Loader {
                            active: Bluetooth.defaultAdapter.enabled // qmllint disable unresolved-type
                            sourceComponent: Button {
                                anchors.verticalCenter: parent.verticalCenter
                                width: 32
                                height: 32

                                contentItem: Text {
                                    id: discoverButtonText
                                    text: Bluetooth.defaultAdapter.discovering ? "" : "" // qmllint disable unresolved-type
                                    color: "#cdd6f4"
                                    font.family: "Font Awesome 7 Free Solid"
                                    font.pixelSize: 16
                                    horizontalAlignment: Text.AlignHCenter
                                    verticalAlignment: Text.AlignVCenter

                                    NumberAnimation {
                                        target: discoverButtonText
                                        property: "rotation"
                                        from: 0
                                        to: 360
                                        duration: 2000
                                        loops: Animation.Infinite
                                        running: Bluetooth.defaultAdapter.discovering // qmllint disable unresolved-type
                                        onRunningChanged: {
                                            if (!running) {
                                                discoverButtonText.rotation = 0;
                                            }
                                        }
                                    }
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
                                        Bluetooth.defaultAdapter.discovering = !Bluetooth.defaultAdapter.discovering; // qmllint disable unresolved-type
                                    }
                                }
                            }
                        }

                        Switch {
                            id: toggleBluetooth
                            implicitWidth: background.width

                            checked: getChecked(Bluetooth.defaultAdapter.state) // qmllint disable unresolved-type

                            function getChecked(state) {
                                if (state == BluetoothAdapterState.Enabled || state == BluetoothAdapterState.Enabling) {
                                    return true;
                                }

                                return false;
                            }

                            indicator: Rectangle {
                                width: 18
                                height: 18
                                color: "white"
                                radius: 9
                                anchors.verticalCenter: parent.verticalCenter
                                x: toggleBluetooth.checked ? parent.width - width - 3 : 3

                                Behavior on x {
                                    NumberAnimation {
                                        duration: 75
                                    }
                                }
                            }

                            background: Rectangle {
                                id: toggleBluetoothBackground
                                width: 48
                                height: 24
                                radius: 15
                                color: toggleBluetooth.checked ? "#cba6f7" : "#9399b2"
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
                                    if (toggleBluetooth.checked) {
                                        Quickshell.execDetached(["rfkill", "block", "bluetooth"]);
                                    } else {
                                        Quickshell.execDetached(["rfkill", "unblock", "bluetooth"]);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Repeater {
                model: bluetooth.devices // qmllint disable unresolved-type
                delegate: Rectangle {
                    id: delegateItem

                    required property BluetoothDevice modelData

                    color: "#313244"
                    implicitHeight: 56
                    radius: 12
                    Layout.fillWidth: true

                    RowLayout {
                        anchors.fill: parent

                        Row {
                            Layout.leftMargin: 10
                            Layout.alignment: Qt.AlignLeft
                            spacing: 10

                            IconImage {
                                source: Quickshell.iconPath(delegateItem.modelData.icon, "bluetooth")
                                implicitSize: 32
                                anchors.verticalCenter: parent.verticalCenter
                            }

                            Column {
                                spacing: 3
                                Text {
                                    text: delegateItem.modelData.deviceName
                                    color: "#cdd6f4"
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 14
                                    font.bold: true
                                    width: 220
                                    elide: Text.ElideRight
                                }

                                Text {
                                    text: delegateItem.modelData.address
                                    color: "#a6adc8"
                                    font.family: "JetBrainsMono Nerd Font"
                                    font.pixelSize: 12
                                    font.bold: true
                                }
                            }
                        }

                        Row {
                            Layout.rightMargin: 10
                            Layout.alignment: Qt.AlignRight
                            spacing: 6

                            Loader {
                                active: delegateItem.modelData.paired
                                sourceComponent: ColumnLayout {
                                    spacing: 4

                                    Rectangle {
                                        implicitWidth: 14
                                        implicitHeight: 14
                                        color: "#a6e3a1"
                                        radius: 3
                                        visible: delegateItem.modelData.trusted

                                        Text {
                                            text: "\ue5ca"
                                            color: "#313244"
                                            font.family: "Material Icons"
                                            font.bold: true
                                            font.pixelSize: 10
                                            anchors.centerIn: parent
                                        }
                                    }

                                    Rectangle {
                                        implicitWidth: 14
                                        implicitHeight: 14
                                        color: "#f38ba8"
                                        radius: 3
                                        visible: delegateItem.modelData.blocked

                                        Text {
                                            text: "\ue14b"
                                            color: "#313244"
                                            font.family: "Material Icons"
                                            font.bold: true
                                            font.pixelSize: 10
                                            anchors.centerIn: parent
                                        }
                                    }
                                }
                            }

                            Loader {
                                active: Bluetooth.defaultAdapter.state == BluetoothAdapterState.Enabled // qmllint disable unresolved-type
                                width: active ? 96 : 0

                                Behavior on width {
                                    NumberAnimation {
                                        duration: 50
                                    }
                                }

                                sourceComponent: Button {
                                    height: 32
                                    width: 96

                                    contentItem: Text {
                                        id: connectButton
                                        text: getText(delegateItem.modelData.paired, delegateItem.modelData.connected, delegateItem.modelData.pairing, delegateItem.modelData.state) // qmllint disable unresolved-type
                                        color: "#313244"
                                        font.family: getFont(delegateItem.modelData.pairing, delegateItem.modelData.state) // qmllint disable unresolved-type
                                        font.pixelSize: 14
                                        font.bold: true
                                        horizontalAlignment: Text.AlignHCenter
                                        verticalAlignment: Text.AlignVCenter

                                        function getText(paired, connected, pairing, state) {
                                            if (pairing || state == BluetoothDeviceState.Connecting || state == BluetoothDeviceState.Disconnecting) {
                                                return "";
                                            } else {
                                                if (paired) {
                                                    if (connected) {
                                                        return "Disconnect";
                                                    } else {
                                                        return "Connect";
                                                    }
                                                } else {
                                                    return "Pair";
                                                }
                                            }
                                        }

                                        function getFont(pairing, state) {
                                            if (pairing || state == BluetoothDeviceState.Connecting || state == BluetoothDeviceState.Disconnecting) {
                                                return "Font Awesome 7 Free Solid";
                                            } else {
                                                return "JetBrainsMono Nerd Font";
                                            }
                                        }

                                        NumberAnimation {
                                            target: connectButton
                                            property: "rotation"
                                            from: 0
                                            to: 360
                                            duration: 2000
                                            loops: Animation.Infinite
                                            running: delegateItem.modelData.pairing || delegateItem.modelData.state == BluetoothDeviceState.Connecting || delegateItem.modelData.state == BluetoothDeviceState.Disconnecting // qmllint disable unresolved-type
                                            onRunningChanged: {
                                                if (!running) {
                                                    connectButton.rotation = 0;
                                                }
                                            }
                                        }
                                    }

                                    background: Rectangle {
                                        color: getColor(delegateItem.modelData.paired, delegateItem.modelData.connected, delegateItem.modelData.pairing, connectButtonMouseArea.containsMouse)
                                        radius: 6

                                        function getColor(paired, connected, pairing, containsMouse) {
                                            if (paired) {
                                                if (connected) {
                                                    return containsMouse ? "#ccf38ba8" : "#f38ba8";
                                                } else {
                                                    return containsMouse ? "#cc89b4fa" : "#89b4fa";
                                                }
                                            } else {
                                                if (pairing) {
                                                    return containsMouse ? "#ccfab387" : "#fab387";
                                                } else {
                                                    return containsMouse ? "#cca6e3a1" : "#a6e3a1";
                                                }
                                            }
                                        }
                                    }

                                    MouseArea {
                                        id: connectButtonMouseArea
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        hoverEnabled: true

                                        onClicked: {
                                            if (delegateItem.modelData.paired) {
                                                if (delegateItem.modelData.connected) {
                                                    delegateItem.modelData.disconnect();
                                                } else {
                                                    delegateItem.modelData.connect();
                                                }
                                            } else {
                                                delegateItem.modelData.pair();
                                            }
                                        }
                                    }
                                }
                            }

                            Loader {
                                active: delegateItem.modelData.paired
                                height: 32
                                width: active ? 32 : 0
                                Button {
                                    id: optionsButton
                                    height: parent.height
                                    width: parent.width

                                    contentItem: Text {
                                        text: optionsPopup.visible ? "" : ""
                                        color: "#cdd6f4"
                                        font.family: "Font Awesome 7 Free Solid"
                                        font.pixelSize: 14
                                        horizontalAlignment: Text.AlignHCenter
                                        verticalAlignment: Text.AlignVCenter
                                    }

                                    background: Rectangle {
                                        id: optionsBackgroundRectangle
                                        color: "#45475a"
                                        radius: 6
                                    }

                                    PopupWindow {
                                        id: optionsPopup

                                        property var buttonPos: optionsButton.mapToItem(null, 0, 0)

                                        anchor.window: bluetooth
                                        anchor.rect.x: buttonPos.x - width + optionsButton.width
                                        anchor.rect.y: buttonPos.y + optionsButton.height + 6
                                        implicitWidth: popupContent.width + 12
                                        implicitHeight: popupContent.height + 12
                                        visible: false
                                        color: "transparent"

                                        Rectangle {
                                            color: "#313244"
                                            border.width: 1
                                            border.color: "#cba6f7"
                                            width: popupContent.width + 12
                                            height: popupContent.height + 12
                                            radius: 12

                                            ColumnLayout {
                                                id: popupContent
                                                anchors.centerIn: parent
                                                width: 150
                                                spacing: 6

                                                Button {
                                                    Layout.fillWidth: true

                                                    contentItem: Text {
                                                        text: delegateItem.modelData.trusted ? "Untrust" : "Trust"
                                                        color: "#cdd6f4"
                                                        font.family: "JetBrainsMono Nerd Font"
                                                        font.pixelSize: 14
                                                        font.bold: true
                                                        horizontalAlignment: Text.AlignHCenter
                                                        verticalAlignment: Text.AlignVCenter
                                                    }

                                                    background: Rectangle {
                                                        id: popoverTrustBackgroundRectangle
                                                        color: "#45475a"
                                                        radius: 6
                                                    }

                                                    MouseArea {
                                                        anchors.fill: parent
                                                        cursorShape: Qt.PointingHandCursor
                                                        hoverEnabled: true

                                                        onEntered: {
                                                            popoverTrustBackgroundRectangle.color = "#cc45475a";
                                                        }

                                                        onExited: {
                                                            popoverTrustBackgroundRectangle.color = "#45475a";
                                                        }

                                                        onClicked: {
                                                            delegateItem.modelData.trusted = !delegateItem.modelData.trusted;
                                                            optionsPopup.visible = false;
                                                        }
                                                    }
                                                }

                                                Button {
                                                    Layout.fillWidth: true

                                                    contentItem: Text {
                                                        text: delegateItem.modelData.blocked ? "Unblock" : "Block"
                                                        color: "#cdd6f4"
                                                        font.family: "JetBrainsMono Nerd Font"
                                                        font.pixelSize: 14
                                                        font.bold: true
                                                        horizontalAlignment: Text.AlignHCenter
                                                        verticalAlignment: Text.AlignVCenter
                                                    }

                                                    background: Rectangle {
                                                        id: popoverBlockBackgroundRectangle
                                                        color: "#45475a"
                                                        radius: 6
                                                    }

                                                    MouseArea {
                                                        anchors.fill: parent
                                                        cursorShape: Qt.PointingHandCursor
                                                        hoverEnabled: true

                                                        onEntered: {
                                                            popoverBlockBackgroundRectangle.color = "#cc45475a";
                                                        }

                                                        onExited: {
                                                            popoverBlockBackgroundRectangle.color = "#45475a";
                                                        }

                                                        onClicked: {
                                                            delegateItem.modelData.blocked = !delegateItem.modelData.blocked;
                                                            optionsPopup.visible = false;
                                                        }
                                                    }
                                                }

                                                Button {
                                                    Layout.fillWidth: true

                                                    contentItem: Text {
                                                        text: "Remove"
                                                        color: "#cdd6f4"
                                                        font.family: "JetBrainsMono Nerd Font"
                                                        font.pixelSize: 14
                                                        font.bold: true
                                                        horizontalAlignment: Text.AlignHCenter
                                                        verticalAlignment: Text.AlignVCenter
                                                    }

                                                    background: Rectangle {
                                                        id: popoverRemoveBackgroundRectangle
                                                        color: "#45475a"
                                                        radius: 6
                                                    }

                                                    MouseArea {
                                                        anchors.fill: parent
                                                        cursorShape: Qt.PointingHandCursor
                                                        hoverEnabled: true

                                                        onEntered: {
                                                            popoverRemoveBackgroundRectangle.color = "#cc45475a";
                                                        }

                                                        onExited: {
                                                            popoverRemoveBackgroundRectangle.color = "#45475a";
                                                        }

                                                        onClicked: {
                                                            delegateItem.modelData.forget();
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        hoverEnabled: true

                                        onEntered: {
                                            optionsBackgroundRectangle.color = "#cc45475a";
                                        }

                                        onExited: {
                                            optionsBackgroundRectangle.color = "#45475a";
                                        }

                                        onClicked: {
                                            optionsPopup.buttonPos = optionsButton.mapToItem(null, 0, 0);
                                            optionsPopup.visible = !optionsPopup.visible;
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
