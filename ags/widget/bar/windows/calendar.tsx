import { bind, Variable } from "astal";
import { App, Astal } from "astal/gtk3";
import { GtkCalendar } from "../../../my_types";

export default function Calendar() {

    const time = Variable("").poll(1000, 'date +"%H:%M"')

    const date = Variable("").poll(60000, 'date +"%B %d, %Y"')

    const uptime = Variable("").poll(60000, `bash -c "uptime | awk '{print $3}' | tr ',' ' '"`)

    return <window
        name={"calendar"}
        marginTop={10}
        anchor={Astal.WindowAnchor.TOP}
        exclusivity={Astal.Exclusivity.NORMAL}
        application={App}
        visible={false}>
        <box className={'calendar-box'} vertical spacing={6}>
            <label className={"time"} label={bind(time)} />
            <label className={"date"} label={bind(date)} />
            <label className={"uptime"} label={bind(uptime).as((u) => `Uptime: ${formatTime(Number(u))}`)} />
            <GtkCalendar
                className={"calendar"}
                expand
                showDayNames
                showDetails={false}
                showHeading
                showWeekNumbers
            />
        </box>
    </window>
}

function formatTime(minutes: number) {
    if (minutes < 60) {
        return `${minutes}min`;
    } else {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
    }
}