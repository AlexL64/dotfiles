import { bind, execAsync, subprocess, Variable } from "astal";


export default function Notifications() {

    const icon = Variable("󰂚");
    const number = Variable("0");

    subprocess(
        ['bash', '-c', 'swaync-client -swb'],
        (output) => {
            const response = JSON.parse(output);
            number.set(response.text);
            response.class.includes("dnd") || response.class[0].includes("dnd") ? icon.set("󰂛") : icon.set("󰂚");
        },
    )

    return <button
        className={"notifications"}
        onClick={(self, event) => {
            switch (event.button) {
                case 1:
                    execAsync("swaync-client -t -sw");
                    break;
                case 3:
                    execAsync("swaync-client -d -sw")
                    break;
                default: break;
            }
        }}
    >
        <box>
            <label className={"icon"} label={bind(icon)} />
            <label className={"number"} label={bind(number)} />
        </box>
    </button>
}