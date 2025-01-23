import { bind } from "astal";
import Wp from "gi://AstalWp";

const { audio, video } = Wp.get_default()!;

export default function Privacy() {
    return (
        <box
            className={"privacy"}
            visible={false}
            setup={(self) => {
                self.hook(bind(audio, "recorders"), (_) => { self.visible = IsVisible() })
                self.hook(bind(video, "recorders"), (_) => { self.visible = IsVisible() })
            }}>
            <label
                className={"audio-recorders"}
                label={""}
                visible={bind(audio, "recorders").as((r) => r.length > 0)}
                hasTooltip
                onQueryTooltip={(self, x, y, kbtt, tooltip) => {
                    tooltip.set_custom(TooltipText(audio.recorders));
                    return true;
                }}
            />
            <box className={"separator"} />
            <label
                className={"video-recorders"}
                label={""}
                visible={bind(video, "recorders").as((r) => r.length > 0)}
                hasTooltip
                onQueryTooltip={(self, x, y, kbtt, tooltip) => {
                    tooltip.set_custom(TooltipText(video.recorders));
                    return true;
                }}
            />
        </box>
    );
}

function TooltipText(endpoints: Wp.Endpoint[]) {
    return <box vertical>
        {
            endpoints.map(e => {
                return <box spacing={10}>
                    <icon icon={e.icon} />
                    <label label={e.name} />
                </box>
            })
        }
    </box>
}

function IsVisible() {

    const audioRecorders = audio.recorders.length > 0;
    const videoRecorders = video.recorders.length > 0;

    if (audioRecorders || videoRecorders) {
        return true
    }

    return false;
}