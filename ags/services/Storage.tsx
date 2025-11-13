import GObject, { property, register } from "ags/gobject";
import { exec, subprocess } from "ags/process";

type Devices = {
    tran: string;
    model: string;
    path: string;
    size: number;
    children: {
        partlabel: string;
        mountpoints: string[];
        path: string;
        fstype: string;
        fsused: number;
        size: number;
        children: {
            partlabel: string;
            mountpoints: string[];
            path: string;
            fstype: string;
            fsused: number;
            size: number;
        }[]
    }[]
}[];

@register({ GTypeName: "Storage" })
export default class Storage extends GObject.Object {
    static instance: Storage;
    static get_default() {
        if (!this.instance)
            this.instance = new Storage();

        return this.instance;
    }

    @property(Object)
    devices: Devices = [];

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