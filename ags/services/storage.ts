import GObject, { register, property, signal } from "astal/gobject"
import { exec, subprocess } from "astal";

@register()
class StorageService extends GObject.Object {
    @property(Object) declare devices: any;

    @signal(Number) declare devices_changed: (n: number) => void;
    @signal(Number) declare changed: (n: number) => void;

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
        this.emit('changed', this.devices);
        this.emit('devices_changed', this.devices);
    }
}



const service = new StorageService;
export default service;