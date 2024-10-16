function generateDevice(device) {
    const deviceData = Utils.exec(`upower -i ${device}`).split("\n");
    var model = "";
    var state = "";
    var percentage = "";
    var icon_name = "";

    deviceData.forEach((data) => {
        if (data.includes("model")) {
            model = data.replace("model:", "").trim();
        } else if (data.includes("state")) {
            state = data.replace("state:", "").trim();
        } else if (data.includes("percentage")) {
            percentage = data.replace("percentage:", "").replace("%", "").trim();
        } else if (data.includes("icon-name")) {
            icon_name = data.replace("icon-name:", "").replaceAll("'", "").trim();
        }
    });

    return {
        "url": device,
        "model": model,
        "state": state,
        "percentage": percentage,
        "icon_name": icon_name,
    }
}

class DevicesBatteryService extends Service {
    static {
        Service.register(
            this,
            {
                'devices-changed': ['float'],
            },
            {
                'devices': ['jsobject', 'r'],
            },
        );
    }

    #excludedDevices = [
        'battery_BAT0',
        'DisplayDevice',
        'line_power'
    ];

    #devices = [];

    get devices() {
        return Object.assign(this.#devices);
    }

    constructor() {
        super();

        this.#onChange(true);

        Utils.subprocess(
            ['bash', '-c', 'upower -m'],
            (output) => {
                this.#onChange(false, output);
            },
            (err) => logError(err),
        )
    }

    #onChange(init = false, output = "") {
        if (init) {
            const devices_list = Utils.exec("upower -e").split('\n');

            devices_list.forEach((device) => {
                if (!this.#excludedDevices.some(word => device.includes(word))) {
                    this.#devices.push(generateDevice(device));
                }
            })
        } else {
            if (!this.#excludedDevices.some(word => output.includes(word))) {
                var changed = false;
                const device = output.substring(output.indexOf("/"));

                if (output.includes("device changed:")) {
                    const index = this.#devices.findIndex(e => e.url == device);
                    this.#devices[index] = generateDevice(device);
                    changed = true;
                } else if (output.includes("device added:")) {
                    this.#devices.push(generateDevice(device));
                    changed = true;
                } else if (output.includes("device removed:")) {
                    const index = this.#devices.findIndex(e => e.url == device);
                    this.#devices.splice(index, 1);
                    changed = true;
                }

                if (changed) {
                    this.emit('changed');
                    this.notify('devices');
                }
            }
        }
    }
}

const service = new DevicesBatteryService;
export default service;