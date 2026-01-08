pragma Singleton
import Quickshell
import Quickshell.Services.Notifications
import QtQuick

Singleton {
    id: root

    property list<Notification> mergedNotifications: notificationsServer.trackedNotifications.values
    property list<Notification> temporaryNotifications: []
    property list<Notification> sortedTemopraryNotifications: sortNotifications(temporaryNotifications)
    property bool dnd: false

    onDndChanged: {
        if (dnd) {
            root.temporaryNotifications = [];
        }
    }

    function sortNotifications(notifications) {
        notifications = notifications.slice().filter(item => item != null);

        return notifications.sort((a, b) => {
            if ((a.urgency == NotificationUrgency.Critical) != (b.urgency == NotificationUrgency.Critical)) {
                return a.urgency == NotificationUrgency.Critical ? 1 : -1;
            }

            return a.id - b.id;
        });
    }

    function dismiss(notification, parmanent = false) {
        const index = root.temporaryNotifications.indexOf(notification);

        if (index !== -1) {
            root.temporaryNotifications.splice(index, 1);
        }

        if (parmanent) {
            notification.dismiss();
        }
    }

    function dismissAll() {
        temporaryNotifications = [];

        const notifications = [...notificationsServer.trackedNotifications.values];

        notifications.forEach(n => {
            n.dismiss();
        });
    }

    ElapsedTimer {
        id: elapsedTimer
    }

    NotificationServer {
        id: notificationsServer
        actionsSupported: true
        bodyHyperlinksSupported: false
        actionIconsSupported: true
        persistenceSupported: false
        bodyImagesSupported: true
        bodySupported: true
        bodyMarkupSupported: false
        imageSupported: true
        keepOnReload: true

        onNotification: function (notification) {
            notification.tracked = true;

            if (elapsedTimer.elapsed() >= 0.1 && !root.dnd && notification.urgency != NotificationUrgency.Critical) {
                root.temporaryNotifications.push(notification);

                var timer = Qt.createQmlObject('import QtQuick; Timer { interval: 10000; repeat: false; }', root) as Timer;
                timer.onTriggered.connect(function () { // qmllint disable missing-property
                    root.dismiss(notification, false);
                });
                timer.start();
            } else if (notification.urgency == NotificationUrgency.Critical) {
                root.temporaryNotifications.push(notification);
            }
        }
    }
}
