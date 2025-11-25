import GObject, { property, register } from "ags/gobject";
import { exec, subprocess } from "ags/process";

type Status = {
    state: string;
    details: {
        location: {
            ipv4: string | null,
            country: string | null,
            city: string | null,
            hostname: string | null,
        };
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
        details: {
            location: {
                ipv4: null,
                country: null,
                city: null,
                hostname: null
            }
        }
    };

    constructor() {
        super();

        this.#onChange();

        subprocess(
            ['journalctl', '-u', 'mullvad-daemon', '-f', '--merge'],
            (output) => {

                if(output.includes("state:")){
                    // print(output);
                    this.#onChange();
                }
            },
            (err) => logError(err),
        )
    }

    async #onChange() {
        var status = JSON.parse(exec(["bash", "-c", `mullvad status --json`])) as Status;

        this.status = status;
        this.notify("status");
    }
}