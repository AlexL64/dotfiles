import { bind, GObject, Variable } from "astal";
import { App, Astal, astalify, type ConstructProps, Gtk } from "astal/gtk3";

class GtkCalendar extends astalify(Gtk.Calendar) {
    static { GObject.registerClass(this) }

    constructor(props: ConstructProps<
        GtkCalendar,
        Gtk.Calendar.ConstructorProps
    >) {
        super(props as any)
    }
}

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
            <label className={"uptime"} label={bind(uptime).as((u) => `Uptime: ${u}`)} />
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