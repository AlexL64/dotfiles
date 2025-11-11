import { createBinding } from "ags";
import { Gtk } from "ags/gtk4";
import WirePlumber from "gi://AstalWp?version=0.1"

const { audio, video } = WirePlumber.get_default()!;

export default function Privacy() {

    const audio_recorders = createBinding(audio, "recorders");
    const video_recorders = createBinding(video, "recorders");

    return (
        <box
            class={"privacy"}
            visible={false}
            $={(self) => {

                audio_recorders.subscribe(() => {
                    self.visible = IsVisible();
                });

                video_recorders.subscribe(() => {
                    self.visible = IsVisible();
                });
            }}>
            <label
                class={"audio-recorders"}
                label={""}
                visible={audio_recorders.as((r) => r.length > 0)}
                hasTooltip
                onQueryTooltip={(self, x, y, kbtt, tooltip) => {
                    tooltip.set_custom(TooltipText(audio.recorders));
                    return true;
                }}
            />
            <box class={"separator"} />
            <label
                class={"video-recorders"}
                label={""}
                visible={audio_recorders.as((r) => r.length > 0)}
                hasTooltip
                onQueryTooltip={(self, x, y, kbtt, tooltip) => {
                    tooltip.set_custom(TooltipText(video.recorders));
                    return true;
                }}
            />
        </box>
    );
}

function TooltipText(endpoints: WirePlumber.Stream[]): Gtk.Widget {
    return <box orientation={Gtk.Orientation.VERTICAL}>
        {
            endpoints.map(e => {
                return <box spacing={10}>
                    <image iconName={e.icon} />
                    <label label={e.name} />
                </box>
            })
        }
    </box> as Gtk.Widget
}

function IsVisible() {

    const audioRecorders = audio.recorders.length > 0;
    const videoRecorders = video.recorders.length > 0;

    if (audioRecorders || videoRecorders) {
        return true
    }

    return false;
}