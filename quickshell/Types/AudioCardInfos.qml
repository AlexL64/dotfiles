import QtQuick

QtObject {
    required property var lastIpcObject
    readonly property int id: lastIpcObject?.id ?? null
    readonly property string name: lastIpcObject?.name ?? null
    readonly property string description: lastIpcObject?.description ?? null
    readonly property string activeProfile: lastIpcObject?.activeProfile ?? null
    readonly property list<string> profiles: lastIpcObject?.profiles ?? null
}
