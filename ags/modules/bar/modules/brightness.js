import brightness from './../../../services/brightness.js';

export function Brightness() {

    const icons = {
        84: "󰃠",
        70: "󰃟",
        56: "󰃞",
        42: "󰃝",
        28: "󰃜",
        14: "󰃛",
        0: "󰃚"
    }

    function getIcon() {
        const icon = [84, 70, 56, 42, 28, 14, 0].find(threshold => threshold <= brightness.screen_value* 100);
        
        return `${icons[icon]}`;
    }

    const percentage = Widget.Label({
        class_name: "brightness-text",
        label: "0%",
        setup: self => {
            self.hook(brightness, () => {
                self.label = `${Math.round(brightness.screen_value * 100)}%`;
            })
        }
    })

    const icon = Widget.Label({
        class_name: "brightness-icon",
        label: "󰃠",
        setup: self => {
            self.hook(brightness, () => {
                self.label = getIcon();
            })
        }
    })

    return Widget.Button({
        class_name: "brightness",
        on_scroll_up: () => Utils.exec("brightnessctl s +1%"),
        on_scroll_down: () => Utils.exec("brightnessctl s 1%-"),
        child: Widget.Box({
            spacing: 8,
            children: [percentage, icon],
        }),
    })
}