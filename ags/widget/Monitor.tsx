import { Astal, Gdk, Gtk } from "ags/gtk4";
import App from "ags/gtk4/app";
import Hyprland from "gi://AstalHyprland?version=0.1";
import { createBinding, createState, For, This, With } from "ags";
import { exec } from "ags/process";
import { monitorFile, readFile, writeFile } from "ags/file";

type Monitor = {
    name: string;
    description: string;
    width: number;
    height: number;
    refreshRate: number;
    scale: number;
    mirrorOf: string;
    availableModes: string[];
    colorManagementPreset: string;
    sdrBrightness: number;
    sdrSaturation: number;
};

export default function Monitors() {

    const hyprland = Hyprland.get_default();
    const monitors = createBinding(hyprland, "monitors");

    const [monitorsConfig, monitorsConfigSet] = createState(JSON.parse(exec(["hyprctl", "monitors", "-j"])) as Monitor[]);

    const scalings = [1, 1.07, 1.25, 1.33, 1.6, 1.67, 2];
    const colorManagementPresets = ["auto", "srgb", "dcip3", "dp3", "adobe", "wide", "edid", "hdr", "hdredid"];

    return <window
        name={"Monitors"}
        exclusivity={Astal.Exclusivity.NORMAL}
        layer={Astal.Layer.OVERLAY}
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
        visible={false}
        $={(self) => {
            const eventControllerKey = new Gtk.EventControllerKey();

            self.add_controller(eventControllerKey);

            eventControllerKey.connect("key-pressed", (_, keyval, keycode, state) => {
                if (keyval == Gdk.KEY_Escape) {
                    self.hide();
                }
            });

            monitors.subscribe(() => {
                monitorsConfigSet(JSON.parse(exec(["hyprctl", "monitors", "-j"])) as Monitor[]);
            })

            const home = exec(["bash", "-c", "echo $HOME"]);
            monitorFile(`${home}/.config/hypr/monitors.conf`, () => {
                monitorsConfigSet(JSON.parse(exec(["hyprctl", "monitors", "-j"])) as Monitor[]);
            })
        }}>
        <box class={"monitors"} spacing={10} halign={Gtk.Align.CENTER}>
            <For each={monitorsConfig}>
                {(monitor) => {
                    return <box class={"monitor"} orientation={Gtk.Orientation.VERTICAL} spacing={6}>
                        <label class={"name"} label={monitor.name} />
                        <box class={"separator"} />
                        <centerbox>
                            <label $type="start" label={"Mirror: "} />
                            <menubutton $type="end" label={`${monitor.mirrorOf}`} cursor={Gdk.Cursor.new_from_name("pointer", null)}>
                                <popover>
                                    <box orientation={Gtk.Orientation.VERTICAL} spacing={3}>
                                        {
                                            monitorsConfig.get().map((monitor2) => {
                                                if (monitor.name != monitor2.name) {
                                                    return <button
                                                        label={monitor2.name}
                                                        cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                                        onClicked={(self) => {
                                                            const menubutton = self.get_parent()?.get_parent()?.get_parent()?.get_parent() as Gtk.MenuButton;

                                                            monitor.mirrorOf = monitor2.name;
                                                            menubutton.set_label(monitor2.name);
                                                            menubutton.set_active(false);
                                                        }} />
                                                } else {
                                                    return <button
                                                        label={"none"}
                                                        cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                                        onClicked={(self) => {
                                                            const menubutton = self.get_parent()?.get_parent()?.get_parent()?.get_parent() as Gtk.MenuButton;

                                                            monitor.mirrorOf = "none";
                                                            menubutton.set_label("none");
                                                            menubutton.set_active(false);
                                                        }} />
                                                }
                                            })
                                        }
                                    </box>
                                </popover>
                            </menubutton>
                        </centerbox>
                        <centerbox>
                            <label $type="start" label={"Mode: "} />
                            <menubutton
                                $type="end"
                                label={`${monitor.width}x${monitor.height}@${monitor.refreshRate.toFixed(2)}Hz`}
                                cursor={Gdk.Cursor.new_from_name("pointer", null)}>
                                <popover>
                                    <scrolledwindow
                                        hscrollbarPolicy={Gtk.PolicyType.NEVER}
                                        vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
                                        $={(self) => {
                                            const numberOfElements = monitor.availableModes.length;

                                            if (numberOfElements < 6) {
                                                self.minContentHeight = (numberOfElements * 36) + ((numberOfElements - 1) * 3);
                                            } else {
                                                self.minContentHeight = 250;
                                            }
                                        }} >
                                        <box orientation={Gtk.Orientation.VERTICAL} spacing={3}>
                                            {
                                                monitor.availableModes.map((mode) => {
                                                    return <button
                                                        label={mode}
                                                        cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                                        onClicked={(self) => {
                                                            const menubutton = self.get_parent()?.get_parent()?.get_parent()?.get_parent()?.get_parent()?.get_parent() as Gtk.MenuButton;

                                                            const modeSplit = mode.match(/^(\d+)x(\d+)@([\d.]+)Hz$/);

                                                            if (!modeSplit) {
                                                                return;
                                                            }

                                                            monitor.width = Number(modeSplit[1]);
                                                            monitor.height = Number(modeSplit[2]);
                                                            monitor.refreshRate = Number(modeSplit[3]);
                                                            menubutton.set_label(mode);
                                                            menubutton.set_active(false);
                                                        }} />
                                                })
                                            }
                                        </box>
                                    </scrolledwindow>
                                </popover>
                            </menubutton>
                        </centerbox>
                        <centerbox>
                            <label $type="start" label={"Scale: "} />
                            <entry $type="end" text={`${monitor.scale}`} />
                            <menubutton $type="end" label={`${monitor.scale * 100}%`} cursor={Gdk.Cursor.new_from_name("pointer", null)}>
                                <popover>
                                    <box orientation={Gtk.Orientation.VERTICAL} spacing={3}>
                                        {
                                            scalings.map((scaling) => {
                                                return <button
                                                    label={`${scaling * 100}%`}
                                                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                                    onClicked={(self) => {
                                                        const menubutton = self.get_parent()?.get_parent()?.get_parent()?.get_parent() as Gtk.MenuButton;

                                                        monitor.scale = scaling;
                                                        menubutton.set_label(`${scaling * 100}%`);
                                                        menubutton.set_active(false);
                                                    }} />
                                            })
                                        }
                                    </box>
                                </popover>
                            </menubutton>
                        </centerbox>
                        <centerbox>
                            <label $type="start" label={"Color Preset: "} />
                            <entry $type="end" text={`${monitor.colorManagementPreset}`} />
                            <menubutton $type="end" label={monitor.colorManagementPreset} cursor={Gdk.Cursor.new_from_name("pointer", null)}>
                                <popover>
                                    <box orientation={Gtk.Orientation.VERTICAL} spacing={3}>
                                        {
                                            colorManagementPresets.map((preset) => {
                                                return <button
                                                    label={preset}
                                                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                                    onClicked={(self) => {
                                                        const menubutton = self.get_parent()?.get_parent()?.get_parent()?.get_parent() as Gtk.MenuButton;

                                                        monitor.colorManagementPreset = preset;
                                                        menubutton.set_label(preset);
                                                        menubutton.set_active(false);
                                                    }} />
                                            })
                                        }
                                    </box>
                                </popover>
                            </menubutton>
                        </centerbox>
                        <centerbox>
                            <label $type="start" label={"SDR Brightness: "} />
                            <entry
                                $type="end"
                                text={`${monitor.sdrBrightness}`}
                                onNotifyText={(self) => {
                                    Number.isNaN(Number(self.text)) ? self.add_css_class("invalid") : self.remove_css_class("invalid");
                                    monitor.sdrBrightness = Number(self.text);
                                }} />
                        </centerbox>
                        <centerbox>
                            <label $type="start" label={"SDR Saturation: "} />
                            <entry
                                $type="end"
                                text={`${monitor.sdrSaturation}`}
                                onNotifyText={(self) => {
                                    Number.isNaN(Number(self.text)) ? self.add_css_class("invalid") : self.remove_css_class("invalid");
                                    monitor.sdrSaturation = Number(self.text);
                                }} />
                        </centerbox>
                        <box class={"separator"} />
                        <box spacing={10} halign={Gtk.Align.CENTER} homogeneous>
                            <button
                                class={"save"} label={"Save"}
                                cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                onClicked={() => save(monitor, true)} />
                            <button
                                class={"save"} label={"Save To Config"}
                                cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                onClicked={() => save(monitor, false)} />
                        </box>
                    </box>
                }}
            </For>
        </box>
    </window >
}

