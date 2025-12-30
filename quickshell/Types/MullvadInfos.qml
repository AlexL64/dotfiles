import QtQuick

QtObject {
    required property var lastIpcObject
    readonly property string ipv4: lastIpcObject?.ipv4 ?? null
    readonly property string country: lastIpcObject?.country ?? null
    readonly property string city: lastIpcObject?.city ?? null
    readonly property string hostname: lastIpcObject?.hostname ?? null
}
