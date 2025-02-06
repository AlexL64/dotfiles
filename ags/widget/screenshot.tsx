import { bind, execAsync, timeout } from "astal";
import { App, Astal } from "astal/gtk3";


export default function Screenshot() {

    return <window
        name={"screenshot"}
        anchor={Astal.WindowAnchor.TOP}
        exclusivity={Astal.Exclusivity.IGNORE}
        layer={Astal.Layer.OVERLAY}
        marginTop={6}
        application={App}
        visible={false}
        setup={(self) => {
            self.hook(bind(self, "visible"), (_, visible) => {
                if (visible) {
                    self.set_opacity(1);
                }
            })

            self.hook(bind(self, "opacity"), (_, opacity) => {
                if (opacity == 0) {
                    timeout(10, () => {
                        self.hide();
                    })
                }
            })
        }}>
        <box className={"screenshot"} spacing={4}>
            <button
                className={"select"}
                label={""}
                tooltipText={"Select"}
                cursor={"pointer"}
                onClick={(self, event) => {
                    App.get_window("screenshot")?.set_opacity(0);
                    switch (event.button) {
                        case 1:
                            execAsync(["bash", "-c", "killall slurp & hyprshot -m region -o ~/Pictures/Screenshots/"]);
                            break;
                        case 3:
                            execAsync(["bash", "-c", "killall slurp & hyprshot -z -m region -o ~/Pictures/Screenshots/"]);
                            break;
                    }
                }}
            />
            <button
                className={"window"}
                label={""}
                tooltipText={"Window"}
                cursor={"pointer"}
                onClick={(self, event) => {
                    App.get_window("screenshot")?.set_opacity(0);
                    timeout(100);
                    switch (event.button) {
                        case 1:
                            execAsync(["bash", "-c", "killall slurp & hyprshot -m window -o ~/Pictures/Screenshots/"]);
                            break;
                        case 3:
                            execAsync(["bash", "-c", "killall slurp & hyprshot -z -m window -o ~/Pictures/Screenshots/"]);
                            break;
                    }
                }}
            />
            <button
                className={"screen"}
                label={""}
                tooltipText={"Screen"}
                cursor={"pointer"}
                onClick={(self, event) => {
                    App.get_window("screenshot")?.set_opacity(0);
                    timeout(100);
                    switch (event.button) {
                        case 1:
                            execAsync(["bash", "-c", "killall slurp & hyprshot -m output -o ~/Pictures/Screenshots/"]);
                            break;
                        case 3:
                            execAsync(["bash", "-c", "killall slurp & hyprshot -z -m output -o ~/Pictures/Screenshots/"]);
                            break;
                    }
                }}
            />
        </box>
    </window>
}