import { Astal, Gdk, Gtk } from "ags/gtk4";
import BrightnessService from "../../../services/Brightness";
import App from "ags/gtk4/app";
import { createBinding } from "ags";
import { timeout } from "ags/time";

export default function Brightness() {

    const brightness = BrightnessService.get_default();

    return <window
        name={"Brightness"}
        marginTop={10}
        marginRight={175}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}>
        <box class={"brightness"} orientation={Gtk.Orientation.VERTICAL} spacing={10}>
            <box class={"screen"}>
                <label class={"icon"} label={createBinding(brightness, "screen").as((b) => {
                    const icons = {
                        84: "󰃠",
                        70: "󰃟",
                        56: "󰃞",
                        42: "󰃝",
                        28: "󰃜",
                        14: "󰃛",
                        0: "󰃚"
                    }

                    const icon = [84, 70, 56, 42, 28, 14, 0].find(threshold => threshold <= b * 100) as keyof typeof icons;

                    return `${icons[icon]}`;
                })} />
                <box orientation={Gtk.Orientation.VERTICAL}>
                    <box>
                        <label label={"Screeen Brightness"} xalign={Gtk.Align.FILL} hexpand />
                        <label label={createBinding(brightness, "screen").as((b) => `${Math.floor(b * 100)}%`)} />
                    </box>
                    <slider
                        class={"slider"}
                        widthRequest={300}
                        value={createBinding(brightness, "screen")}
                        onValueChanged={(self) => {
                            timeout(50, () => {
                                brightness.screen = self.value;
                            })
                        }} />
                    <box class={"presets"} homogeneous>
                        {
                            Array.from({ length: 11 }, (_, i) => i).map((i) => {
                                return <button
                                    cursor={Gdk.Cursor.new_from_name("pointer", null)}
                                    label={`${i * 10}`}
                                    onClicked={() => {
                                        brightness.screen = i / 10;
                                    }}
                                />
                            })
                        }
                    </box>
                </box>
            </box>
            <box class={"keyboard"} orientation={Gtk.Orientation.VERTICAL}>
                <label label={"Keyboard Backlight"} xalign={Gtk.Align.FILL} />
                <slider
                    class={"selector"}
                    vexpand
                    hexpand
                    valuePos={3}
                    drawValue
                    min={0.1}
                    max={0.3}
                    value={createBinding(brightness, "kbd").as((p) => {
                        switch (p) {
                            case 0:
                                return 0.1;
                            case 1:
                                return 0.2;
                            case 2:
                                return 0.3;
                            default:
                                return 0.1
                        }
                    })}
                    $={(self) => {
                        self.add_mark(0.1, Gtk.PositionType.TOP, 'Off')
                        self.add_mark(0.2, Gtk.PositionType.TOP, 'Low')
                        self.add_mark(0.3, Gtk.PositionType.TOP, 'High')
                    }}
                    onValueChanged={(self) => {
                        timeout(50, () => {
                            switch (self.value) {
                                case 0.1:
                                    brightness.kbd = 0;
                                    break;
                                case 0.2:
                                    brightness.kbd = 1;
                                    break;
                                case 0.3:
                                    brightness.kbd = 2;
                                    break;
                            }
                        })
                    }}
                />
            </box>
        </box>
    </window>
}