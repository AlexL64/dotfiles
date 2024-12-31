import GObject, { register, property, signal } from "astal/gobject"
import { exec, monitorFile } from "../../../../../usr/share/astal/gjs";

@register()
class BrightnessService extends GObject.Object {
    @property(Number) declare screen_value: number;

    @signal(Number) declare screen_changed: (n: number) => void;
    @signal(Number) declare changed: (n: number) => void;

    #interface = exec("sh -c 'ls -w1 /sys/class/backlight | head -1'");
    #max = Number(exec('brightnessctl max'));

    constructor() {
        super();

        const brightness = `/sys/class/backlight/${this.#interface}/brightness`;
        monitorFile(brightness, () => this.#onChange());

        this.#onChange();
    }

    #onChange() {
        const newValue = Number(exec('brightnessctl get')) / this.#max;

        if (newValue !== this.screen_value) {
            this.screen_value = newValue;
            this.emit('changed', this.screen_value);
            this.emit('screen_changed', this.screen_value);
        }
    }
}



const service = new BrightnessService;
export default service;