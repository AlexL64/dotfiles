import { App, Astal, Gtk } from "astal/gtk3";
import BrightnessService from "../../../services/brightness";
import { bind, timeout } from "astal";

export default function Brightness() {

    const brightness = BrightnessService.get_default();

    return <window
        name={"brightness"}
        marginTop={10}
        marginRight={170}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}>
        <box className={"brightness"} vertical spacing={10}>
            <box className={"screen"}>
                <label className={"icon"} label={bind(brightness, "screen").as((b) => {
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
                <box vertical>
                    <box>
                        <label label={"Screeen Brightness"} xalign={Gtk.Align.FILL} hexpand />
                        <label label={bind(brightness, "screen").as((b) => `${Math.floor(b * 100)}%`)} />
                    </box>
                    <slider
                        className={"slider"}
                        widthRequest={300}
                        value={bind(brightness, "screen")}
                        onDragged={(self) => {
                            brightness.screen = self.value;
                        }}
                        onScrollEvent={(self) => {
                            timeout(0, () => {
                                self.value = brightness.screen;
                            })
                        }}
                    />
                    <box className={"presets"} homogeneous>
                        {
                            Array.from({ length: 11 }, (_, i) => i).map((i) => {
                                return <button
                                    cursor={"pointer"}
                                    label={`${i * 10}`}
                                    onClick={() => {
                                        brightness.screen = i / 10;
                                    }}
                                />
                            })
                        }
                    </box>
                </box>
            </box>
            <box className={"keyboard"} vertical>
                <label label={"Keyboard Backlight"} xalign={Gtk.Align.FILL} />
                <slider
                    className={"selector"}
                    expand
                    valuePos={3}
                    drawValue
                    min={0.1}
                    max={0.3}
                    value={bind(brightness, "kbd").as((p) => {
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
                    setup={(self) => {
                        self.add_mark(0.1, Gtk.PositionType.TOP, 'Off')
                        self.add_mark(0.2, Gtk.PositionType.TOP, 'Low')
                        self.add_mark(0.3, Gtk.PositionType.TOP, 'High')
                    }}
                    onDragged={(self) => {
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
                    }}
                />
            </box>
        </box>
    </window>
}