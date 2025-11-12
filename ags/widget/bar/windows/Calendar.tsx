import { Astal, Gtk } from "ags/gtk4";
import { createPoll } from "ags/time";
import App from "ags/gtk4/app"

export default function Calendar() {

    const time = createPoll("", 1000, 'date +"%H:%M"');

    const date = createPoll("", 60000, 'date +"%B %d, %Y"');

    const uptime = createPoll("", 1000, `bash -c "uptime -r | awk '{print $2}'"`);

    return <window
        name={"Calendar"}
        marginTop={10}
        anchor={Astal.WindowAnchor.TOP}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}>
        <box class={'calendar-box'} orientation={Gtk.Orientation.VERTICAL} spacing={6}>
            <label class={"time"} label={time} />
            <label class={"date"} label={date} />
            <label class={"uptime"} label={uptime.as((u) => `Uptime: ${formatTime(Number(u))}`)} />
            <Gtk.Calendar
                class={"calendar"}
                vexpand
                hexpand
                showDayNames
                showHeading
                showWeekNumbers
            />
        </box>
    </window>
}

function formatTime(seconds: number): string {

    if (seconds == 0) {
        return "";
    } else {
        const totalMinutes = Math.floor(seconds / 60);
        if (totalMinutes < 60) {
            return `${totalMinutes}min`;
        } else {
            const hours = Math.floor(totalMinutes / 60);
            const remainingMinutes = totalMinutes % 60;
            return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
        }
    }

}