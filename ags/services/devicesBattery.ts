import { exec, GObject, property, register, signal, subprocess } from "astal";

@register()
class DevicesBatteryService extends GObject.Object {

    @property(Object) declare devices: { url: string; model: string; state: string; percentage: number; icon: string; }[];

    @signal(Number) declare devices_changed: (n: number) => void;
    @signal(Number) declare changed: (n: number) => void;

    #excludedDevices = [
        'battery_BAT0',
        'DisplayDevice',
        'line_power'
    ];

    constructor() {
        super();

        this.devices = [];

        this.#onChange(true);

        subprocess(
            ['bash', '-c', 'upower -m'],
            (output) => {
                this.#onChange(false, output);
            },
            (err) => logError(err),
        )
    }

    #onChange(init = false, output = "") {
        if (init) {
            const devices_list = exec("upower -e").split('\n');

            devices_list.forEach((device) => {
                if (!this.#excludedDevices.some(word => device.includes(word))) {
                    this.devices.push(this.generateDevice(device));

                    this.notify('devices');
                    this.emit('changed', this.devices);
                    this.emit('devices_changed', this.devices);
                }
            })
        } else {
            if (!this.#excludedDevices.some(word => output.includes(word))) {
                const device = output.substring(output.indexOf("/"));

                if (output.includes("device changed:")) {
                    const index = this.devices.findIndex(e => e.url == device);
                    this.devices[index] = this.generateDevice(device);
                } else if (output.includes("device added:")) {
                    this.devices.push(this.generateDevice(device));
                } else if (output.includes("device removed:")) {
                    const index = this.devices.findIndex(e => e.url == device);
                    this.devices.splice(index, 1);
                }

                this.notify('devices');
                this.emit('changed', this.devices);
                this.emit('devices_changed', this.devices);
            }
        }
    }

    private generateDevice(device: string) {
        const deviceData = exec(`upower -i ${device}`).split("\n");
        var model = "";
        var state = "";
        var percentage = 0;
        var icon = "";

        deviceData.forEach((data) => {
            if (data.includes("model")) {
                model = data.replace("model:", "").trim();
            } else if (data.includes("state")) {
                state = data.replace("state:", "").trim();
            } else if (data.includes("percentage")) {
                percentage = Number(data.replace("percentage:", "").replace("%", "").trim()) / 100;
            } else if (data.includes("icon-name")) {
                icon = data.replace("icon-name:", "").replaceAll("'", "").trim();
            }
        });

        return {
            "url": device,
            "model": model,
            "state": state,
            "percentage": percentage,
            "icon": icon,
        }
    }
}

const service = new DevicesBatteryService;
export default service;