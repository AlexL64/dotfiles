// import { Widget, Gtk } from "imports";
import Gtk from "../types/@girs/gtk-3.0/gtk-3.0.js";

const { Box, Label, Button, Icon } = Widget;
// import { icon } from "lib/icons"


const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const generateCalendar = (month, year) => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks = [];

    let week = [];

    let prevMonthLastDay = new Date(year, month, 0).getDate();
    let prevMonthDays = firstDayOfMonth;
    for (let i = prevMonthLastDay - prevMonthDays + 1; i <= prevMonthLastDay; i++) {
        week.push(i);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        week.push(i);
        if (week.length === 7) {
            weeks.push(week);
            week = [];
        }
    }

    if (week.length > 0) {
        const remainingDays = 7 - week.length;
        for (let i = 0; i <= remainingDays; i++) {
            week.push(i);
        }
        weeks.push(week);
    }

    return weeks;
};

function GridCalendar() {
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let gridCalendar;
    let dayLabels = [];

    const updateGridCalendar = () => {
        const updatedWeeks = generateCalendar(currentMonth, currentYear);

        if (!gridCalendar) {
            gridCalendar = new Gtk.Grid({
                halign: Gtk.Align.CENTER,
                valign: Gtk.Align.CENTER,
            });
        }

        dayLabels.forEach(label => gridCalendar.remove(label));
        dayLabels = [];

        daysOfWeek.forEach((day, index) => {
            const dayLabel = Widget.Label({ label: day });
            dayLabel.get_style_context().add_class("calendar-days");
            gridCalendar.attach(dayLabel, index, 0, 1, 1);
            dayLabels.push(dayLabel);
        });

        updatedWeeks.forEach((week, rowIndex) => {
            week.forEach((day, columnIndex) => {
                const dayLabel = Widget.Label({ label: day.toString() || '' });
                dayLabel.get_style_context().add_class('calendar-day');
                if (day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) {
                    dayLabel.set_markup(`<b>${day}</b>`);
                    dayLabel.get_style_context().add_class("calendar-today");
                }
                gridCalendar.attach(dayLabel, columnIndex, rowIndex + 1, 1, 1);
                dayLabels.push(dayLabel);
            });
        });

        gridCalendar.show_all();
    };

    const changeMonth = (offset) => {
        currentMonth += offset;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear -= 1;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear += 1;
        }
        monthLabel.set_text(monthNamesShort[currentMonth]);
        yearLabel.set_text(currentYear.toString());
        updateGridCalendar();
    };

    const changeYear = (offset) => {
        currentYear += offset;
        yearLabel.set_text(currentYear.toString());
        updateGridCalendar();
    };

    const monthLabel = Widget.Label({ label: monthNamesShort[currentMonth] });
    monthLabel.get_style_context().add_class("calendar-month-label");

    const yearLabel = Widget.Label({ label: currentYear.toString() });
    yearLabel.get_style_context().add_class("calendar-year-label");

    const header = (
        Box(
            {
                vertical: false,
                spacing: 10,
                hpack: "center",
                vpack: "center",
            },
            Button(
                {
                    className: "calendar month arrow-left",
                    hpack: "center",
                    vpack: "center",
                    onClicked: () => changeMonth(-1)
                },
                Icon({ icon: "" })
            ),
            monthLabel,
            Button(
                {
                    className: "calendar month arrow-right",
                    hpack: "center",
                    vpack: "center",
                    onClicked: () => changeMonth(1)
                },
                Icon({ icon: "" })
            ),

            Button(
                {
                    className: "calendar return-today",
                    hpack: "center",
                    vpack: "center",
                    onClicked: () => {
                        currentMonth = new Date().getMonth();
                        currentYear = new Date().getFullYear();
                        monthLabel.set_text(monthNamesShort[currentMonth]);
                        yearLabel.set_text(currentYear.toString());
                        updateGridCalendar();
                    }
                },
                Icon({
                    icon: "nix-snowflake-symbolic"
                }),
            ),
            Button(
                {
                    className: "calendar year arrow-left",
                    hpack: "center",
                    vpack: "center",
                    onClicked: () => changeYear(-1)
                },
                Icon({ icon: "" })
            ),
            yearLabel,
            Button(
                {
                    className: "calendar year arrow-right",
                    hpack: "center",
                    vpack: "center",
                    onClicked: () => changeYear(1)
                },
                Icon({ icon: "" }),
            ),
        )
    );

    updateGridCalendar();

    return (
        Box({
            vertical: true,
            hpack: "center",
            vpack: "center",
        },
            header,
            // @ts-ignore
            gridCalendar
        )
    )
}

export default GridCalendar;