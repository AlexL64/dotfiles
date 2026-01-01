import Quickshell
import Quickshell.Widgets
import Quickshell.Bluetooth
import QtQuick
import QtQuick.Layouts
import QtQuick.Controls

Button {
    id: bluetooth
    Layout.fillHeight: true
    implicitWidth: 36

    contentItem: Item {
        IconImage {
            implicitSize: 24
            source: getIcon(Bluetooth.defaultAdapter) // qmllint disable unresolved-type
            anchors.centerIn: parent

            function getIcon(adapter) {
                var icon = "";

                if (adapter == null || adapter.state == BluetoothAdapterState.Disabled || adapter.state == BluetoothAdapterState.Blocked || adapter.state == BluetoothAdapterState.Disabling) {
                    icon = "/usr/share/icons/Papirus/24x24/panel/bluetooth-disabled.svg";
                } else if (adapter.state == BluetoothAdapterState.Enabled || adapter.state == BluetoothAdapterState.Enabling) {
                    if (adapter.devices.values.some(item => item.connected)) {
                        icon = "/usr/share/icons/Papirus/24x24/panel/bluetooth-paired.svg";
                    }
                    icon = "/usr/share/icons/Papirus/24x24/panel/bluetooth-active.svg";
                }

                return Quickshell.iconPath(icon);
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
            Quickshell.execDetached(["qs", "ipc", "call", "bluetooth", "toggle"]);
        }
    }
}
