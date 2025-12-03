import { createBinding, createState, For } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import App from "ags/gtk4/app";
import Notifd from "gi://AstalNotifd?version=0.1"
import Hyprland from "gi://AstalHyprland?version=0.1";
import Pango from "gi://Pango?version=1.0";

export default function NotificationsPanel() {

    const notifyd = Notifd.get_default();

    const notifications = createBinding(notifyd, "notifications");
    const hyprland = Hyprland.get_default();

    const [processedNotifications, processedNotificationsSet] = createState(processNotifications(notifyd.notifications));

    return <window
        name={"NotificationsPanel"}
        marginTop={10}
        marginBottom={10}
        marginRight={10}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}
        $={(self) => {
            notifications.subscribe(() => {
                processedNotificationsSet(processNotifications(notifyd.notifications));
            })
        }}>
        <box class={"notifications_panel"} vexpand orientation={Gtk.Orientation.VERTICAL}>
            <centerbox class={"top"}>
                <label $type="start" class={"title"} label={"Notifications"} />
                <button
                    $type="end"
                    class={"clear"}
                    label={"Clear"}
                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                    onClicked={() => {
                        App.get_window("NotificationsPanel")?.hide();
                        notifyd.notifications.forEach((notification) => {
                            notification.dismiss();
                        })
                    }} />
            </centerbox>
            <scrolledwindow overlayScrolling={false} vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC} vexpand>
                <box orientation={Gtk.Orientation.VERTICAL} spacing={10} valign={Gtk.Align.START}>
                    <For each={processedNotifications}>
                        {(notification) => {
                            return <box class={"notification"} spacing={10} $={(self) => {
                                if (notification.notif.urgency == Notifd.Urgency.CRITICAL) {
                                    self.add_css_class("urgent");
                                }
                            }}>
                                <Gtk.GestureClick
                                    propagationPhase={Gtk.PropagationPhase.CAPTURE}
                                    button={Gdk.BUTTON_SECONDARY}
                                    onPressed={() => {
                                        notification.list.forEach((notif) => {
                                            notif.dismiss();
                                        });
                                    }}
                                />
                                <box class={"image"} valign={Gtk.Align.CENTER}>
                                    <image
                                        $={(self) => {
                                            if (notification.notif.image != "") {
                                                self.file = notification.notif.image;
                                            } else if (notification.notif.appIcon != "") {
                                                self.set_from_icon_name(notification.notif.appIcon);
                                            } else if (iconExist(notification.notif.desktopEntry)) {
                                                self.set_from_icon_name(notification.notif.desktopEntry);
                                            } else if (iconExist(notification.notif.appName)) {
                                                self.set_from_icon_name(notification.notif.appName);
                                            } else {
                                                self.iconName = "bell";
                                            }

                                        }}
                                        pixelSize={64} />
                                    <image
                                        class={"desktopentry"}
                                        pixelSize={16}
                                        $={(self) => {
                                            if (notification.notif.image != "") {
                                                if (notification.notif.appIcon != "") {
                                                    self.set_from_icon_name(notification.notif.appIcon);
                                                } else if (iconExist(notification.notif.desktopEntry)) {
                                                    self.set_from_icon_name(notification.notif.desktopEntry);
                                                } else if (iconExist(notification.notif.appName)) {
                                                    self.set_from_icon_name(notification.notif.appName);
                                                }
                                            }
                                        }}
                                        valign={Gtk.Align.END} />
                                </box>
                                <box orientation={Gtk.Orientation.VERTICAL} hexpand>
                                    <label
                                        class={"summary"}
                                        label={notification.notif.summary}
                                        halign={Gtk.Align.START}
                                        maxWidthChars={35}
                                        ellipsize={Pango.EllipsizeMode.END} />
                                    <label
                                        class={"body"}
                                        halign={Gtk.Align.START}
                                        label={notification.notif.body}
                                        lines={6}
                                        singleLineMode
                                        maxWidthChars={35}
                                        ellipsize={Pango.EllipsizeMode.END}
                                        wrapMode={Gtk.WrapMode.WORD} />
                                    <box class={"actions"} spacing={10} homogeneous visible={notification.notif.actions.length > 0}>
                                        {
                                            notification.notif.actions.map((action) => {

                                                return <button
                                                    label={action.label}
                                                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                                    onClicked={() => {

                                                        notification.notif.invoke(action.id);

                                                        const workspaces = hyprland.workspaces;
                                                        const index = workspaces.findIndex(ws =>
                                                            ws.clients.some(client => client.class == notification.notif.appName)
                                                        );

                                                        if (index != -1) {
                                                            App.get_window("NotificationsPanel")?.hide();
                                                            hyprland.dispatch("workspace", `${workspaces[index].id}`);
                                                        }
                                                    }} />
                                            })
                                        }
                                    </box>
                                    <box></box>
                                </box>
                                <centerbox orientation={Gtk.Orientation.VERTICAL}>
                                    <button
                                        $type="start"
                                        class={"delete"}
                                        label={""}
                                        halign={Gtk.Align.END}
                                        cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                        onClicked={() => {
                                            notification.list.forEach((notif) => {
                                                notif.dismiss();
                                            });
                                        }} />

                                    <label $type="end" class={"count"} visible={notification.list.length > 1} label={`x${notification.list.length}`} />
                                </centerbox>
                            </box>
                        }}
                    </For>
                </box>
            </scrolledwindow>
        </box>
    </window >
}

function processNotifications(notifications: Notifd.Notification[]): { notif: Notifd.Notification, list: Notifd.Notification[] }[] {

    notifications = notifications.sort((a, b) => b.time - a.time);

    notifications = notifications.sort((a, b) => {
        if (a.urgency === Notifd.Urgency.CRITICAL && b.urgency !== Notifd.Urgency.CRITICAL) return -1;
        if (a.urgency !== Notifd.Urgency.CRITICAL && b.urgency === Notifd.Urgency.CRITICAL) return 1;
        return 0;
    });

    return mergeNotifications(notifications);
}

function mergeNotifications(notifications: Notifd.Notification[]): { notif: Notifd.Notification, list: Notifd.Notification[] }[] {

    const mergedNotifications: { notif: Notifd.Notification, list: Notifd.Notification[] }[] = []

    const notificationsInfos: { index: number, list: number[], value: string }[] = [];

    notifications.forEach((n, i) => {
        const value = JSON.stringify({
            appName: n.appName,
            appIcon: n.appIcon,
            summary: n.summary,
            body: n.body,
            actions: n.actions,
            urgency: n.urgency
        });

        const index = notificationsInfos.findIndex(item => item.value === value);

        if (index == -1) {
            notificationsInfos.push({ index: i, list: [i], value: value });
        } else {
            notificationsInfos[index].list.push(i);
        }
    })

    notificationsInfos.forEach((infos) => {
        mergedNotifications.push({
            notif: notifications[infos.index],
            list: infos.list.map((index) => notifications[index])
        });
    })

    return mergedNotifications;
}

function iconExist(icon: string): boolean {

    const display = Gdk.Display.get_default();

    if (!display) {
        return false;
    }

    const theme = Gtk.IconTheme.get_for_display(display);

    if (theme.has_icon(icon)) {
        return true;
    }

    return false;
}