function save(monitor: Monitor, temporary: boolean) {

    const name = monitor.name;
    const description = monitor.description;
    const mirror = monitor.mirrorOf;
    const mode = `${monitor.width}x${monitor.height}@${monitor.refreshRate}`;
    const scale = monitor.scale;
    const colorManagementPreset = monitor.colorManagementPreset;
    const sdrBrightness = monitor.sdrBrightness;
    const sdrSaturation = monitor.sdrSaturation;

    if (Number.isNaN(sdrBrightness)) {
        exec(["notify-send", "-u", "critical", "Invalid value for Sdr Brightness"]);
        return;
    }

    if (Number.isNaN(sdrSaturation)) {
        exec(["notify-send", "-u", "critical", "Invalid value for Sdr Saturation"]);
        return;
    }

    let config = "";

    if (monitor.name.includes("eDP")) {
        config = `${name}, ${mode}, auto, ${scale}, mirror, ${mirror}, bitdepth, auto, cm, ${colorManagementPreset}, sdrbrightness, ${sdrBrightness}, sdrsaturation, ${sdrSaturation}`;
    } else {
        config = `desc:${description}, ${mode}, auto, ${scale}, mirror, ${mirror}, bitdepth, auto, cm, ${colorManagementPreset}, sdrbrightness, ${sdrBrightness}, sdrsaturation, ${sdrSaturation}`;
    }

    if (temporary) {
        exec(["hyprctl", "keyword", "monitor", config]);
    } else {
        const home = exec(["bash", "-c", "echo $HOME"]);
        let currentContent = readFile(`${home}/.config/hypr/monitors.conf`).split('\n');

        let found = false;

        const updatedConfig = currentContent.map(line => {
            if (line.includes(name) || line.includes(description)) {
                found = true;
                return `monitor = ${config}`;
            }
            return line;
        });

        if (!found) {
            updatedConfig.push(`monitor = ${config}`);
        }

        writeFile(`${home}/.config/hypr/monitors.conf`, updatedConfig.join('\n'));
    }
}