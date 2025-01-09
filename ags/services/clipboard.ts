import GObject, { register, property, signal } from "astal/gobject"
import { exec, subprocess } from "../../../../../usr/share/astal/gjs";

@register()
class ClipboardService extends GObject.Object {
    @property(Object) declare entries: { id: number, text: string }[];

    @signal(Number) declare entries_changed: (n: number) => void;
    @signal(Number) declare changed: (n: number) => void;

    constructor() {
        super();

        this.#onChange();

        subprocess(
            ['bash', '-c', 'wl-paste --watch echo'],
            (output) => {
                this.#onChange();
            },
            (err) => logError(err),
        )
    }

    #onChange() {
        const lines = exec(['bash', '-c', 'cliphist list']).split("\n");
        const entries: { id: number, text: string }[] = [];

        if (lines[0] != "") {
            lines.forEach((line, index) => {

                const words: string[] = line.split('\t');

                entries.push(
                    {
                        id: Number(words[0]),
                        text: words.slice(1).join(" "),
                    }
                )
            });
        }

        this.entries = entries;
        this.emit('changed', this.entries);
        this.emit('entries_changed', this.entries);
    }
}



const service = new ClipboardService;
export default service;