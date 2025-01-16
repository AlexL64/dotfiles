import { GObject } from "astal";
import { astalify, ConstructProps, Gtk } from "astal/gtk3";

export class GtkMenu extends astalify(Gtk.Menu) {
    static { GObject.registerClass(this) }

    constructor(props: ConstructProps<
        GtkMenu,
        Gtk.Menu.ConstructorProps
    >) {
        super(props as any)
    }
}

export class GtkMenuItem extends astalify(Gtk.MenuItem) {
    static { GObject.registerClass(this) }

    constructor(props: ConstructProps<
        GtkMenuItem,
        Gtk.MenuItem.ConstructorProps
    >) {
        super(props as any)
    }
}

export class GtkCheckButton extends astalify(Gtk.CheckButton) {
    static { GObject.registerClass(this) }

    constructor(props: ConstructProps<
        GtkCheckButton,
        Gtk.CheckButton.ConstructorProps
    >) {
        super(props as any)
    }
}

export class GtkCalendar extends astalify(Gtk.Calendar) {
    static { GObject.registerClass(this) }

    constructor(props: ConstructProps<
        GtkCalendar,
        Gtk.Calendar.ConstructorProps
    >) {
        super(props as any)
    }
}

export class GtkGrid extends astalify(Gtk.Grid) {
    static { GObject.registerClass(this) }

    constructor(props: ConstructProps<
        GtkGrid,
        Gtk.Grid.ConstructorProps
    >) {
        super(props as any)
    }
}