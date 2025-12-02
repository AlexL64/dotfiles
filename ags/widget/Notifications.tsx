import { Astal, Gdk, Gtk } from "ags/gtk4";
import App from "ags/gtk4/app";
import Notifd from "gi://AstalNotifd?version=0.1"
import Pango from "gi://Pango?version=1.0";
import { createBinding, createState, For } from "ags";
import Hyprland from "gi://AstalHyprland?version=0.1";

export default function Notifications() {

    const notifyd = Notifd.get_default();
    const hyprland = Hyprland.get_default();

    const dontDisturb = createBinding(notifyd, "dontDisturb");
    const notifications = createBinding(notifyd, "notifications");

    const [processedNotifications, processedNotificationsSet] = createState(processNotifications(notifyd.notifications, notifyd));

    return <window
        name={"Notifications"}
        namespace={"noanim"}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        layer={Astal.Layer.OVERLAY}
        application={App}
        anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT}
        marginBottom={10}
        marginRight={10}
        defaultHeight={-1}
        defaultWidth={-1}
        visible={processedNotifications.as((n) => n.length > 0)}
        $={(self) => {
            const panel = App.get_window("NotificationsPanel");

            if (panel != undefined) {
                panel.connect("notify::visible", () => {
                    processedNotificationsSet(processNotifications(notifyd.notifications, notifyd));
                })
            }

            dontDisturb.subscribe(() => {
                processedNotificationsSet(processNotifications(notifyd.notifications, notifyd));
            })

            notifications.subscribe(() => {
                processedNotificationsSet(processNotifications(notifyd.notifications, notifyd));
            })
        }}>
        <box
            class={"notifications"}
            orientation={Gtk.Orientation.VERTICAL}
            spacing={10}
            valign={Gtk.Align.END}>
            <For each={processedNotifications}>
                {(notification) => {
                    return <box class={"notification"} spacing={10} $={(self) => {
                        if (notification.urgency != Notifd.Urgency.CRITICAL) {
                            setTimeout(() => {
                                processedNotificationsSet(processNotifications(notifyd.notifications, notifyd));
                            }, 10000);
                        } else {
                            self.add_css_class("urgent");
                        }
                    }}>
                        <Gtk.GestureClick
                            propagationPhase={Gtk.PropagationPhase.CAPTURE}
                            button={Gdk.BUTTON_SECONDARY}
                            onPressed={() => {
                                notification.dismiss();
                            }}
                        />
                        <box class={"image"} valign={Gtk.Align.CENTER}>
                            <image
                                $={(self) => {
                                    if (notification.image != "") {
                                        self.file = notification.image;
                                    } else {
                                        self.iconName = "bell";
                                    }
                                }}
                                pixelSize={64} />
                            <image
                                class={"desktopentry"}
                                pixelSize={16}
                                $={(self) => {
                                    const display = Gdk.Display.get_default();

                                    if (!display) {
                                        return;
                                    }

                                    const theme = Gtk.IconTheme.get_for_display(display);

                                    if (theme.has_icon(notification.desktopEntry)) {
                                        self.set_from_icon_name(notification.desktopEntry);
                                    }
                                }}
                                valign={Gtk.Align.END} />
                        </box>
                        <box orientation={Gtk.Orientation.VERTICAL} hexpand>
                            <label
                                class={"summary"}
                                label={notification.summary}
                                halign={Gtk.Align.START}
                                maxWidthChars={35}
                                ellipsize={Pango.EllipsizeMode.END} />
                            <label
                                class={"body"}
                                halign={Gtk.Align.START}
                                label={notification.body}
                                lines={6}
                                singleLineMode
                                maxWidthChars={35}
                                ellipsize={Pango.EllipsizeMode.END}
                                wrapMode={Gtk.WrapMode.WORD} />
                            <box class={"actions"} spacing={10} homogeneous visible={notification.actions.length > 0}>
                                {
                                    notification.actions.map((action) => {

                                        return <button
                                            label={action.label}
                                            cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                            onClicked={() => {

                                                notification.invoke(action.id);

                                                const workspaces = hyprland.workspaces;
                                                const index = workspaces.findIndex(ws =>
                                                    ws.clients.some(client => client.class == notification.appName)
                                                );

                                                if (index != -1) {
                                                    hyprland.dispatch("workspace", `${workspaces[index].id}`);
                                                }
                                            }} />
                                    })
                                }
                            </box>
                            <box></box>
                        </box>
                        <button
                            class={"delete"}
                            label={""}
                            valign={Gtk.Align.START}
                            cursor={Gdk.Cursor.new_from_name("pointer", null)}
                            onClicked={() => {
                                notification.dismiss();
                            }} />
                    </box>
                }}
            </For>
        </box>
    </window >
}

function processNotifications(notifications: Notifd.Notification[], notifyd: Notifd.Notifd): Notifd.Notification[] {

    const panel = App.get_window("NotificationsPanel");

    for (let i = notifications.length - 1; i >= 0; i--) {
        if (panel != undefined && panel.visible) {
            notifications.splice(i, 1);
        } else {
            if (notifications[i].urgency != Notifd.Urgency.CRITICAL) {
                if (notifyd.dontDisturb || Math.floor(Date.now() / 1000) - notifications[i].time >= 10) {
                    notifications.splice(i, 1);
                }
            }
        }
    }

    notifications = notifications.sort((a, b) => a.time - b.time);

    notifications = notifications.sort((a, b) => {
        if (a.urgency === Notifd.Urgency.CRITICAL && b.urgency !== Notifd.Urgency.CRITICAL) return 1;
        if (a.urgency !== Notifd.Urgency.CRITICAL && b.urgency === Notifd.Urgency.CRITICAL) return -1;
        return 0;
    });

    return notifications;
}