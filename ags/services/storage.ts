import GObject, { register, property, signal } from "astal/gobject"
import { exec, subprocess } from "astal";

@register({ GTypeName: "Storage" })
export default class Storage extends GObject.Object {
    static instance: Storage;
    static get_default() {
        if (!this.instance)
            this.instance = new Storage();

        return this.instance;
    }

    @property(Object)
    devices: any;

    constructor() {
        super();

        this.#onChange();

        subprocess(
            ['bash', '-c', 'udevadm monitor --kernel --subsystem-match=block'],
            (output) => {
                this.#onChange();
            },
            (err) => logError(err),
        )

        setInterval(() => { this.#onChange() }, 300000);
    }

    #onChange() {

        const devices = exec([
            'bash',
            '-c',
            `lsblk -OJb`
        ])

        this.devices = JSON.parse(devices).blockdevices;
        this.notify("devices");
    }
}