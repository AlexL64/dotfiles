import QtQuick
import QtQuick.Layouts
import qs.Bar.Modules.SystemInfos

Rectangle {
    id: systemPanel
    Layout.fillHeight: true
    radius: 12
    color: "#313244"
    implicitWidth: content.width

    RowLayout {
        id: content
        height: parent.height
        spacing: 0

        Rectangle {
            implicitHeight: 20
            implicitWidth: 2
            color: "#45475a"
            radius: 2
        }

        Rectangle {
            implicitHeight: 20
            implicitWidth: 2
            color: "#45475a"
            radius: 2
        }

        Storage {}

        Rectangle {
            implicitHeight: 20
            implicitWidth: 2
            color: "#45475a"
            radius: 2
        }

        Brightness {}

        Rectangle {
            implicitHeight: 20
            implicitWidth: 2
            color: "#45475a"
            radius: 2
        }

        Battery {}
    }
}
