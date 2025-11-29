import { createState, With } from "ags";
import { monitorFile } from "ags/file";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import App from "ags/gtk4/app";
import { exec } from "ags/process";
import GdkPixbuf from "gi://GdkPixbuf";

export default function Wallpapers() {

    const home = exec(["bash", "-c", "echo $HOME"]);

    const [wallpapersPaths, wallpapersPathsSet] = createState(exec(["ls", "-1", `${home}/Wallpaper/`]));
    const [selectedWallpaper, selectedWallpaperSet] = createState(exec(["bash", "-c", "basename $(swww query | grep -oP '(?<=image: ).*')"]));

    const [wallpapers, WallpapersSet] = createState(getWallpapers(home, wallpapersPaths.get()));
    const [selectedIndex, selectedIndexSet] = createState(getIndex(wallpapers.get(), selectedWallpaper.get()));

    const [wallpapersSlice, wallpapersSliceSet] = createState(getWallpaperSlice(wallpapers.get(), selectedIndex.get()));

    return <window
        name={"Wallpapers"}
        exclusivity={Astal.Exclusivity.NORMAL}
        layer={Astal.Layer.OVERLAY}
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
        visible={false}
        onNotifyVisible={(self) => {
            if (self.visible) {
                selectedWallpaperSet(exec(["bash", "-c", "basename $(swww query | grep -oP '(?<=image: ).*')"]));
                selectedIndexSet(getIndex(wallpapers.get(), selectedWallpaper.get()));
                wallpapersSliceSet(getWallpaperSlice(wallpapers.get(), selectedIndex.get()));
            }
        }}
        $={(self) => {
            monitorFile(`${home}/Wallpaper`, () => {
                const list = exec(["ls", "-1", `${home}/Wallpaper/`]);

                if (wallpapersPaths.get() != list) {
                    wallpapersPathsSet(list);
                    WallpapersSet(getWallpapers(home, wallpapersPaths.get()));
                    selectedIndexSet(getIndex(wallpapers.get(), selectedWallpaper.get()));
                    wallpapersSliceSet(getWallpaperSlice(wallpapers.get(), selectedIndex.get()));
                }
            })

            const eventControllerKey = new Gtk.EventControllerKey();

            self.add_controller(eventControllerKey);

            eventControllerKey.connect("key-pressed", (_, keyval, keycode, state) => {
                switch (keyval) {
                    case Gdk.KEY_Left:
                        if (selectedIndex.get() - 1 < 0) {
                            selectedIndexSet(wallpapers.get().length - 1);
                        } else {
                            selectedIndexSet(selectedIndex.get() - 1);
                        }
                        wallpapersSliceSet(getWallpaperSlice(wallpapers.get(), selectedIndex.get()));
                        break;
                    case Gdk.KEY_Right:
                        if (selectedIndex.get() + 1 > wallpapers.get().length - 1) {
                            selectedIndexSet(0);
                        } else {
                            selectedIndexSet(selectedIndex.get() + 1);
                        }
                        wallpapersSliceSet(getWallpaperSlice(wallpapers.get(), selectedIndex.get()));
                        break;
                    case Gdk.KEY_Return:
                        const types = ["grow", "outer"];
                        const positions = ["center", "bottom", "top", "left", "right", "bottom-right", "bottom-left", "top-right", "top-left"];
                        exec([
                            "swww",
                            "img",
                            `${home}/Wallpaper/${selectedWallpaper.get()}`,
                            "--transition-type",
                            `${types[Math.floor(Math.random() * types.length)]}`,
                            "--transition-pos",
                            `${positions[Math.floor(Math.random() * positions.length)]}`,
                        ]);
                        self.hide();
                        break;
                    case Gdk.KEY_Escape:
                        self.hide();
                        break;
                }
            })
        }}>
        <With value={wallpapersSlice}>
            {(wallpapers) => {
                return <box class={"wallpapers"} spacing={10}>
                    {
                        wallpapers.map((wallpaper) => {
                            return <Gtk.Picture $={(self) => {

                                self.set_pixbuf(wallpaper.pixbuf);

                                if (wallpaper == wallpapers[2]) {
                                    self.add_css_class("selected");
                                    selectedWallpaperSet(wallpaper.wallpaper);
                                }
                            }} />
                        })
                    }
                </box>
            }}
        </With>
    </window >
}

function getWallpapers(home: string, wallpapersPaths: string): { wallpaper: string; pixbuf: GdkPixbuf.Pixbuf | null; }[] {

    const wallpapers = wallpapersPaths.split("\n").map((wallpaper) => {
        const pixbuf = GdkPixbuf.Pixbuf.new_from_file(`${home}/Wallpaper/${wallpaper}`);

        const width = pixbuf.get_width();
        const height = pixbuf.get_height();

        var x = 0;
        var y = 0;
        var shorterSide = 0;

        if (width > height) {
            x = (width - height) / 2;
            y = 0;
            shorterSide = height;
        } else {
            x = 0;
            y = (height - width) / 2;
            shorterSide = width;
        }

        const croppedPixbuf = pixbuf.new_subpixbuf(x, y, shorterSide, shorterSide);
        const resizedPixbuf = croppedPixbuf.scale_simple(250, 250, GdkPixbuf.InterpType.BILINEAR);

        return { wallpaper: wallpaper, pixbuf: resizedPixbuf };
    })

    return wallpapers;
}

function getIndex(wallpapers: { wallpaper: string; pixbuf: GdkPixbuf.Pixbuf | null; }[], selectedWallpaper: string): number {

    var selectedIndex = 0;

    wallpapers.forEach((wallpaper, index) => {
        if (wallpaper.wallpaper == selectedWallpaper) {
            selectedIndex = index;
        }
    })

    return selectedIndex;
}

function getWallpaperSlice(wallpapers: { wallpaper: string; pixbuf: GdkPixbuf.Pixbuf | null; }[], selectedIndex: number) {

    if (selectedIndex + 3 > wallpapers.length) {
        return wallpapers.slice(selectedIndex - 2, wallpapers.length).concat(wallpapers.slice(0, 3 - (wallpapers.length - selectedIndex)));
    }

    if (selectedIndex - 2 < 0) {
        return wallpapers.slice(wallpapers.length - (2 - selectedIndex), wallpapers.length).concat(wallpapers.slice(0, selectedIndex + 3));
    }

    return wallpapers.slice(selectedIndex - 2, selectedIndex + 3);
}