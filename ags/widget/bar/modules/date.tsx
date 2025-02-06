import { bind, Variable } from "astal";
import { App } from "astal/gtk3";

export default function Date() {
    const date = Variable("").poll(1000, 'date +"%A, %d. %b  %H:%M"')

    return <button
        className={"date"}
        cursor={"pointer"}
        onClicked={() => {
            App.toggle_window("calendar");
        }}>
        <label label={bind(date)} />
    </button>
}