import GObject, { property, register } from "ags/gobject";
import { exec, subprocess } from "ags/process";

type Status = {
    state: string;
    infos: {
        ipv4: string | undefined,
        country: string | undefined,
        city: string | undefined,
        hostname: string | undefined,
    };
};

@register({ GTypeName: "Mullvad" })
export default class Mullvad extends GObject.Object {
    static instance: Mullvad;
    static get_default() {
        if (!this.instance)
            this.instance = new Mullvad();

        return this.instance;
    }

    @property(Object)
    status: Status = {
        state: "disconnected",
        infos: {
            ipv4: undefined,
            country: undefined,
            city: undefined,
            hostname: undefined
        }
    };

    constructor() {
        super();

        this.#onChange();

        subprocess(
            ['journalctl', '-u', 'mullvad-daemon', '-f', '--merge'],
            (output) => {

                if (output.includes("state:")) {
                    this.#onChange();
                }
            },
            (err) => logError(err),
        )
    }

    async #onChange() {
        var status = JSON.parse(exec(["bash", "-c", `mullvad status --json`]));

        status.infos = status.details.location;

        if (status.infos == null) {
            status.infos = {
                ipv4: undefined,
                country: undefined,
                city: undefined,
                hostname: undefined
            }
        }

        this.status = status;
        this.notify("status");
    }
}