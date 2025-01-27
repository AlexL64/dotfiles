import GObject, { register, property, signal } from "astal/gobject"
import { exec, subprocess } from "astal";

@register({ GTypeName: "Clipboard" })
export default class Clipboard extends GObject.Object {
    static instance: Clipboard;
    static get_default() {
        if (!this.instance)
            this.instance = new Clipboard();

        return this.instance;
    }

    @property(Object)
    entries: { id: number; text: string; }[] = [];

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
        this.notify("entries");
    }
}