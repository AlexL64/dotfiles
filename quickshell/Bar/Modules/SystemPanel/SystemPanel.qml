import QtQuick
import QtQuick.Layouts
import qs.Bar.Modules.SystemPanel.Modules

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
            implicitWidth: 36
            Layout.fillHeight: true
            radius: 12
            color: "#313244"
        }

        Rectangle {
            implicitHeight: 20
            implicitWidth: 2
            color: "#45475a"
            radius: 2
        }

        Rectangle {
            implicitWidth: 36
            Layout.fillHeight: true
            radius: 12
            color: "#313244"
        }

        Rectangle {
            implicitHeight: 20
            implicitWidth: 2
            color: "#45475a"
            radius: 2
        }

        Rectangle {
            implicitWidth: 36
            Layout.fillHeight: true
            radius: 12
            color: "#313244"
        }

        Rectangle {
            implicitHeight: 20
            implicitWidth: 2
            color: "#45475a"
            radius: 2
        }

        Tray {}

        Rectangle {
            implicitHeight: 20
            implicitWidth: 2
            color: "#45475a"
            radius: 2
        }

        Power {}
    }
}
